import type { Components } from "react-markdown";
import { ProseCodeBlock } from "@/components/content/prose-code-block";

/**
 * Element overrides shared by every markdown surface (`/components/[id]` docs
 * and project case studies) so rendered prose stays identical across them.
 *
 * Tables are wrapped in a scroll container: the docs layout uses
 * `overflow-x-clip`, so a wide props table would otherwise be cut off instead
 * of scrolling. Visual table styling lives in `app/globals.css` (`.prose table`).
 *
 * `pre` is wrapped by `ProseCodeBlock` which adds a hover-reveal copy button
 * to every fenced code block without needing a second syntax-highlight pass.
 */
export const markdownComponents: Components = {
  table: ({ node, ...props }) => (
    <div className="my-5 overflow-x-auto">
      <table {...props} />
    </div>
  ),
  pre: ({ node, children, ...props }) => (
    <ProseCodeBlock>
      <pre {...props}>{children}</pre>
    </ProseCodeBlock>
  ),
};
