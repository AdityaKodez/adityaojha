"use client";

import { Bookshelf, type BookshelfProps } from "@/components/ui/bookshelf";
import { bookshelfConfig, getEnabledBooks } from "@/config/books";

const books = getEnabledBooks();

export function BookshelfDemo(props: Partial<BookshelfProps> = {}) {
  return (
    <Bookshelf
      books={books}
      defaultBookId={bookshelfConfig.defaultBookId}
      label={bookshelfConfig.title}
      emptyMessage={bookshelfConfig.empty}
      coverUnavailableMessage={bookshelfConfig.coverUnavailable}
      className="min-w-0 w-full"
      {...props}
    />
  );
}
