import Link from "next/link";
import { notFound } from "next/navigation";

import { fetchPerformance } from "@/api/performances.api";
import { fetchQuestions } from "@/api/questions.api";
import { PerformanceStateToggle } from "@/components/admin/performance/PerformanceStateToggle";
import { List, QuestionItem } from "@/components/admin/questions";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/utils/date.utils";

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
            <div className={"flex justify-between"}>
                <h1 className="mb-4 text-2xl font-bold">
                    {performance.name} {formatDate(performance.date)}
                </h1>
                <PerformanceStateToggle performanceId={performance.id} defaultState={performance.state} />
            </div>
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

            <h2 className="text-xl font-semibold mb-4 mt-6">Otázky</h2>
            <List>
                {questions.map((question) => (
                    <QuestionItem key={question.id} {...question} />
                ))}
            </List>
        </>
    );
}
