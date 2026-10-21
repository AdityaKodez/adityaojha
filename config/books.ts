import type { Book } from "@/config/types";

export const bookshelfConfig = {
  title: "Bookshelf",
  href: "/#bookshelf",
  defaultBookId: "48-laws-of-power",
  coverUnavailable: "Cover unavailable",
  empty: "More books will find their way here.",
};

export const booksConfig: Book[] = [
  {
    id: "atomic-habits",
    title: "Atomic Habits",
    author: "James Clear",
    cover: {
      src: "/images/books/atomic-habits.svg",
      width: 1045,
      height: 1600,
      alt: "Atomic Habits by James Clear, cream cover with dotted brown lettering",
    },
    sourceUrl:
      "https://www.penguinrandomhouse.com/books/543993/atomic-habits-by-james-clear/9780735211292/",
    coverSourceUrl:
      "https://hermiene.net/images/books/hi-res/atomic-habits--clear_front.png",
    spine: {
      src: "/images/books/atomic-habits-spine.svg",
      height: 252,
      width: 29,
      sourceUrl:
        "https://hermiene.net/images/books/hi-res/atomic-habits--clear_spine.png",
    },
    order: 0,
  },
  {
    id: "48-laws-of-power",
    title: "The 48 Laws of Power",
    author: "Robert Greene",
    cover: {
      src: "/images/books/48-laws-of-power.svg",
      width: 1124,
      height: 1600,
      alt: "The 48 Laws of Power by Robert Greene, red and blue cover",
    },
    sourceUrl:
      "https://www.penguinrandomhouse.com/books/330912/the-48-laws-of-power-by-robert-greene/9780140280197/",
    coverSourceUrl:
      "https://images1.penguinrandomhouse.com/cover/tif/9780140280197",
    spine: { src: "/images/books/48-laws-of-power-spine.svg", height: 278, width: 54 },
    order: 1,
  },
  {
    id: "shoe-dog",
    title: "Shoe Dog",
    author: "Phil Knight",
    cover: {
      src: "/images/books/shoe-dog.svg",
      width: 1067,
      height: 1600,
      alt: "Shoe Dog by Phil Knight, black cover with gold lettering and a red swoosh",
    },
    sourceUrl:
      "https://www.simonandschuster.com/books/Shoe-Dog/Phil-Knight/9781501135927",
    coverSourceUrl:
      "https://d28hgpri8am2if.cloudfront.net/book_images/onix/cvr9781501135927/shoe-dog-9781501135927_hr.jpg",
    spine: { src: "/images/books/shoe-dog-spine.svg", height: 260, width: 37 },
    order: 2,
  },
  {
    id: "book-of-elon",
    title: "The Book of Elon",
    author: "Eric Jorgenson",
    cover: {
      src: "/images/books/book-of-elon.svg",
      width: 1035,
      height: 1600,
      alt: "The Book of Elon by Eric Jorgenson, red cover with a sweeping white curve",
    },
    sourceUrl: "https://www.elonmuskbook.org/",
    coverSourceUrl:
      "https://mma.prnewswire.com/media/3002879/Book_of_Elon.jpg?p=original",
    spine: { src: "/images/books/book-of-elon-spine.svg", height: 266, width: 35 },
    order: 3,
  },
  {
    id: "steve-jobs",
    title: "Steve Jobs",
    author: "Walter Isaacson",
    cover: {
      src: "/images/books/steve-jobs.svg",
      width: 1051,
      height: 1600,
      alt: "Steve Jobs by Walter Isaacson, cover with a monochrome vector portrait",
    },
    sourceUrl:
      "https://www.simonandschuster.com/books/Steve-Jobs/Walter-Isaacson/9781451648539",
    coverSourceUrl:
      "https://d28hgpri8am2if.cloudfront.net/book_images/cvr9781451648539_9781451648539_hr.jpg",
    spine: { src: "/images/books/steve-jobs-spine.svg", height: 286, width: 46 },
    order: 4,
  },
  {
    id: "subtle-art",
    title: "The Subtle Art of Not Giving a F*ck",
    author: "Mark Manson",
    cover: {
      src: "/images/books/subtle-art.svg",
      width: 432,
      height: 648,
      alt: "The Subtle Art of Not Giving a F*ck by Mark Manson, orange cover",
    },
    sourceUrl: "https://markmanson.net/books/subtle-art",
    coverSourceUrl:
      "https://www.harpercollins.com/cdn/shop/files/9780062457714.jpg?v=1720267464&width=1400",
    spine: { src: "/images/books/subtle-art-spine.svg", height: 242, width: 34 },
    order: 5,
  },
  {
    id: "psychology-of-money",
    title: "The Psychology of Money",
    author: "Morgan Housel",
    cover: {
      src: "/images/books/psychology-of-money.svg",
      width: 1035,
      height: 1600,
      alt: "The Psychology of Money by Morgan Housel, white cover with a vector illustration of a brain made of banknotes",
    },
    sourceUrl:
      "https://www.harriman-house.com/authors/morgan-housel/the-psychology-of-money/9780857197689",
    coverSourceUrl:
      "https://ik.imagekit.io/panmac/tr:w-1600/edition/9780857197689.jpg",
    spine: { src: "/images/books/psychology-of-money-spine.svg", height: 254, width: 34 },
    order: 6,
  },
  {
    id: "meditations",
    title: "Meditations",
    author: "Marcus Aurelius",
    cover: {
      src: "/images/books/meditations.svg",
      width: 1562,
      height: 2401,
      alt: "Meditations by Marcus Aurelius, black cover with a red raven and a white wing",
    },
    sourceUrl:
      "https://www.penguinrandomhouse.com/books/6367/meditations-by-marcus-aurelius/9780812968255/",
    coverSourceUrl:
      "https://images1.penguinrandomhouse.com/cover/tif/9780812968255",
    spine: { src: "/images/books/meditations-spine.svg", height: 254, width: 35 },
    order: 7,
  },
  {
    id: "if-anyone-builds-it",
    title: "If Anyone Builds It, Everyone Dies",
    author: "Eliezer Yudkowsky & Nate Soares",
    cover: {
      src: "/images/books/if-anyone-builds-it.svg",
      width: 1677,
      height: 2600,
      alt: "If Anyone Builds It, Everyone Dies by Eliezer Yudkowsky and Nate Soares, black cover with white type and a red glow",
    },
    sourceUrl:
      "https://www.hachettebookgroup.com/titles/eliezer-yudkowsky/if-anyone-builds-it-everyone-dies/9780316595643/",
    coverSourceUrl:
      "https://www.hbglibrary.com/wp-content/uploads/2025/12/9780316595643.jpg",
    spine: { src: "/images/books/if-anyone-builds-it-spine.svg", height: 254, width: 35 },
    order: 8,
  },
  {
    id: "habit-of-winning",
    title: "The Habit of Winning",
    author: "Prakash Iyer",
    cover: {
      src: "/images/books/habit-of-winning.svg",
      width: 443,
      height: 650,
      alt: "The Habit of Winning by Prakash Iyer, white cover with yellow lettering and overlapping yellow circles",
    },
    sourceUrl: "https://www.penguin.co.in/book/the-habit-of-winning/",
    coverSourceUrl:
      "https://www.penguin.co.in/wp-content/uploads/2026/09/unnamed-file.jpg",
    spine: { src: "/images/books/habit-of-winning-spine.svg", height: 252, width: 30 },
    order: 9,
  },
];

export function getEnabledBooks() {
  return booksConfig
    .filter((book) => book.enabled !== false)
    .sort((a, b) => a.order - b.order);
}
