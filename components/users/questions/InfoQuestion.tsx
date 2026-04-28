"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { Button } from "@/components/ui/Button";
import { markQuestionAsAnswered, setLoading, useUsersStore } from "@/store/users.store";

type Props = {
    questionId: number;
    questionText: string;
    navigateNext?: () => void;
};

export const InfoQuestion = (props: Props) => {
    const [_isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleClick = async () => {
        setLoading(true);
        markQuestionAsAnswered(props.questionId);
        startTransition(() => {
            if (props.navigateNext) {
                props.navigateNext();
            } else {
                router.push(`/`);
            }
        });
    };

    return (
        <div className="flex flex-col gap-6">
            <div
                className="flex flex-col gap-3 text-base leading-relaxed text-muted-foreground [&_strong]:font-semibold [&_strong]:text-foreground"
                dangerouslySetInnerHTML={{ __html: props.questionText || "" }}
            />
            <Button type="button" className="w-full" onClick={handleClick}>
                To chci vidět!
            </Button>
        </div>
    );
};
