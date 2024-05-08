"use client";

import React, { useEffect, useState } from "react";

import { setQuestionVisibility } from "@/api/questions.api";
import { QuestionWithPlayers } from "@/api/types.api";
import { AnswersHeadline } from "@/components/admin/answers/AnswersHeadline";
import { PlayersVotingAnswers } from "@/components/admin/answers/PlayersVotingAnswers";
import { TextAnswers } from "@/components/admin/answers/TextAnswers";
import { Switch } from "@/components/ui/Switch";

type Props = {
    question: QuestionWithPlayers;
};

export const Answers = ({ question }: Props) => {
    const [displayAnswers, setDisplayAnswers] = useState(false);
    let component: React.JSX.Element | null = null;

    useEffect(() => {
        setDisplayAnswers(question.present_answers || false);
    }, [question]);

    const handleVisibilityChange = async (visibility: boolean) => {
        await setQuestionVisibility(question.id, visibility);
        setDisplayAnswers(visibility);
    };

    const renderComponent = () => {
        switch (question.type) {
            case "text":
                return <TextAnswers questionId={question.id} />;
            case "voting":
            case "player-pick":
                return <PlayersVotingAnswers questionId={question.id} players={question.players} />;
        }
    };
    return (
        <>
            <div className={"flex items-center justify-between"}>
                <h2 className={"text-2xl font-bold"}>Odpovědi</h2>
                <div className={"flex gap-4"}>
                    <span>Výsledky pro diváky:</span>
                    <strong>Skrýt:</strong>
                    <Switch checked={displayAnswers} onCheckedChange={handleVisibilityChange} />
                    <strong>Zobrazit</strong>
                </div>
            </div>
            <AnswersHeadline />
            {renderComponent()}
        </>
    );
};
