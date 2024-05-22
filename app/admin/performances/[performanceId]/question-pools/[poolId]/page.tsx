import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { fetchQuestionPool } from "@/api/questions.api";
import { PoolVotingAnswers } from "@/components/admin/answers/PoolVotingAnswers";
import { Button } from "@/components/ui/Button";

export default async function QuestionPoolDetail({ params }: { params: { poolId: string } }) {
    const poolId = parseInt(params.poolId);
    const pool = await fetchQuestionPool(poolId);

    if (!pool) {
        notFound();
    }

    return (
        <>
            <header className={"mb-4"}>
                <div className={"flex justify-between"}>
                    <div className={"flex items-stretch"}>
                        <Link href={`/admin/performances/${pool.performance_id}`}>
                            <Button variant="ghost" size="icon" className={"h-auto"} asChild>
                                <ChevronLeft size={28} />
                            </Button>
                        </Link>
                        <div className={"flex flex-col gap-2"}>
                            <h1 className="text-2xl font-bold">
                                Skupina otázek <em>{pool.name}</em>
                            </h1>
                        </div>
                    </div>
                </div>
            </header>
            <aside className={"mt-4"}>
                <PoolVotingAnswers poolId={pool.id} performanceId={pool.performance_id} />
            </aside>
        </>
    );
}
