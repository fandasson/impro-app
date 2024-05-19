"use client";

import React from "react";

import { MobileContainer } from "@/components/ui/layout/MobileContainer";
import { AlreadyAnswered } from "@/components/users/AlreadyAnswered";
import { NoQuestion } from "@/components/users/NoQuestion";
import { PlayersVotingAnswers } from "@/components/users/answers/PlayersVotingAnswers";
import { MatchQuestion } from "@/components/users/questions/MatchQuestion";
import { PlayersVotingQuestion } from "@/components/users/questions/PlayersVotingQuestion";
import { TextQuestion } from "@/components/users/questions/TextQuestion";
import { useActiveOrLockedQuestion } from "@/hooks/users.hooks";
import { useUsersStore } from "@/store/users.store";

type Props = {
    performanceId: number;
};
export const UserQuestionDetail = ({ performanceId }: Props) => {
    let component: React.JSX.Element | null = null;
    const loading = useUsersStore((state) => state.loading);
    const question = useActiveOrLockedQuestion(performanceId);
    const alreadyAnswered = useUsersStore((state) => (question ? state.answeredQuestions[question.id] : false));

    // if (loading) {
    //     return <Loading />;
    // }

    if (!question) {
        return <NoQuestion />;
    }

    if (alreadyAnswered && !question.multiple) {
        return <AlreadyAnswered />;
    }

    switch (question.type) {
        case "text":
            component = <TextQuestion questionId={question.id} />;
            break;
        case "voting":
        case "player-pick":
            if (question.state === "active") {
                component = <PlayersVotingQuestion question={question} />;
            } else if (question.state === "locked") {
                component = <PlayersVotingAnswers questionId={question.id} />;
            }
            break;
        case "match":
            component = <MatchQuestion question={question} />;
            break;
    }

    return (
        <MobileContainer className={""}>
            <div className={"grid grid-flow-col gap-4"}>
                <h2 className={"text-lg font-medium"}>{question.question}</h2>
            </div>
            {component}
        </MobileContainer>
    );
};
