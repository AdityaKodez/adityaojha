"use client";

import { projectsConfig, projectsSectionConfig } from "@/config/projects";
import type { Project, ProjectStatus } from "@/config/types";
import { cn } from "@/lib/utils";
import { ArrowUpRight, FolderClosedIcon, FolderOpenIcon } from "lucide-react";
import {
    AnimatePresence,
    motion,
    useMotionValue,
    useReducedMotion,
    useSpring,
} from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";

const HOVER_QUERY = "(hover: hover) and (pointer: fine)";

function subscribeHoverCapability(callback: () => void) {
  const mql = window.matchMedia(HOVER_QUERY);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

const getHoverSnapshot = () => window.matchMedia(HOVER_QUERY).matches;
const getServerSnapshot = () => false;

const enabledProjects = projectsConfig
  .filter((item) => item.enabled !== false)
  .sort((a, b) => a.order - b.order);

const projectsByYear = enabledProjects
  .reduce<{ year: number; projects: Project[] }[]>((groups, project) => {
    const group = groups.find((g) => g.year === project.year);
    if (group) {
      group.projects.push(project);
    } else {
      groups.push({ year: project.year, projects: [project] });
    }
    return groups;
  }, [])
  .sort((a, b) => b.year - a.year);

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
        Building&hellip;
      </span>
    );
  }

  return (
    <span className="inline-flex shrink-0 items-center rounded-sm bg-amber-500/10 px-1.5 py-0.5 font-pixel text-[10px] leading-none text-amber-600 dark:text-amber-400">
      New
    </span>
  );
}

interface PreviewHandlers {
  onPreviewStart: (project: Project, anchor?: DOMRect) => void;
  onPreviewEnd: () => void;
}

function WorkRow({
  project,
  index,
  onPreviewStart,
  onPreviewEnd,
}: { project: Project; index: number } & PreviewHandlers) {
  const [name, subtitle] = project.title.split(" — ");
  const href = project.liveUrl ?? `/project/${project.id}`;
  const isExternal = Boolean(project.liveUrl);

  return (
    <motion.li
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.24, delay: index * 0.045 }}
      className="relative"
    >
      <span
        aria-hidden="true"
        className="absolute -left-px top-1/2 w-3 border-b border-dashed border-muted-foreground/30"
      />
      <Link
        href={href}
        {...(isExternal
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
        onMouseEnter={() => onPreviewStart(project)}
        onMouseLeave={onPreviewEnd}
        onFocus={(event) =>
          onPreviewStart(project, event.currentTarget.getBoundingClientRect())
        }
        onBlur={onPreviewEnd}
        className="group micro-transition flex min-h-11 items-center gap-2 rounded-sm py-2 pl-6 pr-3 hover:bg-muted/40 focus-visible:bg-muted/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/20 border-b border-dashed"
      >
        <span className="min-w-0 flex-1 truncate text-sm font-medium transition-colors group-hover:text-primary group-focus-visible:text-primary">
          {subtitle ? (
            <>
              <span className="hidden md:inline">{name}</span>
              <span className="font-normal text-muted-foreground md:ml-4">
                {subtitle}
              </span>
            </>
          ) : (
            name
          )}
        </span>

        <StatusBadge status={project.status} />

        <span className="ml-auto hidden shrink-0 font-mono text-xs text-muted-foreground/70 sm:block">
          {"// "}
          {project.category}
        </span>

        <ArrowUpRight
          aria-hidden="true"
          className="size-3.5 shrink-0 text-muted-foreground/30 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary group-focus-visible:-translate-y-0.5 group-focus-visible:translate-x-0.5 group-focus-visible:text-primary"
        />
      </Link>
    </motion.li>
  );
}


export function ZenoProject() {
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [openYears, setOpenYears] = useState<Record<number, boolean>>(() => {
    const initial: Record<number, boolean> = {};
    projectsByYear.forEach((group) => {
      initial[group.year] = true;
    });
    return initial;
  });

  const toggleYear = useCallback((year: number) => {
    setOpenYears((prev) => ({
      ...prev,
      [year]: !prev[year],
    }));
  }, []);

  const canHover = useSyncExternalStore(
    subscribeHoverCapability,
    getHoverSnapshot,
    getServerSnapshot,
  );
  const prefersReducedMotion = useReducedMotion();

  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const springX = useSpring(cursorX, { stiffness: 260, damping: 26, mass: 0.6 });
  const springY = useSpring(cursorY, { stiffness: 260, damping: 26, mass: 0.6 });

  useEffect(() => {
    const hide = () => setActiveProject(null);
    window.addEventListener("scroll", hide, { passive: true });
    return () => window.removeEventListener("scroll", hide);
  }, []);

  const handleMouseMove = useCallback(
    (event: React.MouseEvent) => {
      const flip = event.clientX > window.innerWidth - PREVIEW_WIDTH - 48;
      cursorX.set(event.clientX + (flip ? -(PREVIEW_WIDTH + 24) : 24));
      cursorY.set(
        Math.max(
          16,
          Math.min(
            event.clientY - PREVIEW_HEIGHT / 2,
            window.innerHeight - PREVIEW_HEIGHT - 24,
          ),
        ),
      );
    },
    [cursorX, cursorY],
  );

  const handlePreviewStart = useCallback(
    (project: Project, anchor?: DOMRect) => {
      setActiveProject(project);
      if (anchor) {
        const flip = anchor.right > window.innerWidth - PREVIEW_WIDTH - 48;
        cursorX.set(
          flip ? anchor.left - PREVIEW_WIDTH - 16 : anchor.right + 16,
        );
        cursorY.set(
          Math.max(
            16,
            Math.min(anchor.top, window.innerHeight - PREVIEW_HEIGHT - 24),
          ),
        );
      }
    },
    [cursorX, cursorY],
  );

  const handlePreviewEnd = useCallback(() => setActiveProject(null), []);

  const showPreview = canHover && !prefersReducedMotion && activeProject;

  return (
    <section id="projects" className="border-t border-dashed pt-6">
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.2 }}
        className="no-js-visible section-heading mb-3"
      >
        {projectsSectionConfig.title}
      </motion.h2>

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
                className="group mb-1 flex items-center gap-2 rounded-sm px-1 py-0.5 font-pixel text-sm hover:bg-muted/30 focus-visible:bg-muted/30 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/20 transition-colors cursor-pointer select-none "
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
                    className="ml-2 border-l border-dashed border-muted-foreground/30 overflow-hidden "
                  >
                    {group.projects.map((project, index) => (
                      <WorkRow
                        key={project.id}
                        project={project}
                        index={index}
                        onPreviewStart={handlePreviewStart}
                        onPreviewEnd={handlePreviewEnd}
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
        {showPreview ? (
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
              <Image
                src={activeProject.image}
                alt=""
                width={300}
                height={169}
                sizes="300px"
                className="aspect-video w-full object-cover"
              />
              <div className="border-t border-dashed px-3 py-1.5 font-mono text-[11px] text-muted-foreground">
                {activeProject.title}
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
