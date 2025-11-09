import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { createQuestion } from "@/api/questions.api";
import { QuestionUpsertRequest } from "@/api/types.api";
import { QuestionForm } from "@/components/admin/question-form";
import { Button } from "@/components/ui/Button";

export default async function AddQuestion(props: { params: Promise<{ performanceId: string }> }) {
    const params = await props.params;
    const performanceId = parseInt(params.performanceId);

    const handleSubmit = async (data: QuestionUpsertRequest) => {
        "use server";
        const newQuestionId = await createQuestion(performanceId, {
            ...data,
            players: data.players ?? [],
        });
        redirect(`/admin/questions/${newQuestionId}/view`);
    };

    return (
        <>
            <header className={"mb-4 flex items-center gap-2"}>
                <Button variant="ghost" size="icon" asChild>
                    <Link href={`/admin/performances/${performanceId}`}>
                        <ChevronLeft size={28} />
                    </Link>
                </Button>
                <h1 className="text-2xl font-bold">Nová otázka</h1>
            </header>
            <article className={"pb-8"}>
                <QuestionForm performanceId={performanceId} handleSubmit={handleSubmit} />
            </article>
        </>
    );
}
