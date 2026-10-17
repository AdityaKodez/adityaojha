"use client";

import { cn } from "@/lib/utils";
import {
  ArrowUpRight,
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
import { useCallback, useEffect, useId, useMemo, useState, useSyncExternalStore } from "react";

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
  "text-blue-600 dark:text-blue-400",
  "text-amber-600 dark:text-amber-400",
  "text-emerald-600 dark:text-emerald-400",
  "text-rose-600 dark:text-rose-400",
];

const PREVIEW_WIDTH = 300;
const PREVIEW_HEIGHT = 240;
const PAPER_EDGE =
  "polygon(1% 2%, 12% 0.5%, 25% 1.5%, 38% 0%, 54% 1%, 69% 0.5%, 83% 1.5%, 98% 0%, 99% 14%, 98.5% 31%, 100% 48%, 99% 65%, 99.5% 82%, 98% 99%, 84% 98%, 70% 100%, 55% 98.5%, 40% 99.5%, 25% 98%, 11% 99.5%, 0% 98%, 1% 82%, 0% 65%, 1.5% 48%, 0.5% 31%, 1% 15%)";
const PAPER_TEXTURE = {
  backgroundImage:
    "radial-gradient(var(--foreground, #171717) 0.45px, transparent 0.65px)",
  backgroundSize: "3px 3px",
};

function PaperFolderIcon({
  open,
  className,
}: {
  open: boolean;
  className?: string;
}) {
  const patternId = useId();
  const front = open
    ? "M4 17 15 16 18 18 43 15 37 33 8 34Z"
    : "M7 15 18 14 21 16 39 15 38 33 8 34Z";

  return (
    <svg
      viewBox="0 0 48 40"
      aria-hidden="true"
      focusable="false"
      className={cn("h-8 w-10 shrink-0 overflow-visible", className)}
      strokeLinejoin="round"
    >
      <defs>
        <pattern
          id={patternId}
          width="2.5"
          height="2.5"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="0.8" cy="0.8" r="0.4" className="fill-foreground/40" />
        </pattern>
      </defs>
      <path
        d="m4 7 15-2 5 5 17-1 2 5 3 1-6 21-33 1-3-5Z"
        className="fill-background stroke-background"
        strokeWidth="3"
      />
      <path
        d="m6 9 12-2 5 5 16-1-1 21-30 2Z"
        className="fill-muted stroke-foreground"
        strokeWidth="1.1"
      />
      <path d="m8 10 9-1 3 3-12 1Z" className="fill-current" />
      {open && (
        <path
          d="m12 17 1-7 20 2 2 8m-18-6 12 1m-12 2 9 1"
          className="fill-background stroke-foreground/60"
          strokeWidth="0.8"
        />
      )}
      <path
        d={front}
        className="fill-background stroke-foreground"
        strokeWidth="1.2"
      />
      <path d={front} fill={`url(#${patternId})`} />
      <path
        d="m12 28 20-1m-20 3 14-1"
        className="stroke-foreground/60"
        strokeWidth="0.7"
      />
      <path d="m12 21 10-1v4l-10 1Z" className="fill-current" opacity="0.75" />
    </svg>
  );
}

function StatusBadge({ status }: { status: ProjectStatus }) {
  if (status === "shipped") return null;

  if (status === "building") {
    return (
      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-sm bg-blue-500/10 px-1.5 py-0.5 font-sans text-[10px] leading-none text-blue-600 dark:text-blue-400">
        <span className="relative flex size-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-500 opacity-60 motion-reduce:animate-none" />
          <span className="relative inline-flex size-1.5 rounded-full bg-blue-500" />
        </span>
        building&hellip;
      </span>
    );
  }

  return (
    <span className="inline-flex shrink-0 items-center rounded-sm bg-amber-500/10 px-1.5 py-0.5 font-sans text-[10px] leading-none text-amber-600 dark:text-amber-400">
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
  onPreviewStart,
  onPreviewEnd,
  showHoverPreview,
  onProjectClick,
}: { project: ProjectExplorerItem } & PreviewHandlers) {
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
    <li className="relative">
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
                <span className="inline font-medium text-foreground group-hover:text-primary group-focus-visible:text-primary">
                {name}
              </span>
              <span className="ml-2 inline font-normal text-muted-foreground md:ml-4">
                {subtitle}
              </span>
            </>
          ) : (
            name
          )}
        </span>

        {project.status ? <StatusBadge status={project.status} /> : null}

        <ArrowUpRight
          aria-hidden="true"
          className="size-3.5 shrink-0 text-muted-foreground/30 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary group-focus-visible:-translate-y-0.5 group-focus-visible:translate-x-0.5 group-focus-visible:text-primary"
        />
      </Link>
    </li>
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
        <h2 className="no-js-visible section-heading mb-3">
          {title}
        </h2>
      ) : null}

      <div
        className="flex flex-col gap-5 px-4 sm:px-6"
        onMouseMove={handleMouseMove}
        onMouseLeave={handlePreviewEnd}
      >
        {projectsByYear.map((group, groupIndex) => {
          const isOpen = openYears[group.year] ?? true;

          return (
            <div key={group.year}>
              <button
                type="button"
                onClick={() => toggleYear(group.year)}
                aria-expanded={isOpen}
                className="group mb-1 flex min-h-10 cursor-pointer select-none items-center gap-1.5 rounded-sm px-1 py-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/40"
              >
                <PaperFolderIcon
                  open={isOpen}
                  className={cn(
                    "-rotate-6 transition-transform duration-200 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:-rotate-12 motion-safe:group-focus-visible:-translate-y-0.5 motion-safe:group-focus-visible:-rotate-12 motion-reduce:rotate-0 motion-reduce:transition-none",
                    folderColors[groupIndex % folderColors.length],
                  )}
                />
                <span className="relative isolate -rotate-2 px-2.5 py-1 font-serif text-xl italic leading-none text-foreground transition-transform duration-200 motion-safe:group-hover:rotate-0 motion-safe:group-focus-visible:rotate-0 motion-reduce:rotate-0 motion-reduce:transition-none">
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 -z-10 bg-muted/70"
                    style={{ clipPath: PAPER_EDGE }}
                  />
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 -z-10 opacity-[0.08]"
                    style={{ ...PAPER_TEXTURE, clipPath: PAPER_EDGE }}
                  />
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
                    {group.projects.map((project) => (
                      <WorkRow
                        key={project.id}
                        project={project}
                        onPreviewStart={handlePreviewStart}
                        onPreviewEnd={handlePreviewEnd}
                        showHoverPreview={showHoverPreview}
                        onProjectClick={onProjectClick}
                      />
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
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
            className="pointer-events-none fixed left-0 top-0 z-50 w-[300px] drop-shadow-[2px_4px_6px_var(--border)]"
          >
            <div
              className="relative isolate bg-card p-3 text-card-foreground"
              style={{ clipPath: PAPER_EDGE }}
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 opacity-[0.08]"
                style={PAPER_TEXTURE}
              />
              <div className="relative overflow-hidden bg-muted/40">
                {hasImage ? (
                  <Image
                    src={activeProject.image!}
                    alt={activeProject.imageAlt ?? ""}
                    width={600}
                    height={338}
                    sizes="276px"
                    className="aspect-video w-full object-cover saturate-[0.7]"
                  />
                ) : (
                  <div className="flex aspect-video w-full items-center justify-center text-muted-foreground">
                    <ImageIcon aria-hidden="true" className="size-8 stroke-[1.25]" />
                  </div>
                )}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-multiply dark:mix-blend-screen"
                  style={PAPER_TEXTURE}
                />
              </div>
              <div className="flex items-start gap-3 pt-2">
                <div className="line-clamp-2 min-w-0 flex-1 font-serif text-lg italic leading-5">
                  {activeProject.title}
                </div>
                <span className="shrink-0 pt-1 font-mono text-[10px] text-muted-foreground">
                  {activeProject.year}
                </span>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}

export default ProjectExplorer;
