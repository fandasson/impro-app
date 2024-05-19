"use client";

import { setAudienceVisibility } from "@/api/questions.api";
import { AudienceVisibility, QuestionDetail } from "@/api/types.api";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle";

type Props = {
    defaultState?: AudienceVisibility;
    question: QuestionDetail;
};

export const QuestionAdminStateToggle = ({ question, defaultState }: Props) => {
    const handleVisibilityChange = async (visibility: AudienceVisibility) => {
        await setAudienceVisibility(question.id, visibility);
    };

    return (
        <ToggleGroup
            type="single"
            size={"lg"}
            defaultValue={defaultState}
            value={question?.audience_visibility}
            variant={"outline"}
            onValueChange={(newValue) => handleVisibilityChange(newValue as AudienceVisibility)}
        >
            <ToggleGroupItem value="hidden" title={"Nic nezobrazovat"}>
                Nic
            </ToggleGroupItem>
            <ToggleGroupItem value="question" title={"Zadání otázky"}>
                Otázka
            </ToggleGroupItem>
            <ToggleGroupItem value="results" title={"Výsledky"}>
                <strong>VÝSLEDKY</strong>
            </ToggleGroupItem>
        </ToggleGroup>
    );
};
