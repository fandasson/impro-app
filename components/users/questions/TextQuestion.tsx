"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { submitTextAnswer } from "@/api/submit-answer";
import { Button } from "@/components/ui/Button";
import { Paragraph } from "@/components/ui/Paragraph";
import { Textarea } from "@/components/ui/Textarea";
import { markQuestionAsAnswered, setLoading, useUsersStore } from "@/store/users.store";

type Props = {
    questionId: number;
    questionText: string;
};

type Inputs = {
    answer: string;
};
const MIN_LENGTH = 3;
export const TextQuestion = (props: Props) => {
    const isLoading = useUsersStore((state) => state.loading);
    const question = useUsersStore((state) => state.question);
    const performance = useUsersStore((state) => state.performance);
    const { register, handleSubmit, reset, watch } = useForm<Inputs>();
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
            if (question?.following_question_id) {
                router.push(`/question/${question.following_question_id}`);
            } else {
                router.push(`/`);
            }
            setLoading(false);
            reset();
        });
    };

    const inputLength = watch("answer")?.length || 0;
    return (
        <form onSubmit={handleSubmit(onSubmit)} className={"flex flex-col gap-4"}>
            <Paragraph>{props.questionText}</Paragraph>
            <Textarea
                autoFocus={true}
                placeholder={
                    "Nebojte se psát, co vás napadne... je to anonymní ;-)\nBudeme rádi za zprávy delší než pár písmen"
                }
                rows={5}
                id={"answer"}
                {...register("answer", { required: true, minLength: MIN_LENGTH })}
            />
            <Button type={"submit"} disabled={isLoading || isPending || inputLength < MIN_LENGTH}>
                Odeslat
            </Button>
        </form>
    );
};
