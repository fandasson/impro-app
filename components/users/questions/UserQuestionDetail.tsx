"use client";
import React, { useEffect, useState } from "react";

import { fetchMyMatchAnswers, fetchMyOptionsAnswer, fetchMyTextAnswer } from "@/api/submit-answer";
import type { MatchAnswer, Question } from "@/api/types.api";
import { AlreadyAnswered } from "@/components/users/AlreadyAnswered";
import { PlayersVotingAnswers } from "@/components/users/answers/PlayersVotingAnswers";
import { InfoQuestion } from "@/components/users/questions/InfoQuestion";
import { MatchQuestion } from "@/components/users/questions/MatchQuestion";
import { OptionsQuestion } from "@/components/users/questions/OptionsQuestion";
import { PlayersVotingQuestion } from "@/components/users/questions/PlayersVotingQuestion";
import { TextQuestion } from "@/components/users/questions/TextQuestion";
import { useChainNavigation, useQuestion } from "@/hooks/users.hooks";
import { setLoading, useUsersStore } from "@/store/users.store";

type Props = {
    question: Question | null;
};

const ModificationNotice = () => (
    <div className="mx-6 mb-4 rounded-[10px] bg-secondary px-4 py-2.5 text-sm text-muted-foreground">
        Už jste odpověděli — můžete svou odpověď upravit.
    </div>
);

export const UserQuestionDetail = ({ question: initialQuestion }: Props) => {
    const question = useQuestion(initialQuestion?.id ?? null, initialQuestion);
    const alreadyAnswered = useUsersStore((state) => (question ? state.answeredQuestions[question.id] : false));
    const isLoading = useUsersStore((state) => state.loading);
    const { navigateNext, skipQuestion, isChained } = useChainNavigation(question);

    useEffect(() => {
        setLoading(false);
    }, [question?.id]);

    const [prefillData, setPrefillData] = useState<{
        textAnswer?: string;
        matchAnswers?: MatchAnswer[];
        optionId?: number;
    } | null>(null);

    const needsPrefill = !!question && isChained && !!alreadyAnswered && !isLoading;

    useEffect(() => {
        if (!needsPrefill || !question) return;

        let cancelled = false;
        const loadPrevious = async () => {
            const result: typeof prefillData = {};
            switch (question.type) {
                case "text": {
                    const answer = await fetchMyTextAnswer(question.id);
                    result.textAnswer = answer?.value ?? undefined;
                    break;
                }
                case "match": {
                    result.matchAnswers = await fetchMyMatchAnswers(question.id);
                    break;
                }
                case "options": {
                    const answer = await fetchMyOptionsAnswer(question.id);
                    result.optionId = answer?.question_options_id ?? undefined;
                    break;
                }
            }
            if (!cancelled) setPrefillData(result);
        };
        loadPrevious();
        return () => {
            cancelled = true;
        };
    }, [needsPrefill, question]);

    if (!question) {
        return null;
    }

    if (alreadyAnswered && !question.multiple && !isChained && !isLoading) {
        return <AlreadyAnswered />;
    }

    if (needsPrefill && prefillData === null && !isLoading) {
        return null;
    }

    const showModificationNotice = isChained && alreadyAnswered;

    // Voting and player-pick screens manage their own header layout
    const isFullBleed = question.type === "voting" || question.type === "player-pick";

    let component: React.JSX.Element | null = null;
    switch (question.type) {
        case "info":
            component = (
                <InfoQuestion
                    questionId={question.id}
                    questionText={question.question}
                    navigateNext={navigateNext}
                />
            );
            break;
        case "text":
            component = (
                <TextQuestion
                    questionId={question.id}
                    questionText={question.question}
                    navigateNext={navigateNext}
                    skipQuestion={skipQuestion}
                    isOptional={question.optional}
                    isChained={isChained}
                    previousAnswer={prefillData?.textAnswer}
                />
            );
            break;
        case "voting":
        case "player-pick":
            if (question.state === "active") {
                component = (
                    <PlayersVotingQuestion
                        question={question}
                        navigateNext={navigateNext}
                        skipQuestion={skipQuestion}
                        isOptional={question.optional}
                        isChained={isChained}
                    />
                );
            } else if (question.state === "locked") {
                component = <PlayersVotingAnswers questionId={question.id} hideResults={false} />;
            }
            break;
        case "match":
            component = (
                <MatchQuestion
                    question={question}
                    navigateNext={navigateNext}
                    skipQuestion={skipQuestion}
                    isOptional={question.optional}
                    isChained={isChained}
                    previousMatches={prefillData?.matchAnswers}
                />
            );
            break;
        case "options":
            component = (
                <OptionsQuestion
                    navigateNext={navigateNext}
                    skipQuestion={skipQuestion}
                    isOptional={question.optional}
                    isChained={isChained}
                    previousOptionId={prefillData?.optionId}
                />
            );
    }

    if (isFullBleed) {
        return (
            <div className="flex min-h-svh flex-col pb-10">
                {showModificationNotice && <ModificationNotice />}
                {component}
            </div>
        );
    }

    return (
        <div className="flex min-h-svh flex-col pb-10">
            {showModificationNotice && <ModificationNotice />}
            <div className="sticky top-0 z-10 bg-gradient-to-b from-background via-background/95 to-transparent px-6 pb-4 pt-6">
                <h2 className="text-[22px] font-bold leading-snug">{question.name}</h2>
            </div>
            <div className="flex flex-col gap-4 px-6 pt-2">{component}</div>
        </div>
    );
};
