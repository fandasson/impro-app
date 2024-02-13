"use client";

import { Eye, EyeOff, UserCheck } from "lucide-react";
import { useEffect, useState } from "react";

import { fetchQuestion, setQuestionState } from "@/api/questions.api";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle";
import { Enums, Tables } from "@/utils/supabase/entity.types";

type Props = {
    defaultState?: Enums<"question-state">;
    questionId: number;
};

type State = Enums<"question-state">;
export const QuestionStateToggle = ({ questionId, defaultState }: Props) => {
    const [question, setQuestion] = useState<Tables<"questions"> | null>(null);

    useEffect(() => {
        fetchQuestion(questionId).then((response) => setQuestion(response.data));
    }, [questionId]);

    const toggleState = (newState: State) => {
        if (newState === question?.state) {
            return;
        }
        setQuestionState(questionId, newState).then((response) => setQuestion(response.data));
    };

    return (
        <ToggleGroup
            type="single"
            size={"lg"}
            defaultValue={defaultState}
            value={question?.state}
            onValueChange={(newValue) => toggleState(newValue as State)}
        >
            <ToggleGroupItem value="draft" title={"Skrytá otázka"}>
                <EyeOff />
            </ToggleGroupItem>
            <ToggleGroupItem value="active" title={"Aktivní otázka"}>
                <Eye className={"stroke-destructive"} />
            </ToggleGroupItem>
            <ToggleGroupItem value="answered" title={"Zobrazená otázka"}>
                <UserCheck />
            </ToggleGroupItem>
        </ToggleGroup>
    );
};
