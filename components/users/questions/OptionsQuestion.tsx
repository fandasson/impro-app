"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { fetchQuestionOptions } from "@/api/questions.api";
import { submitOptionsAnswer } from "@/api/submit-answer";
import type { QuestionOptions } from "@/api/types.api";
import { Button } from "@/components/ui/Button";
import { markQuestionAsAnswered, setLoading, storeAnswer, useUsersStore } from "@/store/users.store";
import { cn } from "@/utils/styling.utils";

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
        setLoading(true);
        await submitOptionsAnswer({
            question_id: question.id,
            question_options_id: optionId,
        })
            .then(() => {
                markQuestionAsAnswered(question.id);
                if (navigateNext) {
                    navigateNext();
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
            {question.question && (
                <p className="text-base leading-relaxed text-muted-foreground">{question.question}</p>
            )}
            <div className="flex flex-col gap-3">
                {options.map((option) => (
                    <div
                        key={option.id}
                        className={cn(
                            "cursor-pointer rounded-[12px] border-2 border-transparent px-4 py-3.5 text-sm font-medium leading-snug transition-all duration-200",
                            selectedOption === option.id
                                ? "border-primary text-foreground [background:var(--amber-dim)]"
                                : "hover:border-border/60 border-border bg-card text-foreground",
                        )}
                        onClick={() =>
                            hasFollowingQuestion ? setSelectedOption(option.id) : handleAutoSubmit(option.id)
                        }
                        dangerouslySetInnerHTML={{ __html: option.option ?? "" }}
                    />
                ))}
            </div>
            {hasFollowingQuestion && (
                <Button onClick={handleSubmit} disabled={loading || !selectedOption} className="w-full">
                    Odeslat
                </Button>
            )}
            {isOptional && isChained && (
                <Button type="button" variant="outline" className="w-full" onClick={skipQuestion} disabled={loading}>
                    Možná později
                </Button>
            )}
        </>
    );
};
