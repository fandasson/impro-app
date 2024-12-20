"use client";

import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";

import { submitTextAnswer } from "@/api/submit-answer";
import { Button } from "@/components/ui/Button";
import { Paragraph } from "@/components/ui/Paragraph";
import { Textarea } from "@/components/ui/Textarea";
import { setLoading, useUsersStore } from "@/store/users.store";

type Props = {
    questionId: number;
    questionText: string;
};

type Inputs = {
    answer: string;
};
const MIN_LENGTH = 3;
export const TextQuestion = (props: Props) => {
    const loading = useUsersStore((state) => state.loading);
    const question = useUsersStore((state) => state.question);
    const performance = useUsersStore((state) => state.performance);
    const { register, handleSubmit, reset, watch } = useForm<Inputs>();
    const router = useRouter();

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        setLoading(true);
        await submitTextAnswer({
            question_id: props.questionId,
            value: data.answer,
        })
            .then(() => {
                // todo should markQuestionAsAnswered(question.id); be called
                if (question?.following_question_id) {
                    router.push(`/question/${question.following_question_id}`);
                } else {
                    router.push(`/${performance?.url_slug}`);
                }
            })
            .finally(() => setLoading(false));
        reset();
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
            <Button type={"submit"} disabled={loading || inputLength < MIN_LENGTH}>
                Odeslat
            </Button>
        </form>
    );
};
