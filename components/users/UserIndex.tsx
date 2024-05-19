"use client";

import { Intro } from "@/components/users/Intro";
import { UserQuestionDetail } from "@/components/users/questions/UserQuestionDetail";
import { usePerformance } from "@/hooks/users.hooks";
import { Tables } from "@/utils/supabase/entity.types";

type Props = {
    defaultPerformance: Tables<"performances">;
};

export const UserIndex = ({ defaultPerformance }: Props) => {
    const performance = usePerformance(defaultPerformance);

    if (performance.state === "intro") {
        return <Intro performance={performance} />;
    }

    if (performance.state === "life") {
        return <UserQuestionDetail performanceId={performance.id} />;
    }
};
