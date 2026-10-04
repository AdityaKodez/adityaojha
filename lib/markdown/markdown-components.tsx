import type { Components } from "react-markdown";
import { Children, cloneElement, isValidElement, type ReactNode } from "react";
import { ProseCodeBlock } from "@/lib/markdown/prose-code-block";
import { cn } from "@/lib/utils";

interface AstNode {
  type?: string;
  tagName?: string;
  value?: string;
  children?: AstNode[];
}

function nodeText(node: AstNode): string {
  if (typeof node.value === "string" && node.children === undefined) return node.value;
  if (node.tagName === "br" || node.type === "break") return " ";
  return (node.children ?? []).map(nodeText).join("");
}

function findFirstRow(node: AstNode): AstNode | undefined {
  if (node.tagName === "tr" || node.type === "tableRow") return node;
  for (const child of node.children ?? []) {
    const found = findFirstRow(child);
    if (found) return found;
  }
  return undefined;
}

/**
 * Props and item-field tables (header row starting "Prop | Type" or
 * "Field | Type") are stamped with
 * `data-props-table` so the stylesheet can stack them row-by-row on small
 * screens. Every other table keeps the plain GFM table.
 */
function isPropsTable(node: unknown): boolean {
  if (!node || typeof node !== "object") return false;
  const headerRow = findFirstRow(node as AstNode);
  const cells = (headerRow?.children ?? []).filter(
    (child) =>
      child.tagName === "th" || child.tagName === "td" || child.type === "tableCell"
  );
  const [first, second] = cells
    .slice(0, 2)
    .map((cell) => nodeText(cell).trim().toLowerCase());
  return (first === "prop" || first === "field") && second === "type";
}

interface TableElementProps {
  children?: ReactNode;
  "data-required-prop"?: string;
}

function childText(children: ReactNode): string {
  return Children.toArray(children)
    .map((child) => {
      if (isValidElement<TableElementProps>(child)) {
        return childText(child.props.children);
      }
      return typeof child === "string" || typeof child === "number" ? String(child) : "";
    })
    .join("");
}

function labelRequiredProps(children: ReactNode): ReactNode {
  return Children.map(children, (child) => {
    if (!isValidElement<TableElementProps>(child)) return child;
    if (child.type !== "tr") {
      return cloneElement(child, {}, labelRequiredProps(child.props.children));
    }

    const cells = Children.toArray(child.props.children).filter(
      (cell) => isValidElement<TableElementProps>(cell) && cell.type === "td",
    );
    const defaultCell = cells[2];
    if (
      !isValidElement<TableElementProps>(defaultCell) ||
      childText(defaultCell.props.children).trim().toLowerCase() !== "required"
    ) {
      return child;
    }

    let cellIndex = 0;
    return cloneElement(
      child,
      { "data-required-prop": "" },
      Children.map(child.props.children, (cell) => {
        if (!isValidElement<TableElementProps>(cell) || cell.type !== "td") return cell;
        const index = cellIndex++;
        if (index === 0) {
          return cloneElement(cell, {}, (
            <>
              {cell.props.children}{" "}
              <sup data-required-label="">Required</sup>
            </>
          ));
        }
        return index === 2 ? cloneElement(cell, {}, "-") : cell;
      }),
    );
  });
}

/**
 * Element overrides shared by every markdown surface (`/components/[id]` docs
 * and project case studies) so rendered prose stays identical across them.
 *
 * Tables are wrapped in a scroll container: the docs layout uses
 * `overflow-x-clip`, so a wide table would otherwise be cut off instead
 * of scrolling. Visual table styling lives in `app/globals.css` (`.prose table`).
 *
 * `pre` is wrapped by `ProseCodeBlock` which adds a hover-reveal copy button
 * to every fenced code block without needing a second syntax-highlight pass.
 */
export const markdownComponents: Components = {
  table: ({ node, children, ...props }) => {
    const propsTable = isPropsTable(node);
    return (
      <div className="my-5 overflow-x-auto">
        <table {...props} data-props-table={propsTable ? "" : undefined}>
          {propsTable ? labelRequiredProps(children) : children}
        </table>
      </div>
    );
  },
  pre: ({ node, children, className, ...props }) => (
    <ProseCodeBlock>
      <pre
        className={cn(
          "no-scrollbar [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          className,
        )}
        {...props}
      >
        {children}
      </pre>
    </ProseCodeBlock>
  ),
};
