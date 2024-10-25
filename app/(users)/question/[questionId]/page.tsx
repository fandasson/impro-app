"use client";
import { UserQuestionDetail } from "@/components/users/questions/UserQuestionDetail";
import { useQuestion } from "@/hooks/users.hooks";

export default function QuestionView({ params }: { params: { questionId: string } }) {
    const question = useQuestion(parseInt(params.questionId));

    return <UserQuestionDetail question={question} />;
}
