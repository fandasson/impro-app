"use client";

import React from "react";

import { Question } from "@/api/types.api";
import { NoQuestion } from "@/components/users/NoQuestion";
import { UserQuestionDetail } from "@/components/users/questions/UserQuestionDetail";
import { useActiveOrLockedQuestion } from "@/hooks/users.hooks";
import { useUsersStore } from "@/store/users.store";

type Props = {
    performanceId: number;
    initialQuestion: Question | null;
};
export const UserQuestionDetailPage = ({ performanceId, initialQuestion }: Props) => {
    const loading = useUsersStore((state) => state.loading);
    const question = useActiveOrLockedQuestion(performanceId, initialQuestion);

    // if (loading) {
    //     return <Loading />;
    // }

    if (!question) {
        return <NoQuestion />;
    }

    return <UserQuestionDetail question={question} />;
};
