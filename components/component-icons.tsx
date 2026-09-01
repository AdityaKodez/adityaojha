import type { ComponentIcon } from "@/config/types";
import { SVGProps } from "react";

interface ComponentIconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}

/**
 * Custom SVG icons for the /components showcase catalog.
 * One design per registry entry in config/components.ts, drawn on a shared
 * 24x24 grid with the same stroke language as the local icon set
 * (public/x-icon.tsx): 2px strokes, round caps/joins, currentColor.
 */

const DottedWorldMapIcon = ({
  size = 24,
  color = "currentColor",
  ...props
}: ComponentIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <g fill={color} stroke="none">
      <circle cx="10.2" cy="4.2" r="1.4" />
      <circle cx="13.8" cy="4.2" r="1.4" />
      <circle cx="6.6" cy="8.1" r="1.4" />
      <circle cx="10.2" cy="8.1" r="1.4" />
      <circle cx="13.8" cy="8.1" r="1.4" />
      <circle cx="17.4" cy="8.1" r="1.4" />
      <circle cx="4.8" cy="12" r="1.4" />
      <circle cx="8.4" cy="12" r="1.4" />
      <circle cx="12" cy="12" r="1.4" />
      <circle cx="15.6" cy="12" r="1.4" />
      <circle cx="19.2" cy="12" r="1.4" />
      <circle cx="6.6" cy="15.9" r="1.4" />
      <circle cx="10.2" cy="15.9" r="1.4" />
      <circle cx="13.8" cy="15.9" r="1.4" />
      <circle cx="17.4" cy="15.9" r="1.4" />
      <circle cx="10.2" cy="19.8" r="1.4" />
      <circle cx="13.8" cy="19.8" r="1.4" />
    </g>
  </svg>
);

const CopyCommandBlockIcon = ({
  size = 24,
  color = "currentColor",
  ...props
}: ComponentIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M8 9V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-3" />
    <rect x="2" y="10" width="14" height="11" rx="2" />
    <path d="m5.5 13.5 2 2-2 2" />
    <path d="M10 17.5h3" />
  </svg>
);

const GitHubMapIcon = ({
  size = 24,
  color = "currentColor",
  ...props
}: ComponentIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <g fill={color} stroke="none">
      <rect x="1.5" y="6" width="3" height="3" rx="0.8" fillOpacity="0.12" />
      <rect x="6" y="6" width="3" height="3" rx="0.8" fillOpacity="0.55" />
      <rect x="10.5" y="6" width="3" height="3" rx="0.8" fillOpacity="0.2" />
      <rect x="15" y="6" width="3" height="3" rx="0.8" />
      <rect x="19.5" y="6" width="3" height="3" rx="0.8" fillOpacity="0.35" />
      <rect x="1.5" y="10.5" width="3" height="3" rx="0.8" fillOpacity="0.45" />
      <rect x="6" y="10.5" width="3" height="3" rx="0.8" fillOpacity="0.15" />
      <rect x="10.5" y="10.5" width="3" height="3" rx="0.8" fillOpacity="0.85" />
      <rect x="15" y="10.5" width="3" height="3" rx="0.8" fillOpacity="0.25" />
      <rect x="19.5" y="10.5" width="3" height="3" rx="0.8" fillOpacity="0.6" />
      <rect x="1.5" y="15" width="3" height="3" rx="0.8" fillOpacity="0.25" />
      <rect x="6" y="15" width="3" height="3" rx="0.8" />
      <rect x="10.5" y="15" width="3" height="3" rx="0.8" fillOpacity="0.4" />
      <rect x="15" y="15" width="3" height="3" rx="0.8" fillOpacity="0.65" />
      <rect x="19.5" y="15" width="3" height="3" rx="0.8" fillOpacity="0.12" />
    </g>
  </svg>
);

const ProjectExplorerIcon = ({
  size = 24,
  color = "currentColor",
  ...props
}: ComponentIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="2.5" y="4" width="19" height="16" rx="2" />
    <path d="M9 4v16" />
    <path d="M4.8 8h2.4" />
    <path d="M5.8 11h1.9" />
    <path d="M4.8 14h2.4" />
    <path d="M15.5 13l4.8 5.1-2.7.3-1.5 2.6z" fill={color} stroke="none" />
  </svg>
);

const ProgressiveBlurIcon = ({
  size = 24,
  color = "currentColor",
  ...props
}: ComponentIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M4 4.5h16" />
    <path d="M4 8.25h16" strokeOpacity="0.65" />
    <path d="M4 12h16" strokeOpacity="0.4" />
    <path d="M4 15.75h16" strokeOpacity="0.22" />
    <path d="M4 19.5h16" strokeOpacity="0.1" />
  </svg>
);

const InfiniteSliderIcon = ({
  size = 24,
  color = "currentColor",
  ...props
}: ComponentIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 12c-.9-1.7-2.4-3.75-4.5-3.75a3.75 3.75 0 1 0 0 7.5c2.1 0 3.6-2.05 4.5-3.75zm0 0c.9 1.7 2.4 3.75 4.5 3.75a3.75 3.75 0 1 0 0-7.5c-2.1 0-3.6 2.05-4.5 3.75z" />
    <circle cx="7.5" cy="8.25" r="1.2" fill={color} stroke="none" />
    <circle cx="16.5" cy="15.75" r="1.2" fill={color} stroke="none" />
  </svg>
);

const CarouselIcon = ({
  size = 24,
  color = "currentColor",
  ...props
}: ComponentIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M8.5 8.5H4.2A1.2 1.2 0 0 0 3 9.7v4.6a1.2 1.2 0 0 0 1.2 1.2h4.3" />
    <path d="M15.5 8.5h4.3a1.2 1.2 0 0 1 1.2 1.2v4.6a1.2 1.2 0 0 1-1.2 1.2h-4.3" />
    <rect x="8.5" y="6" width="7" height="10" rx="1.5" />
    <circle cx="9.8" cy="19.5" r="1.1" fill={color} fillOpacity="0.35" stroke="none" />
    <circle cx="12" cy="19.5" r="1.1" fill={color} stroke="none" />
    <circle cx="14.2" cy="19.5" r="1.1" fill={color} fillOpacity="0.35" stroke="none" />
  </svg>
);

const ModeTogglerIcon = ({
  size = 24,
  color = "currentColor",
  ...props
}: ComponentIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {/* sun rays */}
    <line x1="12" y1="2" x2="12" y2="4" />
    <line x1="12" y1="20" x2="12" y2="22" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="2" y1="12" x2="4" y2="12" />
    <line x1="20" y1="12" x2="22" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    {/* sun disc with crescent cutout implied by half-moon path on top */}
    <circle cx="12" cy="12" r="4" />
    {/* crescent moon overlay — uses a masking arc to hint at duality */}
    <path d="M14.5 9.5a5 5 0 0 1-5 5" strokeOpacity="0.45" />
  </svg>
);

const StackPillsIcon = ({
  size = 24,
  color = "currentColor",
  ...props
}: ComponentIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="3" y="4.5" width="13" height="6" rx="3" />
    <rect x="8" y="13.5" width="13" height="6" rx="3" />
    <circle cx="7.5" cy="7.5" r="1" fill={color} stroke="none" />
    <circle cx="12.5" cy="16.5" r="1" fill={color} stroke="none" />
  </svg>
);

const ContactChannelsIcon = ({
  size = 24,
  color = "currentColor",
  ...props
}: ComponentIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="3.5" />
    <path d="M15.5 12v1.5a2.5 2.5 0 0 0 5 0V12a8.5 8.5 0 1 0-3.4 6.8" />
  </svg>
);

const SectionRailIcon = ({
  size = 24,
  color = "currentColor",
  ...props
}: ComponentIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M4 3v18" strokeDasharray="2 3" strokeOpacity="0.45" />
    <path d="M4 6h14" />
    <path d="M4 10h10" strokeOpacity="0.7" />
    <path d="M4 14h7" strokeOpacity="0.5" />
    <path d="M4 18h4" strokeOpacity="0.3" />
  </svg>
);

export {
  DottedWorldMapIcon,
  CopyCommandBlockIcon,
  GitHubMapIcon,
  ProjectExplorerIcon,
  ProgressiveBlurIcon,
  InfiniteSliderIcon,
  CarouselIcon,
  ModeTogglerIcon,
  StackPillsIcon,
  ContactChannelsIcon,
  SectionRailIcon,
};

/** Maps a `ComponentDoc.icon` key onto its icon component. */
export function getComponentIcon(name: ComponentIcon) {
  switch (name) {
    case "terminal":
      return CopyCommandBlockIcon;
    case "git":
      return GitHubMapIcon;
    case "folder":
      return ProjectExplorerIcon;
    case "blur":
      return ProgressiveBlurIcon;
    case "slider":
      return InfiniteSliderIcon;
    case "carousel":
      return CarouselIcon;
    case "theme":
      return ModeTogglerIcon;
    case "pills":
      return StackPillsIcon;
    case "channels":
      return ContactChannelsIcon;
    case "rail":
      return SectionRailIcon;
    case "globe":
    default:
      return DottedWorldMapIcon;
  }
}
