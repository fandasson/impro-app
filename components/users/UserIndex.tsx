"use client";

import { Performance, Question } from "@/api/types.api";
import { Intro } from "@/components/users/Intro";
import { OnboardingWizard } from "@/components/users/onboarding/OnboardingWizard";
import { UserQuestionDetailPage } from "@/components/users/questions/UserQuestionDetailPage";
import { usePerformance } from "@/hooks/users.hooks";
import { useUsersStore } from "@/store/users.store";

type Props = {
    defaultPerformance: Performance;
    initialQuestion: Question | null;
};

export const UserIndex = ({ defaultPerformance, initialQuestion }: Props) => {
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
};
