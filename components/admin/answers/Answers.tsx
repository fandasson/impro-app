"use client";

import React, { useState } from "react";

import { QuestionDetail } from "@/api/types.api";
import { AnswersHeadline } from "@/components/admin/answers/AnswersHeadline";
import { PlayersVotingAnswers } from "@/components/admin/answers/PlayersVotingAnswers";
import { TextAnswers } from "@/components/admin/answers/TextAnswers";
import { Switch } from "@/components/ui/Switch";

type Props = {
    question: QuestionDetail;
};

export const Answers = ({ question }: Props) => {
    const [showResultsForGroup, setShowResultsForGroup] = useState(true);

    const renderComponent = () => {
        switch (question.type) {
            case "text":
                return <TextAnswers questionId={question.id} />;
            case "voting":
            case "player-pick":
                return (
                    <PlayersVotingAnswers
                        questionId={question.id}
                        players={question.players}
                        poolId={question.pool_id}
                        summary={!!question.pool_id && showResultsForGroup}
                    />
                );
        }
    };
    return (
        <>
            <div className={"flex items-center justify-between"}>
                <h2 className={"text-2xl font-bold"}>Odpovědi</h2>
                <div className={"flex flex-col gap-4"}>
                    {question.pool_id && (
                        <div className={"flex gap-4"}>
                            <span>Zobrazit výsledky za:</span>
                            <strong>Otázku</strong>
                            <Switch checked={showResultsForGroup} onCheckedChange={setShowResultsForGroup} />
                            <strong>
                                Skupinu <em>{question.questions_pool?.name}</em>
                            </strong>
                        </div>
                    )}
                </div>
            </div>
            <AnswersHeadline />
            {renderComponent()}
        </>
    );
};
