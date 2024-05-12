import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { fetchQuestion, updateQuestion } from "@/api/questions.api";
import { QuestionRequestUpdate } from "@/api/types.api";
import { QuestionForm } from "@/components/admin/question-form";
import { Button } from "@/components/ui/Button";

export default async function QuestionDetail({ params }: { params: { questionId: string } }) {
    const questionId = parseInt(params.questionId);
    const { data: question } = await fetchQuestion(questionId);

    if (!question) {
        notFound();
    }

    const handleSubmit = async (data: QuestionRequestUpdate) => {
        "use server";
        await updateQuestion(questionId, {
            ...data,
            players: data.players ?? [],
        });
        redirect(`/admin/questions/${questionId}/view`);
    };

    return (
        <>
            <header className={"mb-4"}>
                <div className={"flex items-center gap-2"}>
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/questions/${questionId}/view`}>
                            <ChevronLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold">Editace otázky</h1>
                </div>
            </header>
            <article className={"pb-8"}>
                <QuestionForm performanceId={question.performance_id} question={question} handleSubmit={handleSubmit} />
            </article>
        </>
    );
}
