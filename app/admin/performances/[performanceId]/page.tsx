import Link from "next/link";
import { notFound } from "next/navigation";

import { fetchPerformance } from "@/api/performances.api";
import { fetchQuestions } from "@/api/questions.api";
import { PerformanceStateToggle } from "@/components/admin/performance/PerformanceStateToggle";
import { List, QuestionItem } from "@/components/admin/questions";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/utils/date.utils";

export default async function PerformanceDetail({ params }: { params: { performanceId: string } }) {
    const performanceId = parseInt(params.performanceId);
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
            <div>
                <Link href={`/admin/performances/${performanceId}/add-question`} className={""}>
                    <Button variant={"default"}>Přidat otázku</Button>
                </Link>
            </div>
            <List>
                {questions.map((question) => (
                    <QuestionItem key={question.id} {...question} />
                ))}
            </List>
        </>
    );
}
