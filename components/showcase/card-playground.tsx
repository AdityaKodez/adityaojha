"use client";

import { RotateCcw, SlidersHorizontal } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import { ComponentDemo } from "@/components/showcase/component-demo";
import { PropsPanel } from "@/components/showcase/props-panel";
import {
  getPlayground,
  getPlaygroundDefaults,
  isPlaygroundDefault,
  resolvePlaygroundProps,
} from "@/config/playground";
import type { PlaygroundValues } from "@/config/types";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

/**
 * A catalog card's live preview plus its optional props panel.
 *
 * Collapsed by default: the catalog renders every enabled component at once, so
 * an always-open control set would turn the grid into a wall of sliders. The
 * toggle only appears for components that have a control schema.
 */
export function CardPlayground({ componentId }: { componentId: string }) {
  const schema = getPlayground(componentId);
  const [values, setValues] = useState<PlaygroundValues>(
    () => (schema ? getPlaygroundDefaults(schema) : {}),
  );
  const [open, setOpen] = useState(false);

  const resolved = useMemo(
    () => (schema ? resolvePlaygroundProps(schema, values) : {}),
    [schema, values],
  );

  const handleChange = useCallback(
    (key: string, value: string | number | boolean) => {
      setValues((current) => ({ ...current, [key]: value }));
    },
    [],
  );

  const handleReset = useCallback(() => {
    if (schema) setValues(getPlaygroundDefaults(schema));
  }, [schema]);

  const isDefault = schema ? isPlaygroundDefault(schema, values) : true;

  return (
    <div className="relative z-10 flex w-full min-w-0 flex-col items-center">
      <div className="flex w-full min-w-0 justify-center">
        <ComponentDemo id={componentId} props={resolved} />
      </div>

      {schema ? (
        <div className="flex w-full flex-col gap-3">
          <div className="flex items-center justify-end gap-1">
            {!isDefault ? (
              <button
                type="button"
                onClick={handleReset}
                aria-label="Reset props"
                className="flex items-center gap-1.5 rounded-sm px-2 py-1 font-mono text-[10px] tracking-wider text-muted-foreground micro-transition hover:bg-muted/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <RotateCcw className="size-3" />
                Reset
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => {
                setOpen((current) => !current);
                trackEvent("playground_props_toggled", {
                  component_id: componentId,
                  location: "catalog_card",
                  expanded: !open,
                });
              }}
              aria-expanded={open}
              className={cn(
                "flex items-center gap-1.5 rounded-sm px-2 py-1 font-mono text-[10px] tracking-wider text-muted-foreground micro-transition hover:bg-muted/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                open && "bg-muted/40 text-foreground",
              )}
            >
              <SlidersHorizontal className="size-3" />
              {open ? "Hide props" : "Props"}
            </button>
          </div>

          {open ? (
            <PropsPanel
              componentId={componentId}
              schema={schema}
              values={values}
              isDefault={isDefault}
              onChange={handleChange}
              onReset={handleReset}
              variant="compact"
            />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
