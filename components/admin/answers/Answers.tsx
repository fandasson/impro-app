"use client";

import React, { useEffect, useState } from "react";

import { fetchAnswers } from "@/api/answers.api";
import { setQuestionVisibility } from "@/api/questions.api";
import { Question } from "@/api/types.api";
import { PlayerPickAnswers } from "@/components/admin/answers/PlayerPickAnswers";
import { TextAnswers } from "@/components/admin/answers/TextAnswers";
import { Switch } from "@/components/ui/Switch";
import { Tables } from "@/utils/supabase/entity.types";

type Props = {
    question: Question;
};

export const Answers = ({ question }: Props) => {
    const [displayAnswers, setDisplayAnswers] = useState(false);
    const [answers, setAnswers] = useState<Tables<"answers">[] | null>(null);
    let component: React.JSX.Element | null = null;

    useEffect(() => {
        setDisplayAnswers(question.present_answers || false);
        fetchAnswers(question.id).then((response) => setAnswers(response.data));
    }, [question]);

    const handleVisibilityChange = async (visibility: boolean) => {
        await setQuestionVisibility(question.id, visibility);
        setDisplayAnswers(visibility);
    };

    switch (question.type) {
        case "text":
            component = <TextAnswers questionId={question.id} answers={answers ?? []} />;
            break;
        case "player-pick":
            component = <PlayerPickAnswers question={question} answers={answers ?? []} />;
            break;
    }

    const length = answers?.length ?? 0;
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
