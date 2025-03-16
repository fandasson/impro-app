"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { fetchQuestionOptions } from "@/api/questions.api";
import { submitOptionsAnswer } from "@/api/submit-answer";
import { QuestionOptions } from "@/api/types.api";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Paragraph } from "@/components/ui/Paragraph";
import { markQuestionAsAnswered, setLoading, useUsersStore } from "@/store/users.store";

export const OptionsQuestion = () => {
    const loading = useUsersStore((state) => state.loading);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [options, setOptions] = useState<QuestionOptions[]>([]);
    const question = useUsersStore((state) => state.question);
    const performance = useUsersStore((state) => state.performance);
    const router = useRouter();

    useEffect(() => {
        if (question?.id) {
            fetchQuestionOptions(question.id).then((response) => setOptions(response));
        }
    }, [question]);

    const handleSubmit = async () => {
        if (!selectedOption || !question) return;

        setLoading(true);
        await submitOptionsAnswer({
            question_id: question.id,
            question_options_id: selectedOption,
        })
            .then(() => {
                // it is possible to save several anwers for one user
                markQuestionAsAnswered(question.id);
                if (question?.following_question_id) {
                    router.push(`/question/${question.following_question_id}`);
                } else {
                    router.push(`/`);
                }
            })
            .finally(() => setLoading(false));
    };

    if (!question) {
        return null;
    }

    return (
        <>
            <Paragraph>{question.question}</Paragraph>
            <div className={"flex flex-col gap-4"}>
                {options.map((option) => (
                    <Badge
                        key={option.id}
                        className={"text-md p-4"}
                        onClick={() => setSelectedOption(option.id)}
                        variant={selectedOption === option.id ? "default" : "outline"}
                    >
                        {option.option}
                    </Badge>
                ))}
            </div>
            <Button onClick={handleSubmit} disabled={loading || !selectedOption}>
                Odeslat
            </Button>
        </>
    );
};
