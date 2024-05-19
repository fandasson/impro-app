"use client";

import { setQuestionState } from "@/api/questions.api";
import { QuestionDetail, QuestionState } from "@/api/types.api";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle";

type Props = {
    defaultState: QuestionState;
    question: QuestionDetail;
};

export const QuestionUserStateToggle = ({ question, defaultState }: Props) => {
    const handleStateChange = async (newState: QuestionState) => {
        if (newState === question?.state) {
            return;
        }
        await setQuestionState(question.id, newState);
    };

    return (
        <ToggleGroup
            type="single"
            size={"lg"}
            defaultValue={defaultState}
            value={question?.state}
            variant={"outline"}
            onValueChange={(newValue) => handleStateChange(newValue as QuestionState)}
        >
            <ToggleGroupItem value="draft" title={"Skrytá otázka"}>
                Příprava
            </ToggleGroupItem>
            <ToggleGroupItem value="active" title={"Aktivní otázka"}>
                <strong>VYPLŇOVÁNÍ</strong>
            </ToggleGroupItem>
            <ToggleGroupItem value="locked" title={"Aktivní otázka bez možnosti hlasovat"}>
                Výsledky
            </ToggleGroupItem>
            <ToggleGroupItem value="answered" title={"Zobrazená otázka"}>
                Hotovo
            </ToggleGroupItem>
        </ToggleGroup>
    );
};
