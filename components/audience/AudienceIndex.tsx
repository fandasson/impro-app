"use client";

import { Performance, Question, QuestionPool } from "@/api/types.api";
import { WebPerformance } from "@/api/web.api";
import { AudiencePoolResults } from "@/components/audience/AudiencePoolResults";
import { AudienceQuestionDetail } from "@/components/audience/AudienceQuestionDetail";
import { Intro } from "@/components/audience/Intro";
import { UpcomingPerformance } from "@/components/audience/UpcomingPerformance";
import { usePool } from "@/hooks/audience.hooks";
import { usePerformance } from "@/hooks/users.hooks";

type Props = {
    defaultPerformance: Performance;
    initialQuestion: Question | null;
    initialPool: QuestionPool | null;
    upcomingPerformances: WebPerformance[];
};

export const AudienceIndex = ({ defaultPerformance, initialQuestion, initialPool, upcomingPerformances }: Props) => {
    const performance = usePerformance(defaultPerformance);
    const pool = usePool(defaultPerformance.id, initialPool);

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
            return <AudienceQuestionDetail performanceId={defaultPerformance.id} initialQuestion={initialQuestion} />;
        }
    }

    if (performance.state === "closing") {
        return <UpcomingPerformance upcomingPerformances={upcomingPerformances} />;
    }
};
