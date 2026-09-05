"use client";

import {
  Contrast,
  FolderOpen,
  Home,
  Layers,
  Link,
  Monitor,
  Moon,
  Sun,
} from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useMemo } from "react";

import { getComponentIcon } from "@/components/showcase/component-icons";
import {
  CommandPalette,
  type CommandPaletteGroup,
  type CommandPaletteItem,
  type CommandPalettePage,
} from "@/components/ui/command-palette";
import { getEnabledComponents } from "@/config/components";
import { projectsConfig } from "@/config/projects";
import { siteConfig } from "@/config/site";

/**
 * The site-wide command palette, mounted once in the header. Every route is a
 * couple of keystrokes away — top-level pages, each showcase component, each
 * case study — plus theme controls and quick actions.
 */
export function SiteCommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const { setTheme } = useTheme();

  const groups = useMemo<CommandPaletteGroup[]>(() => {
    const go = (href: string) => () => router.push(href);

    const componentItems: CommandPaletteItem[] = getEnabledComponents().map(
      (component) => {
        const Icon = getComponentIcon(component.icon);
        return {
          id: `component-${component.id}`,
          label: component.title,
          icon: <Icon className="size-4" />,
          keywords: ["component", "showcase", component.id],
          onSelect: go(`/components/${component.id}`),
        };
      },
    );

    const projectItems: CommandPaletteItem[] = projectsConfig.map((project) => ({
      id: `project-${project.id}`,
      label: project.title,
      icon: <FolderOpen className="size-4" />,
      keywords: ["project", "case study", project.category, project.id],
      onSelect: go(`/project/${project.id}`),
    }));

    return [
      {
        label: "Navigate",
        items: [
          {
            id: "go-home",
            label: "Home",
            icon: <Home className="size-4" />,
            keywords: ["landing", "start", "top"],
            onSelect: go("/"),
          },
          {
            id: "go-components",
            label: "All components",
            icon: <Layers className="size-4" />,
            keywords: ["registry", "catalog", "showcase"],
            onSelect: go("/components"),
          },
        ],
      },
      { label: "Components", items: componentItems },
      { label: "Projects", items: projectItems },
      {
        label: "Actions",
        items: [
          {
            id: "open-github",
            label: "Open GitHub",
            icon: <FaGithub className="size-4" />,
            badge: "external",
            keywords: ["repo", "source", "repository", "code", "stars"],
            onSelect: () =>
              window.open(siteConfig.banner.openSourceUrl, "_blank"),
          },
          {
            id: "copy-url",
            label: "Copy site URL",
            icon: <Link className="size-4" />,
            keywords: ["link", "share", "address", "copy"],
            onSelect: () => {
              navigator.clipboard
                ?.writeText(siteConfig.meta.url)
                .catch(() => {});
            },
          },
          {
            id: "change-theme",
            label: "Change theme…",
            icon: <Contrast className="size-4" />,
            keywords: ["dark", "light", "system", "appearance", "mode"],
            page: "theme",
          },
        ],
      },
    ];
  }, [router]);

  const pages = useMemo<CommandPalettePage[]>(
    () => [
      {
        id: "theme",
        label: "Theme",
        placeholder: "Search themes…",
        items: [
          {
            id: "theme-light",
            label: "Light",
            icon: <Sun className="size-4" />,
            onSelect: () => setTheme("light"),
          },
          {
            id: "theme-dark",
            label: "Dark",
            icon: <Moon className="size-4" />,
            onSelect: () => setTheme("dark"),
          },
          {
            id: "theme-system",
            label: "System",
            icon: <Monitor className="size-4" />,
            onSelect: () => setTheme("system"),
          },
        ],
      },
    ],
    [setTheme],
  );

  return (
    <CommandPalette
      groups={groups}
      pages={pages}
      open={open}
      onOpenChange={onOpenChange}
      recents
      disableOnMobile
      hotkey={false}
    />
  );
}
