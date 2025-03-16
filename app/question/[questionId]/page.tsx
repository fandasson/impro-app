"use client";
import { AuthUser } from "@/components/users/AuthUser";
import { UserQuestionDetail } from "@/components/users/questions/UserQuestionDetail";
import { useQuestion } from "@/hooks/users.hooks";

export default function QuestionView({ params }: { params: { questionId: string } }) {
    const question = useQuestion(parseInt(params.questionId));

    return (
        <AuthUser>
            <UserQuestionDetail question={question} />
        </AuthUser>
    );
}
