import { readFile } from "node:fs/promises";
import path from "node:path";

import { findComponent } from "@/config/components";
import { formatComponentPageMarkdown } from "@/lib/component-page-markdown";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const component = findComponent(id);
  if (!component) {
    return new Response("Component not found.", { status: 404 });
  }

  const docs = await readFile(path.join(process.cwd(), component.docPath), "utf8");
  return new Response(formatComponentPageMarkdown(component, docs), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": `inline; filename="${component.id}.md"`,
    },
  });
}
