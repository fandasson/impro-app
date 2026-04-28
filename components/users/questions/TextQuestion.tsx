"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";

import { submitTextAnswer } from "@/api/submit-answer";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { markQuestionAsAnswered, setLoading, useUsersStore } from "@/store/users.store";

type Props = {
    questionId: number;
    questionText: string;
    navigateNext?: () => void;
    skipQuestion?: () => void;
    isOptional?: boolean;
    isChained?: boolean;
    previousAnswer?: string;
};

type Inputs = {
    answer: string;
};

const MIN_LENGTH = 3;

export const TextQuestion = (props: Props) => {
    const isLoading = useUsersStore((state) => state.loading);
    const { register, handleSubmit, reset, control } = useForm<Inputs>({
        defaultValues: {
            answer: props.previousAnswer ?? "",
        },
    });
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        setLoading(true);
        await submitTextAnswer({
            question_id: props.questionId,
            value: data.answer,
        });
        markQuestionAsAnswered(props.questionId);
        startTransition(() => {
            if (props.navigateNext) {
                props.navigateNext();
            } else {
                router.push(`/`);
            }
            reset();
        });
    };

    const answerValue = useWatch({ control, name: "answer" });
    const inputLength = answerValue?.length || 0;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            {props.questionText && (
                <p className="text-base leading-relaxed text-muted-foreground">{props.questionText}</p>
            )}
            <Textarea
                autoFocus={true}
                placeholder="Nebojte se psát, co vás napadne... je to anonymní ;-)"
                rows={5}
                id="answer"
                className="resize-none bg-card"
                {...register("answer", { required: true, minLength: MIN_LENGTH })}
            />
            <Button type="submit" className="w-full" disabled={isLoading || isPending || inputLength < MIN_LENGTH}>
                Odeslat
            </Button>
            {props.isOptional && props.isChained && (
                <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={props.skipQuestion}
                    disabled={isLoading || isPending}
                >
                    Možná později
                </Button>
            )}
        </form>
    );
};
