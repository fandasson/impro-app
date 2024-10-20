"use client";

import { SubmitHandler, useForm } from "react-hook-form";

import { submitTextAnswer } from "@/api/submit-answer";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
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
    const { register, handleSubmit, reset, watch } = useForm<Inputs>();
    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        setLoading(true);
        await submitTextAnswer({
            question_id: props.questionId,
            value: data.answer,
        }).finally(() => setLoading(false));
        reset();
    };

    const inputLength = watch("answer")?.length || 0;
    return (
        <form onSubmit={handleSubmit(onSubmit)} className={"flex flex-col gap-4"}>
            <Label htmlFor={"answer"} className={"font-medium"}>
                {props.questionText}
            </Label>
            <Textarea
                autoFocus={true}
                placeholder={
                    "Nebojte se psát, co vás napadne... je to anonymní ;-)\nBudeme rádi za zprávy delší než pár písmen"
                }
                id={"answer"}
                {...register("answer", { required: true, minLength: MIN_LENGTH })}
            />
            <Button type={"submit"} disabled={loading || inputLength < MIN_LENGTH}>
                Odeslat
            </Button>
        </form>
    );
};
