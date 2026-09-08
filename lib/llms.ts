/**
 * Generators for the `llms.txt` index and the `llms-full.txt` single-file dump.
 *
 * Both are derived entirely from `config/`, so content never has to be kept in
 * sync by hand. Everything is server-only: the routes that call these are
 * prerendered at build time.
 */

import { readFile } from "node:fs/promises";
import path from "node:path";

import { componentRegistry, getEnabledComponents } from "@/config/components";
import { experienceConfig } from "@/config/experience";
import { projectsConfig } from "@/config/projects";
import type { ComponentDoc, Project } from "@/config/types";
import {
  PACKAGE_MANAGERS,
  getAddCommands,
  getRegistrySetupSnippet,
  registryConfig,
  siteUrl,
} from "@/config/registry";
import { skillsConfig, skillsSectionConfig } from "@/config/skills";
import { siteConfig } from "@/config/site";
import { socialsConfig } from "@/config/socials";

/** House rule: no em dashes anywhere in generated copy. */
function dedash(input: string): string {
  return input.replace(/\u2014/g, "-").replace(/\u2013/g, "-");
}

/** Collapse to a single line for use inside a link list. */
function oneLine(input: string): string {
  return dedash(input).replace(/\s+/g, " ").trim();
}

/** Strip a UTF-8 BOM if a content file carries one. */
function stripBom(input: string): string {
  return input.replace(/^\uFEFF/, "");
}

function projectUrl(project: Project): string {
  return `${siteUrl}/project/${project.id}`;
}

function componentUrl(component: ComponentDoc): string {
  return `${siteUrl}/components/${component.id}`;
}

function enabledProjects(): Project[] {
  return [...projectsConfig]
    .filter((p) => p.enabled !== false)
    .sort((a, b) => a.order - b.order);
}

function enabledComponents(): ComponentDoc[] {
  return getEnabledComponents();
}

function stackLines(): string[] {
  return skillsSectionConfig.categories.map((category) => {
    const names = [...skillsConfig]
      .filter((s) => s.enabled !== false && s.category === category.id)
      .sort((a, b) => a.order - b.order)
      .map((s) => s.name);
    return names.length > 0
      ? `- ${category.label}: ${names.join(", ")}`
      : `- ${category.label}: none listed`;
  });
}

function contactLines(): string[] {
  return [...socialsConfig]
    .filter((s) => s.enabled !== false)
    .sort((a, b) => a.order - b.order)
    .map((s) => {
      const target = s.href ?? s.copyValue ?? s.handle;
      return target
        ? `- ${s.platform}: ${s.handle} (${target})`
        : `- ${s.platform}: ${s.handle}`;
    });
}

function projectIndexLines(): string[] {
  return enabledProjects().map(
    (p) => `- [${oneLine(p.title)}](${projectUrl(p)}): ${oneLine(p.description)}`,
  );
}

function componentIndexLines(): string[] {
  return enabledComponents().map(
    (c) =>
      `- [${oneLine(c.title)}](${componentUrl(c)}): ${oneLine(c.description)}`,
  );
}

function registryPreamble(): string[] {
  return [
    "Every component below is published as a shadcn registry. Add the namespace to your `components.json` once, then install any item by direct URL.",
    "",
    "```json",
    getRegistrySetupSnippet(),
    "```",
    "",
    "```bash",
    `npx shadcn@latest add ${siteUrl}/r/<name>.json`,
    "```",
  ];
}

/**
 * `llms.txt`: a short, link-dense index. Follows the llmstxt.org shape, an H1,
 * a blockquote summary, then `##` sections of `- [name](url): description`.
 */
export function buildLlmsTxt(): string {
  const { meta, personal, about } = siteConfig;

  const sections: string[] = [
    `# ${personal.fullName}`,
    "",
    `> ${oneLine(meta.description)}`,
    "",
    `Independent full-stack developer based in ${personal.location.label}. Builds SaaS products end to end: from the first rough idea to product flows, data models, deployment, and the moment real people use them.`,
    "",
    "## About",
    "",
    oneLine(about.body),
    "",
    "## Projects",
    "",
    ...projectIndexLines(),
    "",
    "## Components",
    "",
    ...registryPreamble(),
    "",
    ...componentIndexLines(),
    "",
    "## Stack",
    "",
    ...stackLines(),
    "",
    "## Experience",
    "",
    ...experienceConfig
      .filter((e) => e.enabled !== false)
      .sort((a, b) => a.order - b.order)
      .map(
        (e) =>
          `- ${oneLine(e.role)}, ${oneLine(e.company)} (${oneLine(e.period)}): ${oneLine(e.summary)}`,
      ),
    "",
    "## Contact",
    "",
    ...contactLines(),
    "",
    "## Optional",
    "",
    `- [Full plain-text version of this site](${siteUrl}/llms-full.txt): about, every project case study, and every component doc in one file`,
    `- [Component registry index](${registryConfig.indexUrl}): machine-readable index consumed by \`shadcn search\` and \`shadcn view\``,
    `- [Sitemap](${siteUrl}/sitemap.xml)`,
    `- [Source code](${siteConfig.banner.openSourceUrl}): this site is open source`,
  ];

  return `${sections.join("\n")}\n`;
}

/** Reads a component's markdown doc. Returns null when the file is missing. */
async function readComponentDoc(component: ComponentDoc): Promise<string | null> {
  try {
    const raw = await readFile(
      path.join(/*turbopackIgnore: true*/ process.cwd(), component.docPath),
      "utf8",
    );
    return dedash(stripBom(raw)).trim();
  } catch {
    return null;
  }
}

/**
 * `llms-full.txt`: the whole site inlined. No links to follow, no truncation,
 * so a model can answer from this file alone.
 */
export async function buildLlmsFullTxt(): Promise<string> {
  const { meta, personal, about, services, workflow, contact } = siteConfig;

  const sections: string[] = [
    `# ${personal.fullName}`,
    "",
    `> ${oneLine(meta.description)}`,
    "",
    `Independent full-stack developer based in ${personal.location.label}. Builds SaaS products end to end: from the first rough idea to product flows, data models, deployment, and the moment real people use them.`,
    "",
    "## About",
    "",
    dedash(about.body),
    "",
    "## Stack",
    "",
    ...stackLines(),
    "",
    "## Experience",
    "",
  ];

  for (const item of experienceConfig
    .filter((e) => e.enabled !== false)
    .sort((a, b) => a.order - b.order)) {
    sections.push(
      `### ${oneLine(item.role)}, ${oneLine(item.company)} (${oneLine(item.period)})`,
      "",
      dedash(item.summary),
      "",
      ...(item.highlights ?? []).map((h) => `- ${dedash(h)}`),
      "",
    );
  }

  sections.push("## Projects", "");

  for (const project of enabledProjects()) {
    const links = [
      project.liveUrl ? `- Live: ${project.liveUrl}` : null,
      project.githubUrl ? `- Source: ${project.githubUrl}` : null,
      `- Case study: ${projectUrl(project)}`,
    ].filter((l): l is string => l !== null);

    sections.push(
      `### ${oneLine(project.title)}`,
      "",
      `${oneLine(project.description)}`,
      "",
      `Year: ${project.year} | Status: ${project.status} | Category: ${project.category} | Tags: ${project.tags.join(", ")}`,
      "",
      ...links,
      "",
      dedash(project.content ?? ""),
      "",
    );
  }

  sections.push("## Components", "", ...registryPreamble(), "");

  for (const component of enabledComponents()) {
    const commands = getAddCommands(component.id);
    sections.push(
      `### ${oneLine(component.title)}`,
      "",
      `Docs: ${componentUrl(component)}`,
      "",
      dedash(component.description),
      "",
      "Install:",
      "",
      "```bash",
      ...PACKAGE_MANAGERS.map((pm) => commands[pm]),
      "```",
      "",
    );

    const doc = await readComponentDoc(component);
    sections.push(doc ?? "_No documentation file published yet._", "");
  }

  sections.push("## Services", "");
  for (const item of services.items) {
    sections.push(`- ${dedash(item)}`);
  }

  sections.push("", "## How a project runs", "");
  for (const item of workflow.items) {
    sections.push(`- ${oneLine(item.label)}: ${dedash(item.description)}`);
  }

  sections.push("", "## Engagement", "");
  for (const tier of contact.pricing) {
    sections.push(`- ${oneLine(tier.label)}: ${oneLine(tier.value)}. ${dedash(tier.note)}`);
  }

  sections.push("", "## Contact", "", ...contactLines(), "");

  return `${sections.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd()}\n`;
}

/** Exposed so the registry page can link the two files without hardcoding. */
export const llmsRoutes = {
  index: `${siteUrl}/llms.txt`,
  full: `${siteUrl}/llms-full.txt`,
} as const;

/** Total published components, including disabled ones, for sanity checks. */
export const totalComponentCount = componentRegistry.length;
