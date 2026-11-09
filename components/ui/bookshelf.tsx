"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { reveal, revealDelay } from "@/lib/motion";
import styles from "./bookshelf.module.css";

const TRANSITION = { duration: 0.38, ease: [0.22, 1, 0.36, 1] as const };
const LIFT_TRANSITION = {
  type: "spring",
  stiffness: 340,
  damping: 25,
  mass: 0.7,
} as const;

export interface BookshelfBook {
  id: string;
  title: string;
  author: string;
  cover: { src: string; width: number; height: number; alt: string };
  spine: { src: string; height: number; width: number };
}

export interface BookshelfProps {
  /** Books render in the supplied order. IDs must be unique and stable. */
  books: readonly BookshelfBook[];
  /** Initially open book. Missing or unknown IDs start with every book closed. */
  defaultBookId?: string | null;
  label?: string;
  emptyMessage?: string;
  coverUnavailableMessage?: string;
  /** Closed-book hover lift in pixels, clamped to 0 through 20. */
  liftAmount?: number;
  /** Optional once-only entrance for shelves below the fold. */
  revealOnScroll?: boolean;
  className?: string;
}

function BookCover({
  book,
  unavailableMessage,
}: {
  book: BookshelfBook;
  unavailableMessage: string;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <span className={styles.cover}>
      {failed ? (
        <span className={styles.fallback}>
          <span>{book.title}</span>
          <span>{book.author}</span>
          <span>{unavailableMessage}</span>
        </span>
      ) : (
        // Consumer artwork needs no Next.js loader or domain configuration.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={book.cover.src}
          width={book.cover.width}
          height={book.cover.height}
          alt={book.cover.alt}
          loading="eager"
          decoding="sync"
          className={styles.coverImage}
          onError={() => setFailed(true)}
        />
      )}
    </span>
  );
}

export function Bookshelf({
  books,
  defaultBookId = null,
  label = "Bookshelf",
  emptyMessage = "More books will find their way here.",
  coverUnavailableMessage = "Cover unavailable",
  liftAmount = 10,
  revealOnScroll = false,
  className,
}: BookshelfProps) {
  const [selectedId, setSelectedId] = useState<string | null>(() =>
    books.some((book) => book.id === defaultBookId) ? defaultBookId : null,
  );
  const activeId = books.some((book) => book.id === selectedId)
    ? selectedId
    : null;
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const instant = reduceMotion !== false;
  const transition = instant ? { duration: 0 } : TRANSITION;
  const lift = Number.isFinite(liftAmount)
    ? Math.min(20, Math.max(0, liftAmount))
    : 10;

  useEffect(() => {
    function dismissOutside(event: PointerEvent) {
      const target = event.target;
      if (
        target instanceof Element &&
        root.current?.contains(target) &&
        target.closest("[data-bookshelf-book]")
      ) {
        return;
      }
      // The header floats over the page; pressing its controls (theme,
      // search, GitHub, menu) must not close an open book.
      if (target instanceof Element && target.closest("header")) {
        return;
      }
      setSelectedId(null);
    }

    function dismissOnEscape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setSelectedId(null);
      setHoveredId(null);
    }

    document.addEventListener("pointerdown", dismissOutside);
    document.addEventListener("keydown", dismissOnEscape);
    return () => {
      document.removeEventListener("pointerdown", dismissOutside);
      document.removeEventListener("keydown", dismissOnEscape);
    };
  }, []);

  useEffect(() => {
    if (!activeId) return;
    const book = root.current?.querySelector<HTMLElement>(
      `[data-bookshelf-book="${CSS.escape(activeId)}"]`,
    );
    const position = book?.parentElement;
    const railElement = rail.current;
    if (!position || !railElement) return;
    const max = railElement.scrollWidth - railElement.clientWidth;
    const centered =
      position.offsetLeft -
      (railElement.clientWidth - position.offsetWidth) / 2;
    const next = Math.max(0, Math.min(max, centered));
    if (Math.abs(next - railElement.scrollLeft) > 1) {
      railElement.scrollLeft = next;
    }
  }, [activeId, books]);

  if (books.length === 0) {
    return (
      <div
        role="group"
        aria-label={label}
        className={cn(styles.shelf, className)}
      >
        <p className="px-6 py-16 text-sm text-muted-foreground">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div
      ref={root}
      role="group"
      aria-label={label}
      className={cn(styles.shelf, className)}
    >
      <noscript>
        <style>{`.${styles.reveal} { opacity: 1 !important; transform: none !important; }`}</style>
      </noscript>
      <div ref={rail} className={styles.rail}>
        <div className={styles.books}>
          {books.map((book, index) => {
            const active = activeId === book.id;
            const bookStyle = {
              "--book-height": `${book.spine.height}px`,
              "--spine-width": `${book.spine.width}px`,
              "--cover-ratio": book.cover.width / book.cover.height,
            } as CSSProperties;

            return (
              <motion.div
                key={book.id}
                className={styles.reveal}
                {...(revealOnScroll && !reduceMotion
                  ? reveal({
                      y: 28,
                      delay: revealDelay(index, 0.06, 0.36),
                      margin: "0px 0px -120px 0px",
                      amount: 0.3,
                    })
                  : { initial: false })}
              >
                <motion.button
                  type="button"
                  layout="position"
                  transition={transition}
                  data-bookshelf-book={book.id}
                  data-open={active}
                  className={styles.book}
                  style={bookStyle}
                  aria-label={`${book.title}, by ${book.author}`}
                  aria-pressed={active}
                  onPointerEnter={(event) => {
                    if (
                      event.pointerType === "mouse" &&
                      window.matchMedia("(hover: hover) and (pointer: fine)")
                        .matches
                    ) {
                      setHoveredId(book.id);
                    }
                  }}
                  onPointerLeave={() => setHoveredId(null)}
                  onClick={() =>
                    setSelectedId((current) =>
                      current === book.id ? null : book.id,
                    )
                  }
                >
                  <motion.span
                    className={styles.artwork}
                    initial={false}
                    animate={{
                      y:
                        !instant && !active && hoveredId === book.id
                          ? -lift
                          : 0,
                    }}
                    transition={
                      instant
                        ? { duration: 0 }
                        : active
                          ? TRANSITION
                          : LIFT_TRANSITION
                    }
                  >
                    <motion.span
                      className={styles.volume}
                      initial={false}
                      animate={{ opacity: active ? 1 : 0 }}
                      transition={{ duration: instant ? 0 : 0.18 }}
                      aria-hidden="true"
                    >
                      <BookCover
                        key={book.cover.src}
                        book={book}
                        unavailableMessage={coverUnavailableMessage}
                      />
                    </motion.span>
                    <motion.span
                      className={styles.spine}
                      initial={false}
                      animate={{ opacity: active ? 0 : 1 }}
                      transition={{ duration: instant ? 0 : 0.18 }}
                      aria-hidden="true"
                    >
                      {/* Artwork uses the supplied URL without a framework image loader. */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={book.spine.src}
                        alt=""
                        width={book.spine.width}
                        height={book.spine.height}
                        loading="eager"
                        className={styles.spineImage}
                      />
                    </motion.span>
                  </motion.span>
                </motion.button>
              </motion.div>
            );
          })}
        </div>
      </div>
      <div className={styles.baseline} aria-hidden="true" />
    </div>
  );
}
