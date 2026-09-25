import type { ComponentDoc } from "@/config/types";
import { getAddCommands } from "@/config/registry";

export function formatComponentPageMarkdown(
  component: ComponentDoc,
  docs: string,
): string {
  return `# ${component.title}\n\n${component.description}\n\n## Installation\n\n\`\`\`bash\n${getAddCommands(component.id).npm}\n\`\`\`\n\n${docs.trim()}\n`;
}
