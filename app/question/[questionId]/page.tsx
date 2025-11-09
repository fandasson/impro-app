import { fetchQuestion } from "@/api/questions.api";
import { AuthUser } from "@/components/users/AuthUser";
import { UserQuestionDetail } from "@/components/users/questions/UserQuestionDetail";

export default async function QuestionView(props: { params: Promise<{ questionId: string }> }) {
    const params = await props.params;
    const questionId = parseInt(params.questionId);
    const { data: question } = await fetchQuestion(questionId);

    return (
        <AuthUser>
            <UserQuestionDetail question={question} />
        </AuthUser>
    );
}
