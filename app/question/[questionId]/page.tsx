"use client";;
import { use } from "react";

import { AuthUser } from "@/components/users/AuthUser";
import { UserQuestionDetail } from "@/components/users/questions/UserQuestionDetail";
import { useQuestion } from "@/hooks/users.hooks";

export default function QuestionView(props: { params: Promise<{ questionId: string }> }) {
    const params = use(props.params);
    const question = useQuestion(parseInt(params.questionId));

    return (
        <AuthUser>
            <UserQuestionDetail question={question} />
        </AuthUser>
    );
}
