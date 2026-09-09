"use client";

import { useState } from "react";
import {
  defaultModelProviders,
  ModelPicker,
} from "@/components/ui/model-picker";

export function ModelPickerDemo() {
  const [modelId, setModelId] = useState("grok-4.6");

  return (
    <div className="flex items-center justify-center py-10">
      <ModelPicker
        providers={defaultModelProviders}
        value={modelId}
        onValueChange={(id) => setModelId(id)}
        side="bottom"
        align="center"
      />
    </div>
  );
}
