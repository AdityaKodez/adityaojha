import type { SVGProps } from "react";

export type SiteIconProps = SVGProps<SVGSVGElement> & {
  size?: number | string;
};

// Scope the pre-built Scribbles sprite to site controls, never a global icon provider.
// Registry components, demos, brand marks, and custom stickers keep their icons.
function createSiteIcon(id: string) {
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
        <use href={`/icons/site-icons.svg#${id}`} />
      </svg>
    );
  };
}

export const Activity = createSiteIcon("activity");
export const Armchair = createSiteIcon("armchair");
export const ArrowBigDown = createSiteIcon("arrow-big-down");
export const ArrowBigUp = createSiteIcon("arrow-big-up");
export const ArrowDownCircleIcon = createSiteIcon("circle-arrow-down");
export const ArrowLeft = createSiteIcon("arrow-left");
export const ArrowRight = createSiteIcon("arrow-right");
export const ArrowUpRight = createSiteIcon("arrow-up-right");
export const ArrowUpRightCircle = createSiteIcon("arrow-up-right");
export const BookmarkCheckIcon = createSiteIcon("bookmark-check");
export const Check = createSiteIcon("check");
export const ChevronDown = createSiteIcon("chevron-down");
export const Circle = createSiteIcon("circle");
export const CircleAlert = createSiteIcon("circle-alert");
export const CircleOff = createSiteIcon("circle-off");
export const Code = createSiteIcon("code");
export const CodeXml = createSiteIcon("code-xml");
export const Coffee = createSiteIcon("coffee");
export const Contrast = createSiteIcon("contrast");
export const Copy = createSiteIcon("copy");
export const FlaskConical = createSiteIcon("flask-conical");
export const Focus = createSiteIcon("focus");
export const FolderOpen = createSiteIcon("folder-open");
export const ForwardIcon = createSiteIcon("forward");
export const Gamepad2 = createSiteIcon("gamepad-2");
export const HandHeart = createSiteIcon("hand-heart");
export const Heart = createSiteIcon("heart");
export const HeartHandshake = createSiteIcon("heart-handshake");
export const Home = createSiteIcon("house");
export const ImagePlus = createSiteIcon("image-plus");
export const Layers = createSiteIcon("layers");
export const Link = createSiteIcon("link");
export const ListTodo = createSiteIcon("list-todo");
export const Loader2 = createSiteIcon("loader-circle");
export const LockKeyhole = createSiteIcon("lock-keyhole");
export const Message = createSiteIcon("message-circle");
export const MessageSquareQuote = createSiteIcon("message-square-quote");
export const Monitor = createSiteIcon("monitor");
export const Moon = createSiteIcon("moon");
export const Music = createSiteIcon("music");
export const PartyPopper = createSiteIcon("party-popper");
export const PenLine = createSiteIcon("pen-line");
export const Plus = createSiteIcon("plus");
export const Radio = createSiteIcon("radio");
export const Receipt = createSiteIcon("receipt");
export const RotateCcw = createSiteIcon("rotate-ccw");
export const Search = createSiteIcon("search");
export const Send = createSiteIcon("send");
export const ShieldCheck = createSiteIcon("shield-check");
export const SmilePlus = createSiteIcon("smile-plus");
export const Sparkle = createSiteIcon("sparkle");
export const Sparkles = createSiteIcon("sparkles");
export const Star = createSiteIcon("star");
export const Sun = createSiteIcon("sun");
export const SwatchBook = createSiteIcon("swatch-book");
export const Swords = createSiteIcon("swords");
export const Terminal = createSiteIcon("terminal");
export const TrendingDown = createSiteIcon("trending-down");
export const TrendingUp = createSiteIcon("trending-up");
export const Tv = createSiteIcon("tv");
export const Upload = createSiteIcon("upload");
export const X = createSiteIcon("x");
export const ArrowRightIcon = ArrowRight;
