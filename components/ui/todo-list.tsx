"use client";

import { Check } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useState, type CSSProperties } from "react";

import { cn } from "@/lib/utils";

export interface TodoItem {
  /** A unique, stable key that stays the same when the task moves. */
  id: string;
  title: string;
  completed?: boolean;
}

export interface TodoListProps {
  /** Controlled tasks. Pair with onItemsChange to update them. */
  items?: TodoItem[];
  /** Initial tasks when the list manages its own state. */
  defaultItems?: TodoItem[];
  onItemsChange?: (items: TodoItem[]) => void;
  /** Color of the completed checkbox. Accepts any CSS color. */
  accentColor?: string;
  disabled?: boolean;
  /** Accessible name for the list. */
  label?: string;
  emptyMessage?: string;
  className?: string;
}

/** Content-sized tasks that settle beneath unfinished work when completed. */
export function TodoList({
  items,
  defaultItems = [],
  onItemsChange,
  accentColor = "var(--primary, oklch(0.488 0.243 264.376))",
  disabled = false,
  label = "Todo list",
  emptyMessage = "No tasks yet.",
  className,
}: TodoListProps) {
  const [internalItems, setInternalItems] = useState(defaultItems);
  const reduceMotion = useReducedMotion();
  const tasks = items ?? internalItems;
  const ids = new Set<string>();

  for (const task of tasks) {
    if (!task.id.trim() || ids.has(task.id) || !task.title.trim()) {
      throw new Error("TodoList requires unique, non-empty ids and non-empty titles.");
    }
    ids.add(task.id);
  }

  const orderedTasks = [
    ...tasks.filter((task) => !task.completed),
    ...tasks.filter((task) => task.completed),
  ];
  const unavailable = disabled || (items !== undefined && !onItemsChange);
  const spring = reduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 420, damping: 32 };

  function toggleTask(id: string) {
    if (unavailable) return;

    const nextItems = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task,
    );
    if (items === undefined) setInternalItems(nextItems);
    onItemsChange?.(nextItems);
  }

  if (tasks.length === 0) {
    return (
      <p className={cn("text-sm text-muted-foreground", className)} role="status">
        {emptyMessage}
      </p>
    );
  }

  return (
    <ul
      aria-label={label}
      className={cn("m-0 flex w-fit max-w-full list-none flex-col items-start gap-2.5 p-0", className)}
      style={{ "--todo-accent": accentColor } as CSSProperties}
    >
      {orderedTasks.map((task) => {
        const completed = Boolean(task.completed);

        return (
          <motion.li
            key={task.id}
            layout={reduceMotion ? false : "position"}
            initial={false}
            transition={spring}
            className="relative max-w-full"
            style={{ zIndex: completed ? 1 : 0 }}
          >
            <motion.button
              type="button"
              role="checkbox"
              aria-checked={completed}
              disabled={unavailable}
              onClick={() => toggleTask(task.id)}
              whileTap={unavailable || reduceMotion ? undefined : { scale: 0.98 }}
              transition={spring}
              className="flex min-h-[54px] max-w-full cursor-pointer items-center gap-3 rounded-2xl bg-card px-3 py-3 text-left text-base font-normal leading-6 text-card-foreground shadow-[0_1px_2px_rgb(0_0_0/10%)] outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span
                aria-hidden="true"
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full",
                  completed
                    ? "bg-[var(--todo-accent)] text-[color:var(--primary-foreground,white)]"
                    : "ring-1 ring-inset ring-border/70",
                )}
              >
                <motion.span
                  initial={false}
                  animate={{ opacity: completed ? 1 : 0, scale: completed ? 1 : 0.5 }}
                  transition={spring}
                  className="flex"
                >
                  <Check className="size-4" strokeWidth={2.5} />
                </motion.span>
              </span>
              <span
                className={cn(
                  "relative min-w-0 break-words transition-colors duration-200 motion-reduce:transition-none",
                  completed && "text-muted-foreground",
                )}
              >
                {task.title}
                <motion.span
                  aria-hidden="true"
                  initial={false}
                  animate={{ scaleX: completed ? 1 : 0 }}
                  transition={reduceMotion ? { duration: 0 } : { duration: 0.2, ease: "easeOut" }}
                  className="pointer-events-none absolute inset-0 origin-left text-transparent line-through decoration-muted-foreground"
                >
                  {task.title}
                </motion.span>
              </span>
            </motion.button>
          </motion.li>
        );
      })}
    </ul>
  );
}
