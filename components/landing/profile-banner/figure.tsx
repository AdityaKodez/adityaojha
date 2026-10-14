import { profileBannerConfig } from "@/config/profile-banner";
import { base, gantry, head, axes, tracePoints, WIDTH, HEIGHT, PEN_OFFSET } from "./geometry";
import { PlotterLive } from "./live";

export function ProfileBanner() {
  return (
    <PlotterLive
      axes={axes}
      tracePoints={tracePoints}
      width={WIDTH}
      height={HEIGHT}
      penOffset={PEN_OFFSET}
      copy={profileBannerConfig}
      base={<g key="base" dangerouslySetInnerHTML={{ __html: base }} />}
      gantry={<g key="gantry" dangerouslySetInnerHTML={{ __html: gantry }} />}
      head={<g key="head" dangerouslySetInnerHTML={{ __html: head }} />}
    />
  );
}
