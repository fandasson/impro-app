"use client";

import { Archive, Eye, EyeOff, QrCode } from "lucide-react";
import { useEffect, useState } from "react";

import { fetchPerformance, setPerformanceState } from "@/api/performances.api";
import { PerformanceState } from "@/api/types.api";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle";
import { Tables } from "@/utils/supabase/entity.types";

type Props = {
    defaultState?: PerformanceState;
    performanceId: number;
};
export const PerformanceStateToggle = ({ performanceId, defaultState }: Props) => {
    const [performance, setPerformance] = useState<Tables<"performances"> | null>(null);

    useEffect(() => {
        fetchPerformance(performanceId).then((response) => setPerformance(response.data));
    }, [performanceId]);

    const toggleState = (newState: PerformanceState) => {
        if (newState === performance?.state) {
            return;
        }
        setPerformanceState(performanceId, newState).then((response) => setPerformance(response.data));
    };

    return (
        <ToggleGroup
            type="single"
            size={"lg"}
            defaultValue={defaultState}
            value={performance?.state}
            onValueChange={(newValue) => toggleState(newValue as PerformanceState)}
        >
            <ToggleGroupItem value="draft">
                <EyeOff />
            </ToggleGroupItem>
            <ToggleGroupItem value="intro">
                <QrCode />
            </ToggleGroupItem>
            <ToggleGroupItem value="life">
                <Eye />
            </ToggleGroupItem>
            <ToggleGroupItem value="finished">
                <Archive />
            </ToggleGroupItem>
        </ToggleGroup>
    );
};
