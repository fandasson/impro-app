"use client";
import React from "react";

import { Question } from "@/api/types.api";
import { MobileContainer } from "@/components/ui/layout/MobileContainer";
import { AlreadyAnswered } from "@/components/users/AlreadyAnswered";
import { PlayersVotingAnswers } from "@/components/users/answers/PlayersVotingAnswers";
import { MatchQuestion } from "@/components/users/questions/MatchQuestion";
import { PlayersVotingQuestion } from "@/components/users/questions/PlayersVotingQuestion";
import { TextQuestion } from "@/components/users/questions/TextQuestion";
import { useUsersStore } from "@/store/users.store";

type Props = {
    question: Question | null;
};
export const UserQuestionDetail = ({ question }: Props) => {
    const alreadyAnswered = useUsersStore((state) => (question ? state.answeredQuestions[question.id] : false));

    if (!question) {
        return null;
    }

    if (alreadyAnswered && !question.multiple) {
        return <AlreadyAnswered />;
    }

    let component: React.JSX.Element | null = null;
    switch (question.type) {
        case "text":
            component = <TextQuestion questionId={question.id} questionText={question.question} />;
            break;
        case "voting":
        case "player-pick":
            if (question.state === "active") {
                component = <PlayersVotingQuestion question={question} />;
            } else if (question.state === "locked") {
                component = <PlayersVotingAnswers questionId={question.id} hideResults={false} />;
            }
            break;
        case "match":
            component = <MatchQuestion question={question} />;
            break;
    }

    return (
        <MobileContainer className={""}>
            {/*<div className={"grid grid-flow-col gap-4"}>*/}
            {/*    <h2 className={"text-lg font-medium"}>{question.question}</h2>*/}
            {/*</div>*/}
            {component}
        </MobileContainer>
    );
};
