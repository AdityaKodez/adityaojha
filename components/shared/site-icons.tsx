"use client";

import {
  Activity as ActivityGlyph,
  ArrowBigDown as ArrowBigDownGlyph,
  ArrowBigUp as ArrowBigUpGlyph,
  ArrowLeft as ArrowLeftGlyph,
  ArrowRight as ArrowRightGlyph,
  ArrowUpRight as ArrowUpRightGlyph,
  BookmarkCheck as BookmarkCheckGlyph,
  Check as CheckGlyph,
  ChevronDown as ChevronDownGlyph,
  Circle as CircleGlyph,
  CircleAlert as CircleAlertGlyph,
  CircleArrowDown as CircleArrowDownGlyph,
  CircleOff as CircleOffGlyph,
  Code as CodeGlyph,
  Contrast as ContrastGlyph,
  Copy as CopyGlyph,
  Focus as FocusGlyph,
  FolderOpen as FolderOpenGlyph,
  Forward as ForwardGlyph,
  Gamepad2 as Gamepad2Glyph,
  HeartHandshake as HeartHandshakeGlyph,
  House as HouseGlyph,
  ImagePlus as ImagePlusGlyph,
  Layers as LayersGlyph,
  Link as LinkGlyph,
  ListTodo as ListTodoGlyph,
  LoaderCircle as LoaderCircleGlyph,
  LockKeyhole as LockKeyholeGlyph,
  MessageCircle as MessageCircleGlyph,
  MessageSquareQuote as MessageSquareQuoteGlyph,
  Monitor as MonitorGlyph,
  Moon as MoonGlyph,
  Music as MusicGlyph,
  Plus as PlusGlyph,
  Radio as RadioGlyph,
  RotateCcw as RotateCcwGlyph,
  Search as SearchGlyph,
  Send as SendGlyph,
  ShieldCheck as ShieldCheckGlyph,
  SmilePlus as SmilePlusGlyph,
  Sun as SunGlyph,
  SwatchBook as SwatchBookGlyph,
  Swords as SwordsGlyph,
  Terminal as TerminalGlyph,
  TrendingDown as TrendingDownGlyph,
  TrendingUp as TrendingUpGlyph,
  Tv as TvGlyph,
  Upload as UploadGlyph,
  X as XGlyph,
  type IconProps,
} from "scribbles-icons";
import type { ComponentType, SVGProps } from "react";

type SiteIconProps = SVGProps<SVGSVGElement> & { size?: number | string };

// Scope the fill weight to site controls, never a global icon provider.
// Registry components, demos, brand marks, and custom stickers keep their icons.
function createSiteIcon(
  Icon: ComponentType<IconProps>,
  weight: IconProps["weight"] = "fill",
) {
  return function SiteIcon(props: SiteIconProps) {
    return <Icon size={24} aria-hidden="true" {...props} weight={weight} />;
  };
}

export const Activity = createSiteIcon(ActivityGlyph);
export const ArrowBigDown = createSiteIcon(ArrowBigDownGlyph);
export const ArrowBigUp = createSiteIcon(ArrowBigUpGlyph);
export const ArrowDownCircleIcon = createSiteIcon(CircleArrowDownGlyph);
export const ArrowLeft = createSiteIcon(ArrowLeftGlyph);
export const ArrowRight = createSiteIcon(ArrowRightGlyph);
export const ArrowUpRight = createSiteIcon(ArrowUpRightGlyph);
export const ArrowUpRightCircle = createSiteIcon(ArrowUpRightGlyph);
export const BookmarkCheckIcon = createSiteIcon(BookmarkCheckGlyph);
export const Check = createSiteIcon(CheckGlyph);
export const ChevronDown = createSiteIcon(ChevronDownGlyph);
export const Circle = createSiteIcon(CircleGlyph);
export const CircleAlert = createSiteIcon(CircleAlertGlyph);
export const CircleOff = createSiteIcon(CircleOffGlyph);
export const Code = createSiteIcon(CodeGlyph);
export const Contrast = createSiteIcon(ContrastGlyph);
export const Copy = createSiteIcon(CopyGlyph);
export const Focus = createSiteIcon(FocusGlyph);
export const FolderOpen = createSiteIcon(FolderOpenGlyph);
export const ForwardIcon = createSiteIcon(ForwardGlyph);
export const Gamepad2 = createSiteIcon(Gamepad2Glyph);
export const HeartHandshake = createSiteIcon(HeartHandshakeGlyph);
export const Home = createSiteIcon(HouseGlyph);
export const ImagePlus = createSiteIcon(ImagePlusGlyph);
export const Layers = createSiteIcon(LayersGlyph);
export const Link = createSiteIcon(LinkGlyph);
export const ListTodo = createSiteIcon(ListTodoGlyph);
export const Loader2 = createSiteIcon(LoaderCircleGlyph);
export const LockKeyhole = createSiteIcon(LockKeyholeGlyph);
export const Message = createSiteIcon(MessageCircleGlyph);
export const MessageSquareQuote = createSiteIcon(MessageSquareQuoteGlyph);
export const Monitor = createSiteIcon(MonitorGlyph);
export const Moon = createSiteIcon(MoonGlyph);
export const Music = createSiteIcon(MusicGlyph);
export const Plus = createSiteIcon(PlusGlyph);
export const Radio = createSiteIcon(RadioGlyph);
export const RotateCcw = createSiteIcon(RotateCcwGlyph);
export const Search = createSiteIcon(SearchGlyph, "bold");
export const Send = createSiteIcon(SendGlyph);
export const ShieldCheck = createSiteIcon(ShieldCheckGlyph);
export const SmilePlus = createSiteIcon(SmilePlusGlyph);
export const Sun = createSiteIcon(SunGlyph);
export const SwatchBook = createSiteIcon(SwatchBookGlyph);
export const Swords = createSiteIcon(SwordsGlyph);
export const Terminal = createSiteIcon(TerminalGlyph);
export const TrendingDown = createSiteIcon(TrendingDownGlyph);
export const TrendingUp = createSiteIcon(TrendingUpGlyph);
export const Tv = createSiteIcon(TvGlyph);
export const Upload = createSiteIcon(UploadGlyph);
export const X = createSiteIcon(XGlyph);
export const ArrowRightIcon = ArrowRight;
