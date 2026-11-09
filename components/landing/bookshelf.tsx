import { Bookshelf as BookshelfDisplay } from "@/components/ui/bookshelf";
import { bookshelfConfig } from "@/config/books";
import type { Book } from "@/config/types";

export function Bookshelf({ books }: { books: Book[] }) {
  return (
    <section
      className="border-t border-dashed pt-4"
      aria-label={bookshelfConfig.title}
    >
      <BookshelfDisplay
        books={books}
        defaultBookId={bookshelfConfig.defaultBookId}
        label={bookshelfConfig.title}
        emptyMessage={bookshelfConfig.empty}
        coverUnavailableMessage={bookshelfConfig.coverUnavailable}
        revealOnScroll
      />
    </section>
  );
}
