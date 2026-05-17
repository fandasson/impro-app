import Link from "next/link";
import { notFound } from "next/navigation";

import { fetchPerformance } from "@/api/performances.api";
import { fetchQuestions } from "@/api/questions.api";
import { PerformanceHeader } from "@/components/admin/performance/PerformanceHeader";
import { List, QuestionItem } from "@/components/admin/questions";
import { Button } from "@/components/ui/Button";

export default async function PerformanceDetail(props: { params: Promise<{ performanceId: string }> }) {
    const params = await props.params;
    const performanceId = parseInt(params.performanceId);

    // Fetch performance
    const { data: performance } = await fetchPerformance(performanceId);

    if (!performance) {
        notFound();
    }

    const { data: questions, error } = await fetchQuestions(performanceId);
    if (questions === null) {
        throw new Error(`Error when fetching questions: ${error.message}`);
    }

    return (
        <>
            <PerformanceHeader performance={performance} backHref={"/admin"} />
            <div className={"flex justify-between gap-2"}>
                <div className="flex gap-2">
                    <Link href={`/admin/performances/${performanceId}/add-question`}>
                        <Button variant={"default"}>Přidat otázku</Button>
                    </Link>
                    <Link href={`/admin/performances/${performanceId}/question-pools`}>
                        <Button variant={"outline"}>Skupiny</Button>
                    </Link>
                </div>
                <Link href={`/admin/performances/${performanceId}/edit`}>
                    <Button variant={"outline"}>Upravit představení</Button>
                </Link>
            </div>

            <h2 className="mb-4 mt-6 text-xl font-semibold">Otázky</h2>
            <List>
                {questions.map((question) => (
                    <QuestionItem key={question.id} {...question} />
                ))}
            </List>
        </>
    );
}
