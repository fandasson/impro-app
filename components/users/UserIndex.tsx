"use client";

import { Performance } from "@/api/types.api";
import { Intro } from "@/components/users/Intro";
import { UserQuestionDetailPage } from "@/components/users/questions/UserQuestionDetailPage";
import { usePerformance } from "@/hooks/users.hooks";

type Props = {
    defaultPerformance: Performance;
};

export const UserIndex = ({ defaultPerformance }: Props) => {
    const performance = usePerformance(defaultPerformance);

    console.log(defaultPerformance);
    if (!performance) {
        return null;
    }

    if (performance.state === "intro") {
        return <Intro performance={performance} />;
    }

    if (performance.state === "life") {
        return <UserQuestionDetailPage performanceId={performance.id} />;
    }
};
