"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { Button } from "@/components/ui/Button";
import { Paragraph } from "@/components/ui/Paragraph";
import { markQuestionAsAnswered, setLoading, useUsersStore } from "@/store/users.store";

type Props = {
    questionId: number;
    questionText: string;
};

/**
 * This is not really a question as it not ask about anything. But it works as Question in flow, visibility and everything els
 */
export const InfoQuestion = (props: Props) => {
    const question = useUsersStore((state) => state.question);
    const [_isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleClick = async () => {
        setLoading(true);
        markQuestionAsAnswered(props.questionId);
        startTransition(() => {
            if (question?.following_question_id) {
                router.push(`/question/${question.following_question_id}`);
            } else {
                router.push(`/`);
            }
            setLoading(false);
        });
    };

    return (
        <div className={"flex flex-col gap-8"}>
            <Paragraph className={"text-2xl font-bold"}>Čtěte pozorně zápletku příběhu</Paragraph>
            <div className={"flex flex-col gap-4"} dangerouslySetInnerHTML={{ __html: props.questionText || "" }} />
            <Button type={"button"} onClick={handleClick}>
                To chci vidět!
            </Button>
        </div>
    );
};
