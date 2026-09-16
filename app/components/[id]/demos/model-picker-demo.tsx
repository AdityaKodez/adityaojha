"use client";

import { useState } from "react";
import {
  defaultModelProviders,
  ModelPicker,
} from "../../../../components/ui/model-picker";

export function ModelPickerDemo() {
  const [modelId, setModelId] = useState("grok-4.6");

  return (
    <div className="flex min-h-[460px] w-full items-start justify-center pb-12 pt-8">
      <ModelPicker
        providers={defaultModelProviders}
        value={modelId}
        onValueChange={(id) => setModelId(id)}
        side="bottom"
        align="center"
        defaultOpen={true}
      />
    </div>
  );
}

export default ModelPickerDemo;
