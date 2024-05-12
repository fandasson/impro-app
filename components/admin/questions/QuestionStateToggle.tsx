"use client";

import { Eye, EyeOff, Pencil, UserCheck } from "lucide-react";
import { useEffect, useState } from "react";

import { fetchQuestion, setQuestionState } from "@/api/questions.api";
import { Question, QuestionState } from "@/api/types.api";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle";

type Props = {
    defaultState?: QuestionState;
    questionId: number;
};

export const QuestionStateToggle = ({ questionId, defaultState }: Props) => {
    const [question, setQuestion] = useState<Question | null>(null);

    useEffect(() => {
        fetchQuestion(questionId).then((response) => setQuestion(response.data));
    }, [questionId]);

    const toggleState = (newState: QuestionState) => {
        if (newState === question?.state) {
            return;
        }
        setQuestionState(questionId, newState).then((response) => setQuestion(response.data));
    };

    return (
        <ToggleGroup
            type="single"
            size={"lg"}
            className={"justify-end"}
            defaultValue={defaultState}
            value={question?.state}
            onValueChange={(newValue) => toggleState(newValue as QuestionState)}
        >
            <ToggleGroupItem value="draft" title={"Skrytá otázka"}>
                <EyeOff />
            </ToggleGroupItem>
            <ToggleGroupItem value="active" title={"Aktivní otázka"}>
                <Pencil className={"stroke-destructive"} />
            </ToggleGroupItem>
            <ToggleGroupItem value="locked" title={"Aktivní otázka bez možnosti hlasovat"}>
                <Eye className={"stroke-destructive"} />
            </ToggleGroupItem>
            <ToggleGroupItem value="answered" title={"Zobrazená otázka"}>
                <UserCheck />
            </ToggleGroupItem>
        </ToggleGroup>
    );
};
