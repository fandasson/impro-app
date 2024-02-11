"use client";

import { SubmitHandler, useForm } from "react-hook-form";

import { submitAnswer } from "@/api/submit-answer";
import { useUserId } from "@/components/audience/UserContext";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";

type Props = {
    questionId: number;
};

type Inputs = {
    answer: string;
};
export const TextQuestion = (props: Props) => {
    const userId = useUserId();
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<Inputs>();
    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        await submitAnswer({
            question_id: props.questionId,
            user_id: userId,
            value: data.answer,
        });
        reset();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Label htmlFor={"answer"}>Vaše odpověď</Label>
            <Textarea
                autoFocus={true}
                placeholder={"Nebojte se psát, co vás napadne... je to anonymní ;-) "}
                id={"answer"}
                {...register("answer", { required: true })}
            />
            <Button type={"submit"}>Odeslat</Button>
        </form>
    );
};
