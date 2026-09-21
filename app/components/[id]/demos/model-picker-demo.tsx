"use client";

import { useState } from "react";
import {
  defaultModelProviders,
  ModelPicker,
  type ModelPickerProps,
} from "../../../../components/ui/model-picker";

/**
 * The panel drives the selected model, the popover side and align, and the
 * close-on-select behavior; the provider list and the selection state stay
 * owned by the demo.
 */
export function ModelPickerDemo({
  defaultValue = "grok-4.6",
  side = "bottom",
  align = "center",
  closeOnSelect = false,
}: Partial<ModelPickerProps> = {}) {
  const [modelId, setModelId] = useState("grok-4.6");

  return (
    <div className="flex min-h-[460px] w-full items-start justify-center pb-12 pt-8">
      <ModelPicker
        providers={defaultModelProviders}
        value={modelId}
        onValueChange={(id) => setModelId(id)}
        defaultValue={defaultValue}
        side={side}
        align={align}
        closeOnSelect={closeOnSelect}
        defaultOpen={true}
      />
    </div>
  );
}

export default ModelPickerDemo;
