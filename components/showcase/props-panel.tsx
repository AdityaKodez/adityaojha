"use client";

import { Check, Copy, RotateCcw } from "lucide-react";
import { Slider as SliderPrimitive, Switch as SwitchPrimitive } from "radix-ui";
import { useMemo, type ReactNode } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  buildPlaygroundSnippet,
  playgroundPalettes,
} from "@/config/playground";
import type {
  PlaygroundControl,
  PlaygroundSchema,
  PlaygroundValues,
} from "@/config/types";
import { trackEvent } from "@/lib/analytics";
import { useCopy } from "@/lib/use-copy";
import { cn } from "@/lib/utils";

/** Shared row: fixed label column, control, readout. */
function ControlRow({
  label,
  compact,
  children,
}: {
  label: string;
  compact?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={cn("flex items-center", compact ? "gap-2.5" : "gap-3")}>
      <span
        className={cn(
          "shrink-0 text-muted-foreground",
          compact ? "w-16 text-[11px]" : "w-24 text-xs",
        )}
      >
        {label}
      </span>
      {children}
    </div>
  );
}

function PaletteControl({
  control,
  value,
  compact,
  onChange,
}: {
  control: Extract<PlaygroundControl, { kind: "palette" }>;
  value: string;
  compact?: boolean;
  onChange: (next: string) => void;
}) {
  return (
    <div className={cn("flex flex-col", compact ? "gap-2" : "gap-2.5")}>
      <span
        className={cn(
          "font-medium text-foreground",
          compact ? "text-[11px]" : "text-xs",
        )}
      >
        {control.label ?? "Palette"}
      </span>
      <div
        className={cn("flex flex-wrap items-center", compact ? "gap-1.5" : "gap-2")}
        role="group"
      >
        {playgroundPalettes.map((palette) => {
          const isActive = palette.id === value;
          return (
            <Tooltip key={palette.id}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => onChange(palette.id)}
                  aria-pressed={isActive}
                  aria-label={palette.label}
                  className={cn(
                    "overflow-hidden border p-0.5 micro-transition focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                    compact ? "h-7 w-11 rounded-md" : "h-9 w-14 rounded-lg",
                    isActive
                      ? "border-foreground"
                      : "border-border hover:border-foreground/30",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-full w-full overflow-hidden",
                      compact ? "rounded-[4px]" : "rounded-[5px]",
                    )}
                  >
                    {palette.colors.map((color) => (
                      <span
                        key={color}
                        className="h-full flex-1"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </span>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{palette.label}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
}

function SliderControl({
  control,
  value,
  compact,
  onChange,
  onCommit,
}: {
  control: Extract<PlaygroundControl, { kind: "slider" }>;
  value: number;
  compact?: boolean;
  onChange: (next: number) => void;
  onCommit: () => void;
}) {
  const readout = control.format ? control.format(value) : value.toFixed(2);

  return (
    <ControlRow label={control.label} compact={compact}>
      <SliderPrimitive.Root
        value={[value]}
        min={control.min}
        max={control.max}
        step={control.step}
        onValueChange={([next]) => onChange(next)}
        onValueCommit={onCommit}
        className="relative flex h-5 grow touch-none items-center select-none"
      >
        <SliderPrimitive.Track className="relative h-1 w-full grow rounded-full bg-muted">
          <SliderPrimitive.Range className="absolute h-full rounded-full bg-foreground/50" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb
          aria-label={control.label}
          className="block size-3 rounded-full border border-foreground/30 bg-background shadow-sm micro-transition hover:scale-110 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
      </SliderPrimitive.Root>
      <span
        className={cn(
          "shrink-0 text-right font-mono tabular-nums text-foreground",
          compact ? "w-10 text-[10px]" : "w-12 text-[11px]",
        )}
      >
        {readout}
      </span>
    </ControlRow>
  );
}

function ToggleControl({
  control,
  value,
  compact,
  onChange,
}: {
  control: Extract<PlaygroundControl, { kind: "toggle" }>;
  value: boolean;
  compact?: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex min-w-0 flex-col">
        <span
          className={cn(
            "font-medium text-foreground",
            compact ? "text-[11px]" : "text-xs",
          )}
        >
          {control.label}
        </span>
        {control.description ? (
          <span
            className={cn(
              "text-muted-foreground",
              compact ? "text-[10px]" : "text-xs",
            )}
          >
            {control.description}
          </span>
        ) : null}
      </div>
      <SwitchPrimitive.Root
        checked={value}
        onCheckedChange={onChange}
        aria-label={control.label}
        className="relative h-4 w-7 shrink-0 rounded-full border border-border bg-muted micro-transition data-[state=checked]:border-foreground/40 data-[state=checked]:bg-foreground/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      >
        <SwitchPrimitive.Thumb className="block size-3 translate-x-px rounded-full bg-background shadow-sm micro-transition data-[state=checked]:translate-x-3" />
      </SwitchPrimitive.Root>
    </div>
  );
}

function SegmentedControl({
  control,
  value,
  compact,
  onChange,
}: {
  control: Extract<PlaygroundControl, { kind: "segmented" }>;
  value: string;
  compact?: boolean;
  onChange: (next: string) => void;
}) {
  return (
    <ControlRow label={control.label} compact={compact}>
      <div
        role="group"
        aria-label={control.label}
        className="inline-flex rounded-md border bg-muted/40 p-0.5"
      >
        {control.options.map((option) => {
          const isActive = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              aria-pressed={isActive}
              className={cn(
                "rounded-[5px] micro-transition focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                compact ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs",
                isActive
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </ControlRow>
  );
}

export type PropsPanelProps = {
  componentId: string;
  schema: PlaygroundSchema;
  values: PlaygroundValues;
  /** True while every control still sits on its default. */
  isDefault: boolean;
  onChange: (key: string, value: string | number | boolean) => void;
  onReset: () => void;
  /**
   * `full` is the detail page's framed panel with its own header. `compact`
   * drops the frame and header for the catalog cards, where the card body
   * already supplies the border and the caller supplies the toggle.
   */
  variant?: "full" | "compact";
};

/**
 * Live props panel for a component preview. Values only ever reach the
 * preview; the props table in the docs is static and stays as written.
 */
export function PropsPanel({
  componentId,
  schema,
  values,
  isDefault,
  onChange,
  onReset,
  variant = "full",
}: PropsPanelProps) {
  const { status, copy } = useCopy();
  const compact = variant === "compact";
  const snippet = useMemo(
    () => buildPlaygroundSnippet(schema, values),
    [schema, values],
  );

  const handleCopy = () => {
    void copy(snippet);
    trackEvent("playground_props_copied", { component_id: componentId });
  };

  const handleReset = () => {
    onReset();
    trackEvent("playground_props_reset", { component_id: componentId });
  };

  const setValue = (
    control: PlaygroundControl,
    next: string | number | boolean,
  ) => {
    onChange(control.key, next);
  };

  const commit = (control: PlaygroundControl) => {
    trackEvent("playground_prop_changed", {
      component_id: componentId,
      prop: control.key,
      control: control.kind,
    });
  };

  const controls = (
    <div className={cn("flex flex-col", compact ? "gap-3.5" : "gap-5")}>
      {schema.controls.map((control) => {
        if (control.kind === "palette") {
          return (
            <PaletteControl
              key={control.key}
              control={control}
              value={String(values[control.key])}
              compact={compact}
              onChange={(next) => {
                setValue(control, next);
                commit(control);
              }}
            />
          );
        }

        if (control.kind === "slider") {
          return (
            <SliderControl
              key={control.key}
              control={control}
              value={Number(values[control.key])}
              compact={compact}
              onChange={(next) => setValue(control, next)}
              onCommit={() => commit(control)}
            />
          );
        }

        if (control.kind === "toggle") {
          return (
            <ToggleControl
              key={control.key}
              control={control}
              value={Boolean(values[control.key])}
              compact={compact}
              onChange={(next) => {
                setValue(control, next);
                commit(control);
              }}
            />
          );
        }

        return (
          <SegmentedControl
            key={control.key}
            control={control}
            value={String(values[control.key])}
            compact={compact}
            onChange={(next) => {
              setValue(control, next);
              commit(control);
            }}
          />
        );
      })}
    </div>
  );

  if (compact) {
    // Same treatment as the full panel, scaled down: a tint instead of a
    // border, since the card body already supplies its own edges.
    return (
      <section
        aria-label="Props"
        className="w-full min-w-0 rounded-md bg-muted/20 p-3"
      >
        {controls}
      </section>
    );
  }

  return (
    <section
      aria-label="Props"
      className="mx-3 my-4 rounded-2xl bg-muted/20 p-4 sm:mx-6 sm:p-5"
    >
      {/* One container, one level. The tint is the whole separation: no
          border, and no second box nested inside to hold the controls. The
          column cap keeps the sliders from running the full page width. */}
      <div className="flex max-w-2xl flex-col gap-5">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-base font-medium tracking-tight">Props</h2>
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={handleCopy}
                  aria-label="Copy props"
                  className="flex items-center gap-1.5 rounded-sm px-2 py-1 text-xs text-muted-foreground micro-transition hover:bg-muted/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  {status === "copied" ? (
                    <Check className="size-3.5 text-green-500" />
                  ) : (
                    <Copy className="size-3.5" />
                  )}
                  Copy
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{status === "copied" ? "Copied!" : "Copy props"}</p>
              </TooltipContent>
            </Tooltip>

            <button
              type="button"
              onClick={handleReset}
              disabled={isDefault}
              aria-label="Reset props"
              className="flex items-center gap-1.5 rounded-sm px-2 py-1 text-xs text-muted-foreground micro-transition hover:bg-muted/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40"
            >
              <RotateCcw className="size-3.5" />
              Reset
            </button>
          </div>
        </div>

        {controls}
      </div>
    </section>
  );
}
