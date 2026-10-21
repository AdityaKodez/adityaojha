"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { bookshelfConfig } from "@/config/books";
import type { Book } from "@/config/types";
import { reveal, revealDelay } from "@/lib/motion";
import styles from "./bookshelf.module.css";

const TRANSITION = { duration: 0.38, ease: [0.22, 1, 0.36, 1] as const };
const LIFT_TRANSITION = {
  type: "spring",
  stiffness: 340,
  damping: 25,
  mass: 0.7,
} as const;

function BookCover({ book }: { book: Book }) {
  const [failed, setFailed] = useState(false);

  return (
    <span className={styles.cover}>
      {failed ? (
        <span className={styles.fallback}>
          <span>{book.title}</span>
          <span>{book.author}</span>
          <span>{bookshelfConfig.coverUnavailable}</span>
        </span>
      ) : (
        <Image
          src={book.cover.src}
          width={book.cover.width}
          height={book.cover.height}
          alt={book.cover.alt}
          sizes="(max-width: 479px) 150px, 210px"
          unoptimized
          loading="eager"
          decoding="sync"
          className={styles.coverImage}
          onError={() => setFailed(true)}
        />
      )}
    </span>
  );
}

export function Bookshelf({ books }: { books: Book[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(() =>
    books.some((book) => book.id === bookshelfConfig.defaultBookId)
      ? bookshelfConfig.defaultBookId
      : null,
  );
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const instant = reduceMotion !== false;
  const transition = instant ? { duration: 0 } : TRANSITION;

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
    if (!selectedId) return;
    const book = root.current?.querySelector<HTMLElement>(
      `[data-bookshelf-book="${CSS.escape(selectedId)}"]`,
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
  }, [selectedId]);

  if (books.length === 0) {
    return (
      <p className="px-6 py-16 text-sm text-muted-foreground">
        {bookshelfConfig.empty}
      </p>
    );
  }

  return (
    <section
      className="border-t border-dashed pt-4"
      aria-label={bookshelfConfig.title}
    >
      <div ref={root} className={styles.shelf}>
        <div ref={rail} className={styles.rail}>
          <div className={styles.books}>
            {books.map((book, index) => {
              const active = selectedId === book.id;
              const bookStyle = {
                "--book-height": `${book.spine.height}px`,
                "--spine-width": `${book.spine.width}px`,
                "--cover-ratio": book.cover.width / book.cover.height,
              } as CSSProperties;

              return (
                <motion.div
                  key={book.id}
                  className={`${styles.reveal} no-js-visible`}
                  {...reveal({
                    y: 28,
                    delay: revealDelay(index, 0.06, 0.36),
                    margin: "0px 0px -120px 0px",
                    amount: 0.3,
                  })}
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
                            ? -10
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
                        <BookCover book={book} />
                      </motion.span>
                      <motion.span
                        className={styles.spine}
                        initial={false}
                        animate={{ opacity: active ? 0 : 1 }}
                        transition={{ duration: instant ? 0 : 0.18 }}
                        aria-hidden="true"
                      >
                        <Image
                          src={book.spine.src}
                          alt=""
                          fill
                          sizes="60px"
                          unoptimized
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
    </section>
  );
}
