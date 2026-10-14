"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { INITIAL_PROGRESS, LENGTH, TRACE, penAt, readoutAt } from "./model";
import type { profileBannerConfig } from "@/config/profile-banner";

type Props = {
  base: ReactNode;
  gantry: ReactNode;
  head: ReactNode;
  axes: { x: number[]; y: number[] };
  tracePoints: number[][];
  width: number;
  height: number;
  penOffset: number;
  copy: typeof profileBannerConfig;
};

export function PlotterLive({ base, gantry, head, axes, tracePoints, width, height, penOffset, copy }: Props) {
  const stage = useRef<HTMLDivElement>(null);
  const bridge = useRef<SVGGElement>(null);
  const pen = useRef<SVGGElement>(null);
  const ink = useRef<SVGPathElement>(null);
  const readout = useRef<HTMLSpanElement>(null);
  const progress = useRef(INITIAL_PROGRESS);
  const target = useRef(INITIAL_PROGRESS);
  const steer = useRef<(value: number) => void>(() => {});
  const descriptionId = useId();
  const translate = (x: number, y: number) => `translate(${(axes.x[0] * x + axes.y[0] * y).toFixed(2)} ${(axes.x[1] * x + axes.y[1] * y).toFixed(2)})`;
  const rest = penAt(INITIAL_PROGRESS);

  useEffect(() => {
    const root = stage.current;
    if (!root) return;
    const calm = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let last = 0;
    let visible = false;
    let touring = !calm.matches;
    let tourTime = 0;
    let active = false;
    let resumeTimer = 0;
    const fullPath = ink.current?.getTotalLength() ?? 1;
    const screenLengths = tracePoints.slice(1).map((point, index) => Math.hypot(point[0] - tracePoints[index][0], point[1] - tracePoints[index][1]));
    const worldLengths = TRACE.slice(1).map((point, index) => Math.hypot(point[0] - TRACE[index][0], point[1] - TRACE[index][1]));

    const draw = () => {
      const at = penAt(progress.current);
      const shift = (x: number, y: number) => `translate(${axes.x[0] * x + axes.y[0] * y} ${axes.x[1] * x + axes.y[1] * y})`;
      bridge.current?.setAttribute("transform", shift(0, at.y - penOffset));
      pen.current?.setAttribute("transform", shift(at.x, at.y - penOffset));
      // Account for the camera foreshortening: progress is world distance,
      // while SVG dash lengths are screen distance.
      let remaining = progress.current * LENGTH;
      let drawn = 0;
      for (let i = 0; i < worldLengths.length; i++) {
        const share = Math.min(1, remaining / worldLengths[i]);
        drawn += Math.max(0, share) * screenLengths[i];
        remaining -= worldLengths[i];
      }
      ink.current?.setAttribute("stroke-dasharray", `${drawn} ${fullPath + 1}`);
      const text = readoutAt(progress.current, copy.unit);
      if (readout.current && readout.current.textContent !== text) readout.current.textContent = text;
    };
    const tick = (now: number) => {
      const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
      last = now;
      if (touring && !calm.matches) {
        tourTime += dt;
        const phase = tourTime % 11;
        target.current = Math.min(1, Math.max(0, (phase - 1.4) / 7.5));
      }
      progress.current = calm.matches ? target.current : progress.current + (target.current - progress.current) * (1 - Math.exp(-dt / 0.18));
      if (Math.abs(target.current - progress.current) < 0.0001) progress.current = target.current;
      draw();
      frame = visible && ((touring && !calm.matches) || progress.current !== target.current) ? requestAnimationFrame(tick) : 0;
    };
    const run = () => {
      if (!frame && visible && !document.hidden) {
        last = 0;
        frame = requestAnimationFrame(tick);
      }
    };
    const pause = () => {
      active = true;
      touring = false;
      clearTimeout(resumeTimer);
    };
    const resume = () => {
      active = false;
      clearTimeout(resumeTimer);
      resumeTimer = window.setTimeout(() => {
        if (!active && !calm.matches) {
          touring = true;
          tourTime = 1.4 + progress.current * 7.5;
          run();
        }
      }, 3600);
    };
    steer.current = (value: number) => {
      pause();
      target.current = Math.max(0, Math.min(1, value));
      // Accessible announcements follow user input, never the animation loop.
      root.setAttribute("aria-valuenow", String(Math.round(target.current * 100)));
      root.setAttribute("aria-valuetext", `${Math.round(target.current * 100)}% · ${readoutAt(target.current, copy.unit)}`);
      run();
    };
    const observer = new IntersectionObserver(entries => {
      visible = Boolean(entries.at(-1)?.isIntersecting);
      if (visible) run();
      else { cancelAnimationFrame(frame); frame = 0; }
    });
    const visibility = () => {
      if (document.hidden) { cancelAnimationFrame(frame); frame = 0; }
      else run();
    };
    const motionChanged = () => {
      touring = !calm.matches && !active;
      if (calm.matches) target.current = progress.current;
      run();
    };
    observer.observe(root);
    root.addEventListener("pointerenter", pause);
    root.addEventListener("pointerleave", resume);
    root.addEventListener("focus", pause);
    root.addEventListener("blur", resume);
    calm.addEventListener("change", motionChanged);
    document.addEventListener("visibilitychange", visibility);
    draw();
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(resumeTimer);
      observer.disconnect();
      root.removeEventListener("pointerenter", pause);
      root.removeEventListener("pointerleave", resume);
      root.removeEventListener("focus", pause);
      root.removeEventListener("blur", resume);
      calm.removeEventListener("change", motionChanged);
      document.removeEventListener("visibilitychange", visibility);
      steer.current = () => {};
    };
  }, [axes, tracePoints, penOffset, copy.unit]);

  const point = (clientX: number) => {
    const box = stage.current?.getBoundingClientRect();
    if (box) steer.current((clientX - box.left - box.width * 0.12) / (box.width * 0.76));
  };

  return (
    <div className="profile-banner iso-plate">
      <div className="profile-banner-top" aria-hidden="true">
        <span>{copy.figure}</span><span>{copy.title}</span>
      </div>
      <div
        ref={stage}
        className="profile-banner-stage iso-stage"
        role="slider"
        tabIndex={0}
        aria-label={copy.label}
        aria-describedby={descriptionId}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={0}
        aria-valuetext={`0% · ${copy.initialReadout}`}
        onPointerMove={event => { if (event.pointerType === "mouse" || event.buttons > 0) point(event.clientX); }}
        onPointerDown={event => point(event.clientX)}
        onKeyDown={event => {
          const step = event.shiftKey ? 0.2 : 0.05;
          let value: number | undefined;
          if (event.key === "ArrowRight" || event.key === "ArrowUp") value = target.current + step;
          if (event.key === "ArrowLeft" || event.key === "ArrowDown") value = target.current - step;
          if (event.key === "Home" || event.key === "Escape") value = 0;
          if (event.key === "End") value = 1;
          if (value !== undefined) { event.preventDefault(); steer.current(value); }
        }}
      >
        <svg className="iso-svg" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={copy.description}>
          {base}
          <path ref={ink} className="profile-banner-ink" d={tracePoints.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(2)} ${p[1].toFixed(2)}`).join("")} strokeDasharray="0 1000" />
          <g ref={bridge} transform={translate(0, rest.y - penOffset)}>{gantry}</g>
          <g ref={pen} transform={translate(rest.x, rest.y - penOffset)}>{head}</g>
        </svg>
      </div>
      <div className="profile-banner-bottom" aria-hidden="true">
        <span><span className="hidden sm:inline">{copy.hint}</span><span className="sm:hidden">{copy.mobileHint}</span></span>
        <span ref={readout} data-readout>{copy.initialReadout}</span>
      </div>
      <p id={descriptionId} className="sr-only">{copy.description}</p>
    </div>
  );
}
