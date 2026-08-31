## Usage

```tsx
import { ProjectExplorer } from "@/components/project-explorer";

const projects = [
  {
    id: "zeno",
    title: "Zeno — AI Assistant for PostgreSQL",
    year: 2025,
    status: "building",
    category: "ai-tool",
    href: "https://zeno.example.com",
    image: "/images/zeno.png",
  },
  {
    id: "gridly",
    title: "Gridly — Modern UI Component Library",
    year: 2025,
    status: "new",
    category: "design-system",
    href: "https://gridly.example.com",
  },
];

export function PortfolioProjects() {
  return (
    <div className="max-w-2xl mx-auto">
      <ProjectExplorer
        projects={projects}
        showHoverPreview={true}
        defaultOpen="latest"
      />
    </div>
  );
}
```

## Features & Anatomy

The **Interactive Project Explorer** organizes work chronologically with an IDE / file-explorer design language.

- **Year Folders with Animated Expansion.** Projects are categorized by year in collapsible folder groups with dynamic `FolderOpen` / `FolderClosed` Lucide icons and accent tint cycling.
- **Spring-Physics Cursor Image Preview.** Hovering or focusing any project row triggers a floating preview card that follows the cursor using smooth Motion spring values (`stiffness: 260, damping: 26`) with edge-boundary detection.
- **Configurable Hover Preview & Image Fallback.** Toggle cursor preview via `showHoverPreview`. When enabled on items without an image URL, a clean Lucide `ImageIcon` fallback placeholder is rendered automatically.
- **Status Pills.** Highlights project release states such as `building...` (with animated radar ping indicator), `new`, and `shipped`.
- **Flat, Bare Rows.** No dividers or tree guides — each row is a single hoverable target with responsive category tags (`// fullstack`, `// ai-agent`). Hierarchy reads through indentation alone.
- **Full Accessibility & Reduced-Motion.** Disables cursor floating previews gracefully when `prefers-reduced-motion` is detected or on non-hover touch devices.

## Props & Options

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `projects` | `ProjectExplorerItem[]` | `sampleProjects` | Array of project items to display. |
| `title` | `string` | `"Featured Projects"` | Section heading text. |
| `showHeading` | `boolean` | `true` | Show or hide the top section heading rule and title. |
| `defaultOpen` | `"all" \| "latest"` | `"all"` | Open all folders or only the most recent year. |
| `showHoverPreview` | `boolean` | `true` | Toggle floating cursor preview cards on row hover/focus. |
| `className` | `string` | `undefined` | Additional CSS classes for the root container. |

## Data Structure

```ts
export type ProjectStatus = "building" | "new" | "shipped";

export interface ProjectExplorerItem {
  id: string;
  title: string;
  year: number;
  description?: string;
  category?: string;
  status?: ProjectStatus;
  href?: string;
  liveUrl?: string;
  githubUrl?: string;
  image?: string;
  imageAlt?: string;
  enabled?: boolean;
  order?: number;
}
```
