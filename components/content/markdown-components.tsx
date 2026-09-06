import type { Components } from "react-markdown";
import { ProseCodeBlock } from "@/components/content/prose-code-block";

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
 * Props tables (header row starting "Prop | Type") are stamped with
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
  return first === "prop" && second === "type";
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
  table: ({ node, ...props }) => (
    <div className="my-5 overflow-x-auto">
      <table {...props} data-props-table={isPropsTable(node) ? "" : undefined} />
    </div>
  ),
  pre: ({ node, children, ...props }) => (
    <ProseCodeBlock>
      <pre {...props}>{children}</pre>
    </ProseCodeBlock>
  ),
};
