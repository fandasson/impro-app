"use client";

import { SubmitHandler, useForm } from "react-hook-form";

import { submitAnswer } from "@/api/submit-answer";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { setLoading, useUsersStore } from "@/store/users.store";

type Props = {
    questionId: number;
};

type Inputs = {
    answer: string;
};
export const TextQuestion = (props: Props) => {
    const loading = useUsersStore((state) => state.loading);
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<Inputs>();
    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        setLoading(true);
        await submitAnswer({
            question_id: props.questionId,
            value: data.answer,
        }).finally(() => setLoading(false));
        reset();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={"flex flex-col gap-4"}>
            <Label htmlFor={"answer"} className={"font-medium"}>
                Vaše odpověď
            </Label>
            <Textarea
                autoFocus={true}
                placeholder={"Nebojte se psát, co vás napadne... je to anonymní ;-) "}
                id={"answer"}
                {...register("answer", { required: true })}
            />
            <Button type={"submit"} disabled={loading}>
                Odeslat
            </Button>
        </form>
    );
};
