"use client";

import {
  Activity01Icon,
  Add01Icon,
  AlertCircleIcon,
  ArrowDown01Icon,
  ArrowLeft02Icon,
  ArrowRight02Icon,
  ArrowUpRight01Icon,
  BookmarkCheck01Icon,
  Cancel01Icon,
  CircleArrowDown02Icon,
  CircleIcon,
  ColorPickerIcon,
  CommandLineIcon,
  ComputerIcon,
  ContrastIcon,
  Copy01Icon,
  FolderOpenIcon,
  GameController03Icon,
  HandshakeIcon,
  Home03Icon,
  ImageAdd01Icon,
  Layers01Icon,
  Link01Icon,
  LiveStreaming01Icon,
  Loading03Icon,
  MessageSquareQuoteIcon,
  Moon02Icon,
  MusicNote03Icon,
  RotateLeft01Icon,
  Search01Icon,
  SentIcon,
  Share08Icon,
  ShieldCheckIcon,
  SmilePlusIcon,
  SourceCodeIcon,
  SquareLock02Icon,
  Sun03Icon,
  Sword03Icon,
  Target02Icon,
  Task01Icon,
  Tick02Icon,
  Tv01Icon,
  UnavailableIcon,
  Upload01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import type { SVGProps } from "react";

type SiteIconProps = SVGProps<SVGSVGElement> & { size?: number | string };

// Keep the site's component-valued icon slots and SVG props intact.
// Published components continue to own their Lucide icons independently.
function createSiteIcon(icon: IconSvgElement) {
  return function SiteIcon({ strokeWidth = 1.8, ...props }: SiteIconProps) {
    return (
      <HugeiconsIcon
        icon={icon}
        strokeWidth={Number(strokeWidth)}
        aria-hidden="true"
        {...props}
      />
    );
  };
}

export const Activity = createSiteIcon(Activity01Icon);
export const ArrowDownCircleIcon = createSiteIcon(CircleArrowDown02Icon);
export const ArrowLeft = createSiteIcon(ArrowLeft02Icon);
export const ArrowRight = createSiteIcon(ArrowRight02Icon);
export const ArrowRightIcon = ArrowRight;
export const ArrowUpRight = createSiteIcon(ArrowUpRight01Icon);
export const BookmarkCheckIcon = createSiteIcon(BookmarkCheck01Icon);
export const Check = createSiteIcon(Tick02Icon);
export const ChevronDown = createSiteIcon(ArrowDown01Icon);
export const Circle = createSiteIcon(CircleIcon);
export const CircleAlert = createSiteIcon(AlertCircleIcon);
export const CircleOff = createSiteIcon(UnavailableIcon);
export const Code = createSiteIcon(SourceCodeIcon);
export const Contrast = createSiteIcon(ContrastIcon);
export const Copy = createSiteIcon(Copy01Icon);
export const Focus = createSiteIcon(Target02Icon);
export const FolderOpen = createSiteIcon(FolderOpenIcon);
export const ForwardIcon = createSiteIcon(Share08Icon);
export const Gamepad2 = createSiteIcon(GameController03Icon);
export const HeartHandshake = createSiteIcon(HandshakeIcon);
export const Home = createSiteIcon(Home03Icon);
export const ImagePlus = createSiteIcon(ImageAdd01Icon);
export const Layers = createSiteIcon(Layers01Icon);
export const Link = createSiteIcon(Link01Icon);
export const ListTodo = createSiteIcon(Task01Icon);
export const Loader2 = createSiteIcon(Loading03Icon);
export const LockKeyhole = createSiteIcon(SquareLock02Icon);
export const MessageSquareQuote = createSiteIcon(MessageSquareQuoteIcon);
export const Monitor = createSiteIcon(ComputerIcon);
export const Moon = createSiteIcon(Moon02Icon);
export const Music = createSiteIcon(MusicNote03Icon);
export const Plus = createSiteIcon(Add01Icon);
export const Radio = createSiteIcon(LiveStreaming01Icon);
export const RotateCcw = createSiteIcon(RotateLeft01Icon);
export const Search = createSiteIcon(Search01Icon);
export const Send = createSiteIcon(SentIcon);
export const ShieldCheck = createSiteIcon(ShieldCheckIcon);
export const SmilePlus = createSiteIcon(SmilePlusIcon);
export const Sun = createSiteIcon(Sun03Icon);
export const SwatchBook = createSiteIcon(ColorPickerIcon);
export const Swords = createSiteIcon(Sword03Icon);
export const Terminal = createSiteIcon(CommandLineIcon);
export const Tv = createSiteIcon(Tv01Icon);
export const Upload = createSiteIcon(Upload01Icon);
export const X = createSiteIcon(Cancel01Icon);
