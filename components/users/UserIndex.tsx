"use client";

import { Intro } from "@/components/users/Intro";
import { UserQuestionDetail } from "@/components/users/questions/UserQuestionDetail";
import { useActiveOrLockedQuestion, usePerformance } from "@/hooks/users.hooks";
import { Tables } from "@/utils/supabase/entity.types";

type Props = {
    defaultPerformance: Tables<"performances">;
};

export const UserIndex = ({ defaultPerformance }: Props) => {
    const question = useActiveOrLockedQuestion(defaultPerformance.id);
    const performance = usePerformance(defaultPerformance);

    if (performance.state === "intro") {
        return <Intro performance={performance} />;
    }

    if (performance.state === "life") {
        // if (!question) {
        //     return <NoQuestion />;
        // }

        return <UserQuestionDetail />;
    }
};
