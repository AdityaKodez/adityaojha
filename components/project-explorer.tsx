"use client";

import { cn } from "@/lib/utils";
import {
  ArrowUpRight,
  FolderClosedIcon,
  FolderOpenIcon,
  ImageIcon,
} from "lucide-react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useSpring,
} from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";

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
  showImage?: boolean;
  enabled?: boolean;
  order?: number;
}

const defaultSampleProjects: ProjectExplorerItem[] = [
  {
    id: "zeno",
    title: "Zeno — AI Assistant for PostgreSQL",
    year: 2025,
    status: "building",
    category: "ai-tool",
    href: "https://zeno.example.com",
    image: "/zeno.png",
  },
  {
    id: "gridly",
    title: "Gridly — Modern UI Component Library",
    year: 2025,
    status: "new",
    category: "design-system",
    href: "https://gridly.example.com",
  },
  {
    id: "rixel",
    title: "Rixel — High Performance Pixel Canvas",
    year: 2024,
    status: "shipped",
    category: "webgl",
    href: "https://rixel.example.com",
    image: "/rixel.png",
  },
  {
    id: "aura",
    title: "Aura — Ambient Audio Workspace",
    year: 2024,
    status: "shipped",
    category: "audio",
    href: "https://aura.example.com",
  },
];

const HOVER_QUERY = "(hover: hover) and (pointer: fine)";

function subscribeHoverCapability(callback: () => void) {
  const mql = window.matchMedia(HOVER_QUERY);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

const getHoverSnapshot = () => window.matchMedia(HOVER_QUERY).matches;
const getServerSnapshot = () => false;

const folderColors = [
  {
    icon: "fill-blue-500/20 text-blue-600 dark:text-blue-400",
    text: "text-blue-600 dark:text-blue-400",
  },
  {
    icon: "fill-amber-500/20 text-amber-600 dark:text-amber-400",
    text: "text-amber-600 dark:text-amber-400",
  },
  {
    icon: "fill-emerald-500/20 text-emerald-600 dark:text-emerald-400",
    text: "text-emerald-600 dark:text-emerald-400",
  },
  {
    icon: "fill-rose-500/20 text-rose-600 dark:text-rose-400",
    text: "text-rose-600 dark:text-rose-400",
  },
];

const PREVIEW_WIDTH = 300;
const PREVIEW_HEIGHT = 210;

function StatusBadge({ status }: { status: ProjectStatus }) {
  if (status === "shipped") return null;

  if (status === "building") {
    return (
      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-sm bg-blue-500/10 px-1.5 py-0.5 font-pixel text-[10px] leading-none text-blue-600 dark:text-blue-400">
        <span className="relative flex size-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-500 opacity-60 motion-reduce:animate-none" />
          <span className="relative inline-flex size-1.5 rounded-full bg-blue-500" />
        </span>
        building&hellip;
      </span>
    );
  }

  return (
    <span className="inline-flex shrink-0 items-center rounded-sm bg-amber-500/10 px-1.5 py-0.5 font-pixel text-[10px] leading-none text-amber-600 dark:text-amber-400">
      new
    </span>
  );
}

interface PreviewHandlers {
  onPreviewStart: (project: ProjectExplorerItem, anchor?: DOMRect) => void;
  onPreviewEnd: () => void;
  showHoverPreview: boolean;
  onProjectClick?: (project: ProjectExplorerItem, targetType: "case_study" | "external_url", url: string) => void;
}

function WorkRow({
  project,
  index,
  onPreviewStart,
  onPreviewEnd,
  showHoverPreview,
  onProjectClick,
}: { project: ProjectExplorerItem; index: number } & PreviewHandlers) {
  const [name, subtitle] = project.title.split(" — ");
  const href = project.href ?? project.liveUrl ?? (project.id ? `/project/${project.id}` : "#");
  const isExternal = Boolean(
    project.liveUrl ||
      (project.href &&
        (project.href.startsWith("http://") ||
          project.href.startsWith("https://"))),
  );

  const handleClick = () => {
    onProjectClick?.(project, isExternal ? "external_url" : "case_study", href);
  };

  return (
    <motion.li
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.24, delay: index * 0.045 }}
      className="relative"
    >
      <Link
        href={href}
        onClick={handleClick}
        {...(isExternal
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
        onMouseEnter={
          showHoverPreview ? () => onPreviewStart(project) : undefined
        }
        onMouseLeave={showHoverPreview ? onPreviewEnd : undefined}
        onFocus={
          showHoverPreview
            ? (event) =>
                onPreviewStart(
                  project,
                  event.currentTarget.getBoundingClientRect(),
                )
            : undefined
        }
        onBlur={showHoverPreview ? onPreviewEnd : undefined}
        className="group micro-transition flex min-h-11 items-center gap-2 rounded-sm px-3 py-2 hover:bg-muted/40 focus-visible:bg-muted/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/20"
      >
        <span className="min-w-0 flex-1 truncate text-sm font-medium transition-colors group-hover:text-primary group-focus-visible:text-primary">
          {subtitle ? (
            <>
              <span className="hidden font-medium text-foreground group-hover:text-primary group-focus-visible:text-primary md:inline">
                {name}
              </span>
              <span className="inline font-normal text-muted-foreground md:ml-4">
                {subtitle}
              </span>
            </>
          ) : (
            name
          )}
        </span>

        {project.status ? <StatusBadge status={project.status} /> : null}

        {project.category ? (
          <span className="ml-auto hidden shrink-0 font-mono text-xs text-muted-foreground/70 sm:block">
            {"// "}
            {project.category}
          </span>
        ) : null}

        <ArrowUpRight
          aria-hidden="true"
          className="size-3.5 shrink-0 text-muted-foreground/30 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary group-focus-visible:-translate-y-0.5 group-focus-visible:translate-x-0.5 group-focus-visible:text-primary"
        />
      </Link>
    </motion.li>
  );
}

export type ProjectExplorerProps = {
  /** The list of projects to display. If omitted, sample projects will be shown. */
  projects?: ProjectExplorerItem[];
  /** Section heading text. Default: "Featured Projects". */
  title?: string;
  /** Hide the section label when the explorer lives inside an already-labelled surface.
   *  Also drops the section's top rule. */
  showHeading?: boolean;
  /** Choose whether every year or only the most recent year starts expanded. */
  defaultOpen?: "all" | "latest";
  /** Enable or disable the floating cursor hover image preview card. Default: true */
  showHoverPreview?: boolean;
  /** Optional callback fired when a project link is clicked. */
  onProjectClick?: (project: ProjectExplorerItem, targetType: "case_study" | "external_url", url: string) => void;
  /** Optional callback fired when a year folder is expanded or collapsed. */
  onYearToggle?: (year: number, action: "expand" | "collapse") => void;
  /** Optional DOM id for the section container */
  id?: string;
  /** Additional classes for the container section */
  className?: string;
};

export function ProjectExplorer({
  projects = defaultSampleProjects,
  title = "Featured Projects",
  showHeading = true,
  defaultOpen = "all",
  showHoverPreview = true,
  id,
  onProjectClick,
  onYearToggle,
  className,
}: ProjectExplorerProps) {
  const [activeProject, setActiveProject] = useState<ProjectExplorerItem | null>(null);

  const projectsByYear = useMemo(() => {
    const enabledProjects = projects
      .filter((item) => item.enabled !== false)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    return enabledProjects
      .reduce<{ year: number; projects: ProjectExplorerItem[] }[]>((groups, project) => {
        const group = groups.find((g) => g.year === project.year);
        if (group) {
          group.projects.push(project);
        } else {
          groups.push({ year: project.year, projects: [project] });
        }
        return groups;
      }, [])
      .sort((a, b) => b.year - a.year);
  }, [projects]);

  const [openYears, setOpenYears] = useState<Record<number, boolean>>(() => {
    const initial: Record<number, boolean> = {};
    projectsByYear.forEach((group, index) => {
      initial[group.year] = defaultOpen === "all" || index === 0;
    });
    return initial;
  });

  const toggleYear = useCallback((year: number) => {
    setOpenYears((prev) => {
      const willBeOpen = !prev[year];
      onYearToggle?.(year, willBeOpen ? "expand" : "collapse");
      return {
        ...prev,
        [year]: willBeOpen,
      };
    });
  }, [onYearToggle]);

  const canHover = useSyncExternalStore(
    subscribeHoverCapability,
    getHoverSnapshot,
    getServerSnapshot,
  );
  const prefersReducedMotion = useReducedMotion();

  const springX = useSpring(0, { stiffness: 260, damping: 26, mass: 0.6 });
  const springY = useSpring(0, { stiffness: 260, damping: 26, mass: 0.6 });

  useEffect(() => {
    const hide = () => setActiveProject(null);
    window.addEventListener("scroll", hide, { passive: true });
    return () => window.removeEventListener("scroll", hide);
  }, []);

  const handleMouseMove = useCallback(
    (event: React.MouseEvent) => {
      if (!showHoverPreview || !activeProject) return;
      const flip = event.clientX > window.innerWidth - PREVIEW_WIDTH - 48;
      springX.set(event.clientX + (flip ? -(PREVIEW_WIDTH + 24) : 24));
      springY.set(
        Math.max(
          16,
          Math.min(
            event.clientY - PREVIEW_HEIGHT / 2,
            window.innerHeight - PREVIEW_HEIGHT - 24,
          ),
        ),
      );
    },
    [springX, springY, showHoverPreview, activeProject],
  );

  const handlePreviewStart = useCallback(
    (project: ProjectExplorerItem, anchor?: DOMRect) => {
      if (!showHoverPreview) return;
      setActiveProject(project);
      if (anchor) {
        const flip = anchor.right > window.innerWidth - PREVIEW_WIDTH - 48;
        springX.set(
          flip ? anchor.left - PREVIEW_WIDTH - 16 : anchor.right + 16,
        );
        springY.set(
          Math.max(
            16,
            Math.min(anchor.top, window.innerHeight - PREVIEW_HEIGHT - 24),
          ),
        );
      }
    },
    [springX, springY, showHoverPreview],
  );

  const handlePreviewEnd = useCallback(() => setActiveProject(null), []);

  const showPreview = showHoverPreview && canHover && !prefersReducedMotion && Boolean(activeProject);

  const hasImage = Boolean(
    activeProject?.image && activeProject?.showImage !== false,
  );

  return (
    <section
      id={id}
      className={cn(showHeading && "border-t border-dashed", "pt-6", className)}
    >
      {showHeading ? (
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.2 }}
          className="no-js-visible section-heading mb-3"
        >
          {title}
        </motion.h2>
      ) : null}

      <div
        className="flex flex-col gap-5 px-4 sm:px-6"
        onMouseMove={handleMouseMove}
        onMouseLeave={handlePreviewEnd}
      >
        {projectsByYear.map((group, groupIndex) => {
          const isOpen = openYears[group.year] ?? true;
          const FolderIcon = isOpen ? FolderOpenIcon : FolderClosedIcon;

          return (
            <motion.div
              key={group.year}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
            >
              <button
                type="button"
                onClick={() => toggleYear(group.year)}
                aria-expanded={isOpen}
                className="group mb-1 flex items-center gap-2 rounded-sm px-1 py-0.5 font-pixel text-sm hover:bg-muted/30 focus-visible:bg-muted/30 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/20 transition-colors cursor-pointer select-none"
              >
                <FolderIcon
                  aria-hidden="true"
                  className={cn(
                    "size-4 transition-transform",
                    folderColors[groupIndex % folderColors.length].icon,
                  )}
                />
                <span
                  className={folderColors[groupIndex % folderColors.length].text}
                >
                  {group.year}
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.ul
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="ml-2 overflow-hidden"
                  >
                    {group.projects.map((project, index) => (
                      <WorkRow
                        key={project.id}
                        project={project}
                        index={index}
                        onPreviewStart={handlePreviewStart}
                        onPreviewEnd={handlePreviewEnd}
                        showHoverPreview={showHoverPreview}
                        onProjectClick={onProjectClick}
                      />
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {showPreview && activeProject ? (
          <motion.div
            key={activeProject.id}
            aria-hidden="true"
            initial={{ opacity: 0, scale: 0.92, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 1.5 }}
            exit={{ opacity: 0, scale: 0.95, rotate: 0 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            style={{ x: springX, y: springY }}
            className="pointer-events-none fixed left-0 top-0 z-50 w-[300px]"
          >
            <div className="overflow-hidden rounded-md border bg-background shadow-xl shadow-black/10">
              {hasImage ? (
                <Image
                  src={activeProject.image!}
                  alt={activeProject.imageAlt ?? ""}
                  width={600}
                  height={338}
                  className="aspect-video w-full object-cover"
                />
              ) : (
                <div className="flex aspect-video w-full flex-col items-center justify-center gap-1.5 bg-muted/40 text-muted-foreground">
                  <ImageIcon className="size-8 stroke-[1.25] text-muted-foreground/60" />
                </div>
              )}
              <div className="border-t px-3 py-1.5 font-mono text-[11px] text-muted-foreground">
                {activeProject.title}
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}

export default ProjectExplorer;
