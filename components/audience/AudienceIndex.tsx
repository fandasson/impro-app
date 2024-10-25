"use client";

import { AudiencePoolResults } from "@/components/audience/AudiencePoolResults";
import { AudienceQuestionDetail } from "@/components/audience/AudienceQuestionDetail";
import { Intro } from "@/components/audience/Intro";
import { usePool } from "@/hooks/audience.hooks";
import { usePerformance } from "@/hooks/users.hooks";
import { Tables } from "@/utils/supabase/entity.types";

type Props = {
    defaultPerformance: Tables<"performances">;
};

export const AudienceIndex = ({ defaultPerformance }: Props) => {
    const performance = usePerformance(defaultPerformance);
    const pool = usePool(defaultPerformance.id);

    if (!performance) {
        return null;
    }

    if (performance.state === "intro") {
        return <Intro performance={performance} />;
    }

    if (performance.state === "life") {
        if (pool) {
            return <AudiencePoolResults pool={pool} />;
        } else {
            return <AudienceQuestionDetail performanceId={defaultPerformance.id} />;
        }
    }
};
