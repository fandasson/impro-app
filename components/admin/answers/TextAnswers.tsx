"use client";
import { StarIcon, Trash2Icon, TrophyIcon } from "lucide-react";
import React, { memo } from "react";

import { favoriteTextAnswer, randomDrawAnswer, removeTextAnswers as removeAnswersRemote } from "@/api/answers.api";
import { TextAnswer } from "@/api/types.api";
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

    const drawAnswer = async () => {
        await randomDrawAnswer(answers);
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div>
            <div className={"flex justify-end"}>
                <Button onClick={drawAnswer} variant={"outline"}>
                    Vylosovat odpověď
                </Button>
            </div>
            <div className={"flex flex-col"}>
                <div className={"my-8 grid grid-cols-1 gap-4"}>
                    {answers
                        // sort by favorite, id DESC
                        .sort(sortAnswers)
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
                                    <Badge
                                        className={"text-md flex flex-grow cursor-pointer justify-between px-3.5 py-2"}
                                        variant={"outline"}
                                    >
                                        <span>{answer.value}</span>
                                        {answer.drawn && (
                                            <strong className={"flex gap-1"}>
                                                {answer.drawn}
                                                <TrophyIcon />
                                            </strong>
                                        )}
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
        </div>
    );
});

const sortAnswers = (a: TextAnswer, b: TextAnswer) => {
    if (a.drawn && b.drawn) {
        return a.drawn - b.drawn;
    }
    if (a.drawn) {
        return -1;
    }
    if (b.drawn) {
        return 1;
    }
    if (b.favorite === a.favorite) {
        return b.id - a.id;
    }
    return b.favorite ? 1 : -1;
};
