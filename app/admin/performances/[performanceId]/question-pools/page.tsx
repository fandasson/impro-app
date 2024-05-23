import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { fetchPerformance } from "@/api/performances.api";
import { fetchAvailablePools } from "@/api/question-pools.api";
import { List } from "@/components/admin/questions";
import { Button } from "@/components/ui/Button";

export default async function QuestionPools({ params }: { params: { performanceId: string } }) {
    const performanceId = parseInt(params.performanceId);
    const { data: performance } = await fetchPerformance(performanceId);

    if (!performance) {
        notFound();
    }
    const pools = await fetchAvailablePools(performanceId);

    return (
        <>
            <div className={"flex justify-between"}>
                <div className={"flex items-stretch"}>
                    <Button variant="ghost" size="icon" className={"h-auto"} asChild>
                        <Link href={`/admin/performances/${performanceId}`}>
                            <ChevronLeft size={28} />
                        </Link>
                    </Button>
                    <div className={"flex flex-col gap-2"}>
                        <h1 className="mb-4 text-2xl font-bold">
                            Skupiny otázek pro <em>{performance.name}</em>
                        </h1>
                    </div>
                </div>
            </div>
            <List>
                {pools.map((pool) => (
                    <Link
                        key={pool.id}
                        href={`/admin/performances/${performanceId}/question-pools/${pool.id}`}
                        className={"flex justify-between rounded border px-3.5 py-3"}
                    >
                        <strong>{pool.name}</strong>
                    </Link>
                ))}
            </List>
        </>
    );
}
