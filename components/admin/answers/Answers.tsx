"use client";

import React, { useEffect, useState } from "react";

import { setQuestionVisibility } from "@/api/questions.api";
import { QuestionWithPlayers } from "@/api/types.api";
import { Loading } from "@/components/admin/Loading";
import { PlayerPickAnswers } from "@/components/admin/answers/PlayerPickAnswers";
import { TextAnswers } from "@/components/admin/answers/TextAnswers";
import { Switch } from "@/components/ui/Switch";
import { useAnswers } from "@/hooks/admin.hooks";
import { useAdminStore } from "@/store/admin.store";

type Props = {
    question: QuestionWithPlayers;
};

export const Answers = ({ question }: Props) => {
    const [displayAnswers, setDisplayAnswers] = useState(false);
    const loading = useAdminStore((state) => state.loading);
    const answers = useAnswers(question.id);
    let component: React.JSX.Element | null = null;

    useEffect(() => {
        setDisplayAnswers(question.present_answers || false);
    }, [question]);

    const handleVisibilityChange = async (visibility: boolean) => {
        await setQuestionVisibility(question.id, visibility);
        setDisplayAnswers(visibility);
    };

    switch (question.type) {
        case "text":
            component = <TextAnswers answers={answers} />;
            break;
        case "player-pick":
            component = <PlayerPickAnswers players={question.players} answers={answers} />;
            break;
    }

    const length = answers?.length ?? 0;

    if (loading && length === 0) {
        return <Loading />;
    }

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
            <h3 className={"mb-4 font-medium not-italic text-gray-400"}>
                {length} {length === 1 ? "Odpověď" : length < 5 ? "Odpovědi" : "Odpovědí"}
            </h3>
            {component}
        </>
    );
};
