import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import { QuestionItem, QuestionsList } from "@/components/admin/questions";
import { formatDate } from "@/utils/date.utils";
import { createClient } from "@/utils/supabase/server";

export default async function PerformanceDetail({ params }: { params: { performanceId: string } }) {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const { data: performance } = await supabase
        .from("performances")
        .select("*")
        .eq("id", params.performanceId)
        .single();

    if (!performance) {
        notFound();
    }

    const { data: questions, error } = await supabase
        .from("questions")
        .select("*")
        .eq("performance_id", params.performanceId)
        .order("index_order", { ascending: true });

    if (questions === null) {
        throw new Error(`Error when fetching questions: ${error.message}`);
    }

    return (
        <>
            <h1 className="mb-4 text-4xl font-bold">
                {performance.name} {formatDate(performance.date)}
            </h1>
            <QuestionsList>
                {questions.map((question) => (
                    <QuestionItem key={question.id} {...question} />
                ))}
            </QuestionsList>
        </>
    );
}
