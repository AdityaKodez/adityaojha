## Usage

```tsx
import { Bookshelf, type BookshelfBook } from "@/components/ui/bookshelf";

const books: BookshelfBook[] = [
  {
    id: "design-notes",
    title: "Design notes",
    author: "Maya Chen",
    cover: {
      src: "/books/design-notes.svg",
      width: 600,
      height: 900,
      alt: "Design notes by Maya Chen, blue cover",
    },
    spine: { src: "/books/design-notes-spine.svg", height: 260, width: 36 },
  },
];

export function ReadingList() {
  return <Bookshelf books={books} defaultBookId="design-notes" />;
}
```

Supply your own cover and spine images at the paths in your data. The example paths are placeholders; the portfolio's book artwork is not bundled with the component. Images use standard browser loading, so no Next.js image loader, remote domain configuration, font, or provider is required. SVG, PNG, WebP, and JPEG artwork work.

The component ships with its CSS module and the shared motion helper. Keep those files when copying the source manually. The registry installs them together.

## Props

The component exports `BookshelfProps` and `BookshelfBook` for typed wrappers and collections.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `books` | `readonly BookshelfBook[]` | required | Books render in the supplied order. Filter and sort your collection before passing it. |
| `defaultBookId` | `string \| null` | `null` | Initially open book. Unknown IDs start with all books closed. This is an initial value, not a controlled selection. |
| `label` | `string` | `"Bookshelf"` | Accessible label for the shelf. |
| `emptyMessage` | `string` | `"More books will find their way here."` | Text rendered for an empty collection. |
| `coverUnavailableMessage` | `string` | `"Cover unavailable"` | Fallback text shown with title and author if a cover fails to load. |
| `liftAmount` | `number` | `10` | Closed-book hover lift in pixels, clamped to 0 through 20. Nonfinite values use 10. |
| `revealOnScroll` | `boolean` | `false` | Once-only 28px entrance with a 60ms stagger, capped at 360ms. Intended for shelves below the fold. |
| `className` | `string` | - | Extra classes for the root. The shelf has no section border or heading. |

## Book fields

| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `id` | `string` | required | Unique, stable identifier for selection and React keys. |
| `title` | `string` | required | Book title, included in the button's accessible label. |
| `author` | `string` | required | Author name, included in the button's accessible label. |
| `cover` | `{ src: string; width: number; height: number; alt: string }` | required | Cover artwork and positive intrinsic dimensions. Their ratio determines the open width. |
| `spine` | `{ src: string; height: number; width: number }` | required | Spine artwork and positive display dimensions in pixels. Height sets the book's height; width sets the closed spine width. |

Use trusted image URLs and positive, finite dimensions. Array changes update the rendered books; a selected ID absent from the current array is treated as closed. A changed cover URL retries loading after an earlier failure.

## Interaction and accessibility

Click, tap, Enter, or Space opens a book. Activate it again to close it. Escape or a pointer press outside the books closes the selection. Header controls leave the selection in place. Focusing a book alone does not open it. Buttons expose their title and author, `aria-pressed` state, and a visible focus outline.

Fine-pointer hover gently lifts a closed book. An open cover stays on the shelf and crossfades in flat, without perspective rotation or drop shadows. Set `liftAmount={0}` to disable hover lift. Reduced motion and touch disable lift automatically.

Every width keeps one continuous row. Narrow containers scroll horizontally, and selecting a book brings it into view without moving the page. Covers stay mounted and eagerly loaded, clipped within each book so hidden artwork does not widen the rail.

The optional scroll entrance uses the shared reveal helper with a 120px bottom viewport inset. Reduced motion and no JavaScript keep the books visible. Without JavaScript, the initial cover and spines render as a static shelf.

## Styling

The CSS module uses semantic theme variables with fallback values. The ledge is one continuous surface without extra frame borders. Below 480px, books scale to 78% and the ledge spans the available width.

The showcase uses the homepage's book collection and initial selection. Its Props panel adjusts hover lift from 0 to 20px. Reset restores the original 10px lift.
