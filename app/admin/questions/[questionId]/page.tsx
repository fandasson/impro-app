import { ChevronLeft } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";

import { fetchQuestion } from "@/api/questions.api";
import { QuestionMatch } from "@/app/admin/questions/[questionId]/QuestionMatch";
import { Answers } from "@/components/admin/answers/Answers";
import { QuestionStateToggle } from "@/components/admin/questions/QuestionStateToggle";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/utils/supabase/server";

export default async function QuestionDetail({ params }: { params: { questionId: string } }) {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const questionId = parseInt(params.questionId);
    const { data: question } = await fetchQuestion(questionId);

    if (!question) {
        notFound();
    }

    return (
        <>
            <header className={"mb-4 flex items-center gap-2"}>
                <Button variant="ghost" size="icon" asChild>
                    <Link href={`/admin/performances/${question.performance_id}`}>
                        <ChevronLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <h1 className="text-2xl font-bold">{question.name}</h1>
            </header>
            <article className={"mb-4 grid grid-cols-2 gap-3"}>
                <div className={"border-r-1"}>
                    <div className={"flex flex-col gap-1"}>
                        <em className={"font-medium not-italic text-gray-400"}>Otázka</em>
                        <h2 className={"text-lg font-medium"}>{question.question}</h2>
                    </div>
                </div>
                <div className={"pl-4"}>
                    <QuestionStateToggle defaultState={question.state} questionId={question.id} />
                </div>
                <QuestionMatch question={question} />
            </article>
            <aside className={"mt-4"}>
                <Answers question={question} />
            </aside>
        </>
    );
}
