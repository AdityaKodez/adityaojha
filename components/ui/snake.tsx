"use client";

import { cn } from "@/lib/utils";
import { PlayCircleIcon } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { VscSnake } from "react-icons/vsc";
import { Button } from "./button";

/*
 * Theme tokens with the literals a consumer project without them falls back
 * to. Canvas cannot parse `var(--token)`, so these are resolved against the
 * computed style of the field at runtime; see `resolveColor`.
 */
const DEFAULT_FIELD_COLOR = "var(--background, #000000)";
const DEFAULT_DOT_COLOR = "var(--muted-foreground, #525252)";
const DEFAULT_SNAKE_COLOR = "var(--primary, #2563eb)";

/** Corner-dot radius, in CSS pixels, independent of cell size. */
const DOT_RADIUS = 1.5;
/**
 * The lattice is inset from the canvas edge by this fraction of the field so
 * the outermost dots are not half-clipped by the boundary.
 */
const LATTICE_INSET = 0.02;
/** Head and tail disc radii as a fraction of one cell; segments ramp between. */
const HEAD_RADIUS = 0.4;
const TAIL_RADIUS = 0.26;
const FOOD_RADIUS = 0.3;
const HEAD_OPACITY = 1;
const TAIL_OPACITY = 0.35;
/** Pointer travel, in pixels, before a drag counts as a swipe. */
const SWIPE_THRESHOLD = 24;
/** Caps how far one frame can advance the simulation after a stall. */
const MAX_STEP_MS = 150;
/** devicePixelRatio ceiling; two is indistinguishable for discs this small. */
const MAX_DPR = 2;

type Point = { x: number; y: number };
type Direction = "up" | "down" | "left" | "right";

const DELTA: Record<Direction, Point> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

const KEY_DIRECTIONS: Record<string, Direction> = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
  w: "up",
  a: "left",
  s: "down",
  d: "right",
};

const VAR_TOKEN = /^var\(\s*(--[\w-]+)\s*(?:,\s*(.+?))?\)$/;

/**
 * Resolves a color prop to something canvas can paint.
 *
 * Canvas parses `fillStyle` as a CSS color and knows nothing about custom
 * properties, so a raw `var(--primary)` is silently dropped and the previous
 * color stays. A prop that is a var() reference is looked up in the computed
 * style of the field element, which inherits whichever theme is active;
 * anything else is already concrete and passes through. A token the project
 * does not define falls back to the inline literal, then to `fallback`.
 */
function resolveColor(
  element: Element,
  color: string,
  fallback: string,
): string {
  const match = VAR_TOKEN.exec(color.trim());
  if (!match) return color;
  const token = match[1];
  const inlineFallback = match[2]?.trim();
  const resolved = getComputedStyle(element).getPropertyValue(token).trim();
  return resolved || inlineFallback || fallback;
}

export interface SnakeProps {
  /** Cells per side. The field is square, so 20 means 20x20. */
  gridSize?: number;
  /** Milliseconds per step. */
  speed?: number;
  /** Segments the snake starts with. */
  initialLength?: number;
  /** Play field background. */
  fieldColor?: string;
  /** Lattice dots at the cell corners. */
  dotColor?: string;
  /** Snake and food. */
  snakeColor?: string;
  className?: string;
}

/** Picks a uniformly random cell the snake does not occupy. */
function spawnFood(snake: Point[], gridSize: number): Point {
  const taken = new Set(
    snake.map((segment) => segment.y * gridSize + segment.x),
  );
  const free: number[] = [];
  for (let cell = 0; cell < gridSize * gridSize; cell += 1) {
    if (!taken.has(cell)) free.push(cell);
  }
  // Only reachable once the snake fills every cell.
  if (free.length === 0) return { x: -1, y: -1 };
  const cell = free[Math.floor(Math.random() * free.length)];
  return { x: cell % gridSize, y: Math.floor(cell / gridSize) };
}

/** Starts the snake mid-field, running to the right. */
function initialSnake(gridSize: number, initialLength: number): Point[] {
  const row = Math.floor(gridSize / 2);
  const headX = Math.max(initialLength - 1, Math.min(row, gridSize - 1));
  return Array.from({ length: initialLength }, (_, index) => ({
    x: headX - index,
    y: row,
  }));
}

/**
 * A snake game on a dot-lattice field. Steer with the arrow keys, WASD, or a
 * swipe; eat a disc to grow by one segment; wrap around the edges. The run
 * ends when the snake bites itself, and the overlay restarts it.
 *
 * Keys are captured while the field is on screen, hovered, or focused, so the
 * game is playable without clicking into it, and the page keeps its normal
 * arrow-key scrolling once the field is neither of those.
 */
export function Snake({
  gridSize = 20,
  speed = 80,
  initialLength = 3,
  fieldColor = DEFAULT_FIELD_COLOR,
  dotColor = DEFAULT_DOT_COLOR,
  snakeColor = DEFAULT_SNAKE_COLOR,
  className,
}: SnakeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);
  const swipeStartRef = useRef<Point | null>(null);
  const directionRef = useRef<Direction>("right");
  const turnQueueRef = useRef<Direction[]>([]);
  const accumulatorRef = useRef(0);
  // Whether at least half the field is on screen. Gates both the keyboard
  // listener and the simulation, so an off-screen game neither steals keys
  // nor runs unattended.
  const inViewRef = useRef(true);
  // Hover and focus are input events, so they arrive even when the
  // intersection observer has not reported yet.
  const hoverRef = useRef(false);
  const focusRef = useRef(false);

  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  // Bumped when the theme class on <html> changes, which re-resolves the
  // color props and repaints the lattice in the new palette.
  const [colorVersion, setColorVersion] = useState(0);
  const reduceMotion = useReducedMotion();

  const grid = Math.max(2, Math.floor(gridSize));
  const length = Math.max(1, Math.floor(initialLength));

  // The opening board is built during the first render, so the draw loop
  // always has a valid snake and food from its very first frame.
  const [openingBoard] = useState(() => {
    const snake = initialSnake(grid, length);
    return { snake, food: spawnFood(snake, grid) };
  });
  const snakeRef = useRef<Point[]>(openingBoard.snake);
  const foodRef = useRef<Point>(openingBoard.food);

  const restart = useCallback(() => {
    snakeRef.current = initialSnake(grid, length);
    foodRef.current = spawnFood(snakeRef.current, grid);
    directionRef.current = "right";
    turnQueueRef.current = [];
    accumulatorRef.current = 0;
    setScore(0);
    setGameOver(false);
  }, [grid, length]);

  // Prop changes start a new board. The restart is scheduled from a frame
  // callback rather than run inline: restart sets state, and a synchronous
  // setState inside the effect would cascade a second render.
  useEffect(() => {
    const frame = requestAnimationFrame(restart);
    return () => cancelAnimationFrame(frame);
  }, [restart]);

  // Dark mode is class-based, so a theme swap arrives as an attribute change
  // on the document element and the resolved colors have to be rebuilt.
  useEffect(() => {
    const observer = new MutationObserver(() =>
      setColorVersion((version) => version + 1),
    );
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style"],
    });
    return () => observer.disconnect();
  }, []);

  // Half the field on screen counts as "the player is here". The observer
  // corrects the optimistic initial value on its first callback.
  useEffect(() => {
    const field = fieldRef.current;
    if (!field || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        inViewRef.current = entries.some((entry) => entry.isIntersecting);
      },
      { threshold: 0.5 },
    );
    observer.observe(field);
    return () => observer.disconnect();
  }, []);

  const turn = useCallback(
    (direction: Direction) => {
      if (gameOver) return;
      const queue = turnQueueRef.current;
      const last =
        queue.length > 0 ? queue[queue.length - 1] : directionRef.current;
      const reverses =
        DELTA[last].x + DELTA[direction].x === 0 &&
        DELTA[last].y + DELTA[direction].y === 0;
      // Two buffered turns are enough to plan a corner without letting a fast
      // player queue a move that outlives the board state it was meant for.
      if (!reverses && last !== direction && queue.length < 2) {
        queue.push(direction);
      }
    },
    [gameOver],
  );

  /*
   * Steering lives on `window` rather than the field so the game needs no
   * click to become playable. Keys are captured while the field is on screen,
   * hovered, or focused, and never while the user is typing in another
   * field. Once none of those hold the listener detaches, which hands
   * arrow-key scrolling back to the page.
   */
  useEffect(() => {
    if (gameOver) return;

    const handleWindowKeyDown = (event: KeyboardEvent) => {
      if (!inViewRef.current && !hoverRef.current && !focusRef.current) return;
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.isContentEditable ||
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT")
      ) {
        return;
      }
      const direction = KEY_DIRECTIONS[event.key];
      if (!direction) return;
      event.preventDefault();
      turn(direction);
    };

    window.addEventListener("keydown", handleWindowKeyDown);
    return () => window.removeEventListener("keydown", handleWindowKeyDown);
  }, [gameOver, turn]);

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    swipeStartRef.current = { x: event.clientX, y: event.clientY };
  };

  const handlePointerEnter = () => {
    hoverRef.current = true;
  };

  const handlePointerLeave = () => {
    hoverRef.current = false;
  };

  const handleFocus = () => {
    focusRef.current = true;
  };

  const handleBlur = () => {
    focusRef.current = false;
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const start = swipeStartRef.current;
    swipeStartRef.current = null;
    if (!start) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < SWIPE_THRESHOLD) return;
    if (Math.abs(dx) > Math.abs(dy)) {
      turn(dx > 0 ? "right" : "left");
    } else {
      turn(dy > 0 ? "down" : "up");
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const field = fieldRef.current;
    if (!canvas || !field) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Canvas paints concrete colors only, so every var() prop is resolved
    // against the field's computed style once per setup.
    const resolvedField = resolveColor(field, fieldColor, "#000000");
    const resolvedDot = resolveColor(field, dotColor, "#525252");
    const resolvedSnake = resolveColor(field, snakeColor, "#2563eb");

    // The lattice never changes, so it is painted once per resize into an
    // offscreen canvas and blitted each frame.
    const lattice = document.createElement("canvas");
    const latticeCtx = lattice.getContext("2d");

    let cell = 0;
    let inset = 0;
    let dpr = 1;

    const resize = () => {
      const size = field.clientWidth;
      if (size === 0) return;
      dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas.width = Math.round(size * dpr);
      canvas.height = Math.round(size * dpr);
      lattice.width = canvas.width;
      lattice.height = canvas.height;
      inset = size * LATTICE_INSET;
      cell = (size - inset * 2) / grid;

      if (latticeCtx) {
        latticeCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
        latticeCtx.clearRect(0, 0, size, size);
        latticeCtx.fillStyle = resolvedDot;
        for (let row = 0; row <= grid; row += 1) {
          for (let column = 0; column <= grid; column += 1) {
            latticeCtx.beginPath();
            latticeCtx.arc(
              inset + column * cell,
              inset + row * cell,
              DOT_RADIUS,
              0,
              Math.PI * 2,
            );
            latticeCtx.fill();
          }
        }
      }
    };

    const disc = (x: number, y: number, radius: number, alpha: number) => {
      ctx.globalAlpha = alpha;
      ctx.fillStyle = resolvedSnake;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    };

    const draw = () => {
      const size = canvas.width / dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = resolvedField;
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(lattice, 0, 0, size, size);

      const food = foodRef.current;
      if (food.x >= 0) {
        disc(
          inset + (food.x + 0.5) * cell,
          inset + (food.y + 0.5) * cell,
          cell * FOOD_RADIUS,
          1,
        );
      }

      const snake = snakeRef.current;
      // Tail first so the head paints on top. The ramp runs from the largest,
      // brightest disc at the head down to the faintest at the tail.
      for (let index = snake.length - 1; index >= 0; index -= 1) {
        const t = snake.length <= 1 ? 0 : index / (snake.length - 1);
        disc(
          inset + (snake[index].x + 0.5) * cell,
          inset + (snake[index].y + 0.5) * cell,
          cell * (HEAD_RADIUS + (TAIL_RADIUS - HEAD_RADIUS) * t),
          HEAD_OPACITY + (TAIL_OPACITY - HEAD_OPACITY) * t,
        );
      }
      const head = snake[0];
      const hx = inset + (head.x + 0.5) * cell;
      const hy = inset + (head.y + 0.5) * cell;
      const headRadius = cell * HEAD_RADIUS;
      const forward = DELTA[directionRef.current];
      const side = { x: -forward.y, y: forward.x };
      const offset = headRadius * 0.32;
      const eyeRadius = Math.max(1, headRadius * 0.2);

      ctx.globalAlpha = 1;
      ctx.fillStyle = resolvedDot;
      for (const sign of [1, -1]) {
        ctx.beginPath();
        ctx.arc(
          hx + forward.x * offset + side.x * offset * sign,
          hy + forward.y * offset + side.y * offset * sign,
          eyeRadius,
          0,
          Math.PI * 2,
        );
        ctx.fill();
      }
    };


    const step = () => {
      const direction = turnQueueRef.current.shift() ?? directionRef.current;
      directionRef.current = direction;
      const delta = DELTA[direction];
      const snake = snakeRef.current;
      const next: Point = {
        x: (snake[0].x + delta.x + grid) % grid,
        y: (snake[0].y + delta.y + grid) % grid,
      };

      const eats = foodRef.current.x === next.x && foodRef.current.y === next.y;
      // The tail cell frees up on a normal step, so biting it is safe; while
      // growing it is not.
      const limit = eats ? snake.length : snake.length - 1;
      for (let index = 0; index < limit; index += 1) {
        if (snake[index].x === next.x && snake[index].y === next.y) {
          setGameOver(true);
          return;
        }
      }

      const grown = [next, ...snake];
      if (eats) {
        foodRef.current = spawnFood(grown, grid);
        setScore((current) => current + 10);
        if (foodRef.current.x < 0) {
          // The board is full, so the run ends through the same overlay.
          snakeRef.current = grown;
          setGameOver(true);
          return;
        }
      } else {
        grown.pop();
      }
      snakeRef.current = grown;
    };

    const stepMs = Math.max(16, speed);
    let frame = 0;
    let last = performance.now();

    const loop = (now: number) => {
      frame = requestAnimationFrame(loop);
      const elapsed = Math.min(now - last, MAX_STEP_MS);
      last = now;
      // Off screen the field keeps its last frame and the snake holds still,
      // so scrolling away never kills a run.
      if (!inViewRef.current) return;
      if (!gameOver) {
        accumulatorRef.current += elapsed;
        while (accumulatorRef.current >= stepMs) {
          accumulatorRef.current -= stepMs;
          step();
        }
      }
      draw();
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(field);
    frame = requestAnimationFrame(loop);

    // A backgrounded tab stops firing frames, so the next frame after it
    // returns would arrive with one enormous delta.
    const handleVisibilityChange = () => {
      last = performance.now();
      accumulatorRef.current = 0;
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [colorVersion, dotColor, fieldColor, gameOver, grid, snakeColor, speed]);

  return (
    <div className="w-full">
      <div className="mb-2 flex items-baseline justify-between font-mono text-xs text-muted-foreground">
        <span>
          Score{" "}
          {/* Keyed on the score so every change remounts the number and
              replays the pop. */}
          <motion.span
            key={score}
            initial={{ scale: 1.6, opacity: 0.4 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { duration: 0.28, ease: [0.22, 1, 0.36, 1] }
            }
            className="inline-block origin-left tabular-nums"
          >
            {score}
          </motion.span>
        </span>
      </div>
      <div
        ref={fieldRef}
        tabIndex={0}
        aria-label="Snake game field. Steer with the arrow keys, WASD, or a swipe."
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        className={cn(
          "relative block aspect-square w-full touch-none overflow-hidden rounded-md outline-none",

          className,
        )}
      >
        <canvas
          ref={canvasRef}
          className="pointer-events-none absolute inset-0 block h-full w-full"
        />
        {gameOver ? (
          <div className="absolute inset-0 grid place-items-center">
            {/*
              The overlay takes the popover token pair rather than the field
              colors: the field now follows the theme, and white text would
              disappear over a light field. The pair always contrasts, with
              literal fallbacks for projects without the tokens.
            */}
            <div
              className="absolute inset-0"
              style={{
                backgroundColor: "var(--popover, #ffffff)",
                opacity: 0.78,
                filter:"blur(8px)"
              }}
            />
            <div
              className="relative flex flex-col items-center gap-2 px-4 text-center"

            >
              <VscSnake className="size-6"/>
              <p className="text-sm font-medium font-serif">Game over</p>
              <Button
                type="button"
                onClick={restart}
size={"sm"}
              >
                Play again <PlayCircleIcon className="size-4"/>
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
