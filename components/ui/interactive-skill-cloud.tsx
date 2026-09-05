"use client";

import { cn } from "@/lib/utils";
import Matter from "matter-js";
import {
  type RefObject,
  type ReactNode,
  useEffect,
  useRef,
  useSyncExternalStore,
} from "react";

export interface SkillCloudItem {
  id: string;
  name: string;
  /** Optional icon rendered inside the pill. Any React node works. */
  icon?: ReactNode;
}

export interface InteractiveSkillCloudProps {
  items: SkillCloudItem[];
  /** Height of the physics arena in px. */
  height?: number;
  /**
   * Whether pills fall or float. `1` (default) drops them into a pile at
   * the bottom of the arena. Set it to `0` for a float-and-throw playground
   * where pills keep their momentum after a fling.
   */
  gravity?: number;
  className?: string;
  /** Optional overlay or background content rendered inside the arena. */
  children?: ReactNode;
}

const FONT_STACK = "Geist Mono, ui-monospace, SFMono-Regular, monospace";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeMotionPreference(callback: () => void) {
  const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

function getAnimationSnapshot() {
  return !window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function getAnimationServerSnapshot() {
  return false;
}

let sharedCtx: CanvasRenderingContext2D | null = null;
const measureCache = new Map<string, { width: number; height: number }>();

/** Width a pill needs for its icon + label, in px. */
function measureName(name: string): { width: number; height: number } {
  const cached = measureCache.get(name);
  if (cached) return cached;

  if (typeof document === "undefined") {
    return { width: 140, height: 34 };
  }

  if (!sharedCtx) {
    const canvas = document.createElement("canvas");
    sharedCtx = canvas.getContext("2d");
  }

  if (!sharedCtx) {
    return { width: 140, height: 34 };
  }

  sharedCtx.font = `600 12px ${FONT_STACK}`;
  const textWidth = Math.ceil(sharedCtx.measureText(name).width);
  const result = {
    // 16px icon + 12px gap + label + 2 * 12px padding
    width: Math.max(56, 16 + 12 + textWidth + 24),
    height: 34,
  };
  measureCache.set(name, result);
  return result;
}

function spawnPosition(width: number, height: number, falling: boolean) {
  return {
    x: 60 + Math.random() * Math.max(width - 120, 120),
    y: falling
      ? 30 + Math.random() * Math.max(height * 0.4, 60)
      : 40 + Math.random() * Math.max(height - 80, 80),
  };
}

export function InteractiveSkillCloud({
  items,
  height = 360,
  gravity = 1,
  className,
  children,
}: InteractiveSkillCloudProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Enable physics only on the client, and only when the user hasn't asked
  // for reduced motion. The static cloud is the SSR and a11y fallback.
  const animated = useSyncExternalStore(
    subscribeMotionPreference,
    getAnimationSnapshot,
    getAnimationServerSnapshot,
  );

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full overflow-hidden", className)}
      style={{ height }}
    >
      {children}
      {!animated ? (
        <div className="absolute inset-0 flex flex-wrap content-start gap-2.5 p-4">
          {items.map((item) => (
            <span
              key={item.id}
              className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 font-mono text-xs font-medium text-foreground"
            >
              {item.icon}
              {item.name}
            </span>
          ))}
        </div>
      ) : null}

      {animated ? (
        <PhysicsLayer
          containerRef={containerRef}
          items={items}
          height={height}
          gravity={gravity}
        />
      ) : null}
    </div>
  );
}

interface PhysicsLayerProps {
  containerRef: RefObject<HTMLDivElement | null>;
  items: SkillCloudItem[];
  height: number;
  gravity: number;
}
function PhysicsLayer({
  containerRef,
  items,
  height,
  gravity,
}: PhysicsLayerProps) {
  const pointerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const pointer = pointerRef.current;
    if (!container || !pointer) {
      return;
    }

    const width = container.clientWidth || 640;

    const engine = Matter.Engine.create();
    engine.gravity.y = gravity;
    // Chamfered (capsule) bodies compile to compound bodies in matter-js and
    // oscillate when stacked, so physics runs on plain rectangles. Sleeping
    // plus extra solver iterations let the pile settle fully still.
    engine.enableSleeping = true;
    engine.positionIterations = 10;
    engine.velocityIterations = 8;
    const falling = gravity > 0;

    // One rigid body per pill. We store the DOM-measured size so the transform
    // math stays exact even when a body rotates (bounds inflate under tilt).
    const pills = items.map((item) => {
      const dims = measureName(item.name);
      const pos = spawnPosition(width, height, falling);
      const body = Matter.Bodies.rectangle(
        pos.x,
        pos.y,
        dims.width,
        dims.height,
        {
          restitution: falling ? 0.05 : 0.9,
          frictionAir: falling ? 0.015 : 0.04,
          friction: falling ? 0.6 : 0.02,
          angle: (Math.random() - 0.5) * 0.2,
          label: item.id,
        },
      );
      // A little shove so the cloud drifts and bumps on its own.
      Matter.Body.setVelocity(body, {
        x: (Math.random() - 0.5) * 1.5,
        y: (Math.random() - 0.5) * 1.5,
      });
      return { body, dims };
    });

    // Invisible walls keep pills inside the arena with a subtle inner padding.
    const wall = 64;
    const padding = 6;
    const walls = [
      Matter.Bodies.rectangle(width / 2, -wall / 2 + padding, width + wall * 2, wall, { isStatic: true }),
      Matter.Bodies.rectangle(width / 2, height + wall / 2 - padding, width + wall * 2, wall, { isStatic: true }),
      Matter.Bodies.rectangle(-wall / 2 + padding, height / 2, wall, height + wall * 2, { isStatic: true }),
      Matter.Bodies.rectangle(width + wall / 2 - padding, height / 2, wall, height + wall * 2, { isStatic: true }),
    ];

    Matter.Composite.add(engine.world, [
      ...pills.map((p) => p.body),
      ...walls,
    ]);

    // Mouse drag + fling. Matter's Mouse binds its own mousemove updates.
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse: Matter.Mouse.create(pointer),
      constraint: {
        stiffness: 0.1,
        damping: 0.15,
        render: { visible: false },
      },
    });
    Matter.Composite.add(engine.world, mouseConstraint);

    // Keep pills upright and prevent upside-down text flipping.
    const uprightPills = () => {
      for (const { body } of pills) {
        let angle = body.angle % (2 * Math.PI);
        if (angle > Math.PI) angle -= 2 * Math.PI;
        if (angle < -Math.PI) angle += 2 * Math.PI;

        // Apply gentle restoring torque towards upright
        body.torque = -angle * 0.05;

        // Limit tilt angle to max ~45deg so pill labels are always readable
        const maxAngle = Math.PI / 4;
        if (Math.abs(angle) > maxAngle) {
          Matter.Body.setAngle(body, Math.sign(angle) * maxAngle);
          Matter.Body.setAngularVelocity(body, body.angularVelocity * 0.5);
        }
      }
    };

    // Cache DOM pill elements for fast 60fps transform updates
    const pillElementMap = new Map<string, HTMLElement>();
    for (const { body } of pills) {
      const el = container.querySelector<HTMLElement>(
        `[data-pill="${body.label}"]`,
      );
      if (el) pillElementMap.set(body.label, el);
    }

    // Move the DOM pills to match their bodies every engine tick.
    const syncPills = () => {
      uprightPills();
      for (const { body, dims } of pills) {
        const el =
          pillElementMap.get(body.label) ??
          container.querySelector<HTMLElement>(`[data-pill="${body.label}"]`);
        if (!el) continue;
        if (!pillElementMap.has(body.label)) {
          pillElementMap.set(body.label, el);
        }
        // Translate center of DOM pill to body.position and apply rotation
        el.style.transform = `translate3d(${body.position.x - dims.width / 2}px, ${body.position.y - dims.height / 2}px, 0) rotate(${body.angle}rad)`;
      }
    };

    // Initial position sync on mount
    syncPills();

    const handleResize = () => {
      const newWidth = container.clientWidth || 640;
      Matter.Body.setPosition(walls[0], { x: newWidth / 2, y: -wall / 2 + padding });
      Matter.Body.setPosition(walls[1], { x: newWidth / 2, y: height + wall / 2 - padding });
      Matter.Body.setPosition(walls[2], { x: -wall / 2 + padding, y: height / 2 });
      Matter.Body.setPosition(walls[3], { x: newWidth + wall / 2 - padding, y: height / 2 });
    };

    const ro = new ResizeObserver(handleResize);
    ro.observe(container);

    const runner = Matter.Runner.create();
    let isRunning = false;

    const startRunner = () => {
      if (!isRunning) {
        Matter.Runner.run(runner, engine);
        isRunning = true;
      }
    };

    const stopRunner = () => {
      if (isRunning) {
        Matter.Runner.stop(runner);
        isRunning = false;
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting) {
          startRunner();
        } else {
          stopRunner();
        }
      },
      { rootMargin: "100px" },
    );
    io.observe(container);

    Matter.Events.on(engine, "afterUpdate", syncPills);

    return () => {
      io.disconnect();
      ro.disconnect();
      Matter.Events.off(engine, "afterUpdate", syncPills);
      stopRunner();
      Matter.Composite.clear(engine.world, false);
      Matter.Engine.clear(engine);
    };
  }, [containerRef, items, height, gravity]);

  return (
    <div className="absolute inset-0">
      <div
        ref={pointerRef}
        className="absolute inset-0 z-10 h-full w-full cursor-grab active:cursor-grabbing"
      />
      {/* DOM pills — rendered here, moved by physics, inert to events.
          The overlay above them owns pointer input. */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {items.map((item) => {
          const dims = measureName(item.name);
          return (
            <div
              key={item.id}
              data-pill={item.id}
              className="absolute left-0 top-0 flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 font-mono text-xs font-medium text-foreground will-change-transform"
              style={{
                width: dims.width,
                height: dims.height,
                transformOrigin: "center",
                transform: "translate3d(-9999px, -9999px, 0)",
              }}
            >
              {item.icon}
              <span className="truncate">{item.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
