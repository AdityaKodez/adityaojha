"use client";

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

import { PreviewBox } from "./preview-box";

export type ComponentPlaygroundProps = {
  componentId: string;
  ariaLabel: string;
  /** Pre-rendered syntax-highlighted HTML for the Code tab. */
  codeHtml: string;
  /** Raw demo source for clipboard copy. */
  rawCode: string;
};

/**
 * Owns the preview state for one component. Components with a control schema
 * get the props panel under the preview; the rest render the preview alone,
 * exactly as before.
 *
 * State lives here rather than inside the panel because both the preview and
 * the panel need it, and the panel must stay a dumb control surface.
 */
export function ComponentPlayground({
  componentId,
  ariaLabel,
  codeHtml,
  rawCode,
}: ComponentPlaygroundProps) {
  const schema = getPlayground(componentId);
  const [values, setValues] = useState<PlaygroundValues>(
    () => (schema ? getPlaygroundDefaults(schema) : {}),
  );

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

  return (
    <>
      <PreviewBox
        ariaLabel={ariaLabel}
        componentId={componentId}
        preview={<ComponentDemo id={componentId} props={resolved} />}
        codeHtml={codeHtml}
        rawCode={rawCode}
      />
      {schema ? (
        <PropsPanel
          componentId={componentId}
          schema={schema}
          values={values}
          isDefault={isPlaygroundDefault(schema, values)}
          onChange={handleChange}
          onReset={handleReset}
        />
      ) : null}
    </>
  );
}
