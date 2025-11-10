"use client";

import { Performance, Question } from "@/api/types.api";
import { WebPerformance } from "@/api/web.api";
import { Intro } from "@/components/users/Intro";
import { UpcomingPerformances } from "@/components/users/UpcomingPerformances";
import { OnboardingWizard } from "@/components/users/onboarding/OnboardingWizard";
import { UserQuestionDetailPage } from "@/components/users/questions/UserQuestionDetailPage";
import { usePerformance } from "@/hooks/users.hooks";
import { useUsersStore } from "@/store/users.store";

type Props = {
    defaultPerformance: Performance;
    initialQuestion: Question | null;
    upcomingPerformances: WebPerformance[];
};

export const UserIndex = ({ defaultPerformance, initialQuestion, upcomingPerformances }: Props) => {
    const performance = usePerformance(defaultPerformance);
    const onboardingCompleted = useUsersStore((state) => state.onboarding.completed);

    if (!performance) {
        return null;
    }

    if (performance.state === "intro") {
        return onboardingCompleted ? (
            <Intro performance={performance} />
        ) : (
            <OnboardingWizard performance={performance} />
        );
    }

    if (performance.state === "life") {
        return <UserQuestionDetailPage performanceId={performance.id} initialQuestion={initialQuestion} />;
    }

    if (performance.state === "finished" || performance.state === "closing") {
        return <UpcomingPerformances upcomingPerformances={upcomingPerformances} />;
    }
};
