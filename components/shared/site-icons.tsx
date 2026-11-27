import type { SVGProps } from "react";

export type SiteIconProps = SVGProps<SVGSVGElement> & {
  size?: number | string;
};

type IconSprite = "site-icons" | "sponsor-icons" | "extra-icons";

// Scope the pre-built Scribbles sprites to site controls, never a global icon provider.
// Registry components, demos, brand marks, and custom stickers keep their icons.
function createSiteIcon(id: string, sprite: IconSprite) {
  return function SiteIcon({ size = 24, ...props }: SiteIconProps) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 256 256"
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
        {...props}
      >
        <use href={`/icons/${sprite}.svg#${id}`} />
      </svg>
    );
  };
}

// Core shell + home page icons (preloaded in layout)
export const ArrowBigDown = createSiteIcon("arrow-big-down", "site-icons");
export const ArrowBigUp = createSiteIcon("arrow-big-up", "site-icons");
export const ArrowUpRight = createSiteIcon("arrow-up-right", "site-icons");
export const ArrowUpRightCircle = ArrowUpRight;
export const BookmarkCheckIcon = createSiteIcon("bookmark-check", "site-icons");
export const Copy = createSiteIcon("copy", "site-icons");
export const Message = createSiteIcon("message-circle", "site-icons");
export const Moon = createSiteIcon("moon", "site-icons");
export const Plus = createSiteIcon("plus", "site-icons");
export const Search = createSiteIcon("search", "site-icons");
export const Star = createSiteIcon("star", "site-icons");
export const Sun = createSiteIcon("sun", "site-icons");
export const TrendingDown = createSiteIcon("trending-down", "site-icons");
export const TrendingUp = createSiteIcon("trending-up", "site-icons");
export const X = createSiteIcon("x", "site-icons");

// Sponsor + claim route icons
export const Armchair = createSiteIcon("armchair", "sponsor-icons");
export const ArrowRight = createSiteIcon("arrow-right", "sponsor-icons");
export const ArrowRightIcon = ArrowRight;
export const Check = createSiteIcon("check", "sponsor-icons");
export const CircleAlert = createSiteIcon("circle-alert", "sponsor-icons");
export const Coffee = createSiteIcon("coffee", "sponsor-icons");
export const FlaskConical = createSiteIcon("flask-conical", "sponsor-icons");
export const HandHeart = createSiteIcon("hand-heart", "sponsor-icons");
export const Heart = createSiteIcon("heart", "sponsor-icons");
export const Loader2 = createSiteIcon("loader-circle", "sponsor-icons");
export const LockKeyhole = createSiteIcon("lock-keyhole", "sponsor-icons");
export const PartyPopper = createSiteIcon("party-popper", "sponsor-icons");
export const PenLine = createSiteIcon("pen-line", "sponsor-icons");
export const Receipt = createSiteIcon("receipt", "sponsor-icons");
export const Sparkles = createSiteIcon("sparkles", "sponsor-icons");
export const Upload = createSiteIcon("upload", "sponsor-icons");

// Components showcase, command palette, and error boundary icons
export const ArrowLeft = createSiteIcon("arrow-left", "extra-icons");
export const ChevronDown = createSiteIcon("chevron-down", "extra-icons");
export const Code = createSiteIcon("code", "extra-icons");
export const CodeXml = createSiteIcon("code-xml", "extra-icons");
export const Contrast = createSiteIcon("contrast", "extra-icons");
export const FolderOpen = createSiteIcon("folder-open", "extra-icons");
export const HeartHandshake = createSiteIcon("heart-handshake", "extra-icons");
export const Home = createSiteIcon("house", "extra-icons");
export const ImagePlus = createSiteIcon("image-plus", "extra-icons");
export const Layers = createSiteIcon("layers", "extra-icons");
export const Link = createSiteIcon("link", "extra-icons");
export const MessageSquareQuote = createSiteIcon("message-square-quote", "extra-icons");
export const Monitor = createSiteIcon("monitor", "extra-icons");
export const RotateCcw = createSiteIcon("rotate-ccw", "extra-icons");
export const Send = createSiteIcon("send", "extra-icons");
export const ShieldCheck = createSiteIcon("shield-check", "extra-icons");
export const Sparkle = createSiteIcon("sparkle", "extra-icons");
export const Terminal = createSiteIcon("terminal", "extra-icons");
