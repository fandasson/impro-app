"use client";

import React from "react";

import { MobileContainer } from "@/components/ui/layout/MobileContainer";
import { AlreadyAnswered } from "@/components/users/AlreadyAnswered";
import { NoQuestion } from "@/components/users/NoQuestion";
import { PlayerPickAnswers } from "@/components/users/answers/PlayerPickAnswers";
import { MatchQuestion } from "@/components/users/questions/MatchQuestion";
import { PlayerPickQuestion } from "@/components/users/questions/PlayerPickQuestion";
import { TextQuestion } from "@/components/users/questions/TextQuestion";
import { useUsersStore } from "@/store/users.store";

export const UserQuestionDetail = () => {
    let component: React.JSX.Element | null = null;
    const loading = useUsersStore((state) => state.loading);
    const question = useUsersStore((state) => state.question);
    const alreadyAnswered = useUsersStore((state) => (question ? state.answeredQuestions[question.id] : false));

    // FIXME: was causing issues with infinite loop
    // useEffect(() => {
    //     if (question) {
    //         checkUserAlreadyAnswered(question.id)
    //             .then((response) => {
    //                 if (response) {
    //                     markQuestionAsAnswered(question.id);
    //                 }
    //             })
    //             .finally(() => setLoading(false));
    //     }
    // }, [question]);

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
        case "player-pick":
            if (question.state === "active") {
                component = <PlayerPickQuestion question={question} />;
            } else if (question.state === "locked") {
                component = <PlayerPickAnswers questionId={question.id} />;
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
