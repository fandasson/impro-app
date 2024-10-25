"use client";
import { StarIcon, Trash2Icon } from "lucide-react";
import React, { memo } from "react";

import { favoriteTextAnswer, removeTextAnswers as removeAnswersRemote } from "@/api/answers.api";
import { Loading } from "@/components/admin/Loading";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useTextAnswers } from "@/hooks/admin.hooks";
import { removeAnswers as removeAnswersLocal, useAdminStore } from "@/store/admin.store";

type Props = {
    questionId: number;
};
export const TextAnswers = memo(({ questionId }: Props) => {
    const answers = useTextAnswers(questionId);
    const loading = useAdminStore((state) => state.loading);

    const removeAnswer = async (answerId: number) => {
        removeAnswersLocal([answerId]);
        await removeAnswersRemote([answerId]);
    };

    const toggleFavoriteAnswer = async (answerId: number, favorite: boolean) => {
        await favoriteTextAnswer(answerId, favorite);
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div className={"flex flex-col"}>
            <div className={"my-8 grid grid-cols-1 gap-4"}>
                {answers
                    // sort by favorite, id DESC
                    .sort((a, b) => (b.favorite === a.favorite ? b.id - a.id : b.favorite ? 1 : -1))
                    .map((answer) => {
                        return (
                            <div className={"flex items-center justify-between gap-4"} key={answer.id}>
                                <Button
                                    variant={"ghost"}
                                    size={"icon"}
                                    onClick={() => toggleFavoriteAnswer(answer.id, !answer.favorite)}
                                >
                                    <StarIcon fill={answer.favorite ? "yellow" : ""} />
                                </Button>
                                <Badge className={"text-md flex-grow cursor-pointer px-3.5 py-2"} variant={"outline"}>
                                    {answer.value}
                                </Badge>
                                <Button
                                    variant={"outline"}
                                    size={"icon"}
                                    className={"rounded border-destructive bg-destructive"}
                                    onClick={() => removeAnswer(answer.id)}
                                >
                                    <Trash2Icon />
                                </Button>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
});
