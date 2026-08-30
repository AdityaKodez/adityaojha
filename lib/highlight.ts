// Server-only Shiki wrapper. Used by the /components/[id] route to render
// syntax-highlighted code blocks without shipping any client JS.
//
// Shiki emits `--shiki-light` / `--shiki-dark` CSS vars per token when called
// with `defaultColor: false`, and the project's globals.css drives both modes.

import "server-only";

import {
  createHighlighter,
  type BundledLanguage,
  type BundledTheme,
  type Highlighter,
} from "shiki";

const LANGUAGES: BundledLanguage[] = [
  "tsx",
  "ts",
  "jsx",
  "js",
  "bash",
  "json",
  "css",
  "html",
  "md",
];

const LIGHT_THEME: BundledTheme = "github-light";
const DARK_THEME: BundledTheme = "github-dark-dimmed";

let highlighterPromise: Promise<Highlighter> | null = null;

function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: [LIGHT_THEME, DARK_THEME],
      langs: LANGUAGES,
    });
  }
  return highlighterPromise;
}

type SupportedLang = (typeof LANGUAGES)[number];

export async function highlightCode(
  code: string,
  lang: SupportedLang | string = "tsx"
): Promise<string> {
  const highlighter = await getHighlighter();
  const safeLang: SupportedLang = (LANGUAGES as readonly string[]).includes(lang)
    ? (lang as SupportedLang)
    : "tsx";

  // Lazy-load the language on demand.
  const loadedLangs = highlighter.getLoadedLanguages();
  if (!loadedLangs.includes(safeLang)) {
    await highlighter.loadLanguage(safeLang);
  }

  return highlighter.codeToHtml(code, {
    lang: safeLang,
    themes: {
      light: LIGHT_THEME,
      dark: DARK_THEME,
    },
    defaultColor: false,
  });
}
