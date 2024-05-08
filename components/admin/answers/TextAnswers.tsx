"use client";
import React, { memo, useState } from "react";

import { Loading } from "@/components/admin/Loading";
import { RemoveAnswersButton } from "@/components/admin/answers/RemoveAnswersButton";
import { Badge } from "@/components/ui/Badge";
import { useTextAnswers } from "@/hooks/admin.hooks";
import { useAdminStore } from "@/store/admin.store";

type Props = {
    questionId: number;
};
export const TextAnswers = memo(({ questionId }: Props) => {
    const answers = useTextAnswers(questionId);
    const loading = useAdminStore((state) => state.loading);
    const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);

    const toggleSelect = (id: number) => {
        if (selectedAnswers.includes(id)) {
            setSelectedAnswers(selectedAnswers.filter((a) => a !== id));
        } else {
            setSelectedAnswers([...selectedAnswers, id]);
        }
    };

    const handleRemove = () => {
        setSelectedAnswers([]);
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div className={"flex flex-col"}>
            <RemoveAnswersButton answersIds={selectedAnswers} callback={handleRemove} />
            <div className={"my-8 grid grid-cols-1 gap-4"}>
                {answers
                    // sort by id DESC
                    .sort((a, b) => b.id - a.id)
                    .map((answer) => {
                        const selected = selectedAnswers.includes(answer.id);
                        return (
                            <Badge
                                className={"text-md cursor-pointer px-3.5 py-2"}
                                key={answer.id}
                                variant={`${selected ? "default" : "outline"}`}
                                onClick={() => toggleSelect(answer.id)}
                            >
                                {answer.value}
                            </Badge>
                        );
                    })}
            </div>
            <RemoveAnswersButton answersIds={selectedAnswers} callback={handleRemove} />
        </div>
    );
});
