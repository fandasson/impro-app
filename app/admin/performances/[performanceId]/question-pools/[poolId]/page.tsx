import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { fetchQuestionPool } from "@/api/question-pools.api";
import { PoolVotingAnswers } from "@/components/admin/answers/PoolVotingAnswers";
import { DeletePoolButton } from "@/components/admin/question-pools/DeletePoolButton";
import { PoolAudienceStateToggle } from "@/components/admin/question-pools/PoolAudienceStateToggle";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/utils/supabase/server";

export default async function QuestionPoolDetail(props: { params: Promise<{ poolId: string }> }) {
    const params = await props.params;
    const poolId = parseInt(params.poolId);
    const pool = await fetchQuestionPool(poolId);

    if (!pool) {
        notFound();
    }

    const supabase = await createClient();
    const { count } = await supabase
        .from("questions")
        .select("id", { count: "exact", head: true })
        .eq("pool_id", poolId);
    const hasQuestions = (count ?? 0) > 0;

    return (
        <>
            <header className={"mb-4"}>
                <div className={"flex justify-between"}>
                    <div className={"flex items-stretch"}>
                        <Button variant="ghost" size="icon" className={"h-auto"} asChild>
                            <Link href={`/admin/performances/${pool.performance_id}/question-pools`}>
                                <ChevronLeft size={28} />
                            </Link>
                        </Button>
                        <div className={"flex flex-col gap-2"}>
                            <h1 className="text-2xl font-bold">
                                Skupina otázek <em>{pool.name}</em>
                            </h1>
                        </div>
                    </div>
                    <div>
                        <PoolAudienceStateToggle pool={pool} />
                    </div>
                </div>
            </header>
            <aside className={"mt-4"}>
                <PoolVotingAnswers poolId={pool.id} performanceId={pool.performance_id} />
            </aside>
            {!hasQuestions && (
                <div className={"mt-12"}>
                    <DeletePoolButton pool={pool} />
                </div>
            )}
        </>
    );
}
