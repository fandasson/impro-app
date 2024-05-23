"use client";

import { Eye, EyeOff } from "lucide-react";

import { setPoolAudienceVisibility } from "@/api/question-pools.api";
import { AudienceVisibility, QuestionPool } from "@/api/types.api";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle";

type Props = {
    pool: QuestionPool;
};

export const PoolAudienceStateToggle = ({ pool }: Props) => {
    const handleVisibilityChange = async (_visibility: string) => {
        const visibility = _visibility === "true";
        await setPoolAudienceVisibility(pool.id, visibility, pool.performance_id);
    };

    return (
        <ToggleGroup
            type="single"
            size={"lg"}
            defaultValue={String(pool?.audience_visibility)}
            value={String(pool?.audience_visibility)}
            variant={"outline"}
            onValueChange={(newValue) => handleVisibilityChange(newValue as AudienceVisibility)}
        >
            <ToggleGroupItem value="false" title={"Nic nezobrazovat"} className={"flex gap-1"}>
                <EyeOff />
                Nezobrazuje se
            </ToggleGroupItem>
            <ToggleGroupItem value="true" title={"Výsledky"} className={"flex gap-1 font-bold"}>
                <Eye /> UKÁZAT DIVÁKŮM
            </ToggleGroupItem>
        </ToggleGroup>
    );
};
