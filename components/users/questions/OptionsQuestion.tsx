"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { fetchQuestionOptions } from "@/api/questions.api";
import { submitOptionsAnswer } from "@/api/submit-answer";
import { QuestionOptions } from "@/api/types.api";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Paragraph } from "@/components/ui/Paragraph";
import { markQuestionAsAnswered, setLoading, storeAnswer, useUsersStore } from "@/store/users.store";

type Props = {
    navigateNext?: () => void;
    skipQuestion?: () => void;
    isOptional?: boolean;
    isChained?: boolean;
    previousOptionId?: number;
};

export const OptionsQuestion = ({ navigateNext, skipQuestion, isOptional, isChained, previousOptionId }: Props) => {
    const loading = useUsersStore((state) => state.loading);
    const [selectedOption, setSelectedOption] = useState<number | null>(previousOptionId ?? null);
    const [options, setOptions] = useState<QuestionOptions[]>([]);
    const question = useUsersStore((state) => state.question);
    const router = useRouter();

    const hasFollowingQuestion = !!question?.following_question_id;

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
                markQuestionAsAnswered(question.id);
                if (navigateNext) {
                    navigateNext();
                } else if (question?.following_question_id) {
                    router.push(`/question/${question.following_question_id}`);
                } else {
                    router.push(`/`);
                }
            })
            .finally(() => setLoading(false));
    };

    const handleAutoSubmit = async (optionId: number) => {
        if (!question) return;
        setSelectedOption(optionId);
        storeAnswer(question.id, optionId);
        await submitOptionsAnswer({
            question_id: question.id,
            question_options_id: optionId,
        });
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
                        className={"text-md flex-col items-start p-4"}
                        onClick={() => hasFollowingQuestion ? setSelectedOption(option.id) : handleAutoSubmit(option.id)}
                        variant={selectedOption === option.id ? "default" : "outline"}
                        dangerouslySetInnerHTML={{ __html: option.option ?? "" }}
                    />
                ))}
            </div>
            {hasFollowingQuestion && (
                <Button onClick={handleSubmit} disabled={loading || !selectedOption}>
                    Odeslat
                </Button>
            )}
            {isOptional && isChained && (
                <Button type={"button"} variant={"outline"} onClick={skipQuestion} disabled={loading}>
                    Možná później
                </Button>
            )}
        </>
    );
};
