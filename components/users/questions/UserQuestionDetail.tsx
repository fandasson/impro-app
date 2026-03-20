"use client";
import React, { useEffect, useState } from "react";

import { fetchMyMatchAnswers, fetchMyOptionsAnswer, fetchMyTextAnswer } from "@/api/submit-answer";
import { MatchAnswer, Question } from "@/api/types.api";
import { MobileContainer } from "@/components/ui/layout/MobileContainer";
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
    <div className="mb-4 rounded-md bg-yellow-100 px-4 py-2 text-sm text-yellow-800">
        Už jste odpověděli — můžete svou odpověď upravit.
    </div>
);

export const UserQuestionDetail = ({ question: initialQuestion }: Props) => {
    const question = useQuestion(initialQuestion?.id ?? null, initialQuestion);
    const alreadyAnswered = useUsersStore((state) => (question ? state.answeredQuestions[question.id] : false));
    const isLoading = useUsersStore((state) => state.loading);
    const { navigateNext, skipQuestion, isChained } = useChainNavigation(question);

    // Reset loading when question changes (after navigation commits)
    useEffect(() => {
        setLoading(false);
    }, [question?.id]);

    const [prefillData, setPrefillData] = useState<{
        textAnswer?: string;
        matchAnswers?: MatchAnswer[];
        optionId?: number;
    } | null>(null);

    // Don't trigger prefill loading while a navigation transition is in progress —
    // server action calls during a pending router.push carry the current page's
    // router state tree and cause Next.js to cancel the transition.
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
        return () => { cancelled = true; };
    }, [needsPrefill, question]);

    if (!question) {
        return null;
    }

    // Non-chained, non-multiple, already answered → show AlreadyAnswered
    // Skip while isLoading: unmounting during a pending router.push transition aborts navigation.
    if (alreadyAnswered && !question.multiple && !isChained && !isLoading) {
        return <AlreadyAnswered />;
    }

    // Wait for prefill data before rendering chained questions.
    // Skip this guard while isLoading (submission in progress) — unmounting the
    // component tree during a pending router.push transition aborts navigation.
    if (needsPrefill && prefillData === null && !isLoading) {
        return null;
    }

    const showModificationNotice = isChained && alreadyAnswered;

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

    return (
        <MobileContainer className={""}>
            {showModificationNotice && <ModificationNotice />}
            {component}
        </MobileContainer>
    );
};
