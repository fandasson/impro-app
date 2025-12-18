"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { setPerformanceState } from "@/api/performances.api";
import type { PerformanceState } from "@/api/types.api";

type PerformanceStateToggleProps = {
  performanceId: number;
  currentState: PerformanceState;
};

const stateLabels: Record<PerformanceState, string> = {
  draft: "Draft (Koncept)",
  intro: "Intro (Úvod)",
  life: "Life (Živě)",
  closing: "Closing (Závěr)",
  finished: "Finished (Ukončeno)",
};

export function PerformanceStateToggle({
  performanceId,
  currentState,
}: PerformanceStateToggleProps) {
  const [state, setState] = useState<PerformanceState>(currentState);
  const [isUpdating, setIsUpdating] = useState(false);

  async function handleStateChange(newState: PerformanceState) {
    setIsUpdating(true);
    try {
      await setPerformanceState(performanceId, newState);
      setState(newState);
    } catch (error) {
      console.error("Failed to update state:", error);
      // Revert on error
      setState(currentState);
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600">Stav:</span>
      <Select
        value={state}
        onValueChange={(value) => handleStateChange(value as PerformanceState)}
        disabled={isUpdating}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="draft">{stateLabels.draft}</SelectItem>
          <SelectItem value="intro">{stateLabels.intro}</SelectItem>
          <SelectItem value="life">{stateLabels.life}</SelectItem>
          <SelectItem value="closing">{stateLabels.closing}</SelectItem>
          <SelectItem value="finished">{stateLabels.finished}</SelectItem>
        </SelectContent>
      </Select>
      {isUpdating && <span className="text-sm text-gray-500">Ukládání...</span>}
    </div>
  );
}
