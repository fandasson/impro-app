import { cookies } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PerformanceStateToggle } from "@/components/admin/performance/PerformanceStateToggle";
import { List, QuestionItem } from "@/components/admin/questions";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/utils/date.utils";
import { createClient } from "@/utils/supabase/server";

export default async function PerformanceDetail({ params }: { params: { performanceId: string } }) {
    const cookieStore = cookies();
    const performanceId = parseInt(params.performanceId);
    const supabase = createClient(cookieStore);
    const { data: performance } = await supabase.from("performances").select("*").eq("id", performanceId).single();

    if (!performance) {
        notFound();
    }

    const { data: questions, error } = await supabase
        .from("questions")
        .select("*, questions_pool(id, name)")
        .eq("performance_id", performanceId)
        .order("index_order", { ascending: false });

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
            <Link href={`/admin/performances/${performanceId}/add-question`}>
                <Button variant={"default"}>Přidat otázku</Button>
            </Link>
            <List>
                {questions.map((question) => (
                    <QuestionItem key={question.id} {...question} />
                ))}
            </List>
        </>
    );
}
