import { ChevronLeft } from "lucide-react";
import Link from "next/link";

import { PerformanceStateToggle } from "@/components/admin/performance/PerformanceStateToggle";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/utils/date.utils";
import { Tables } from "@/utils/supabase/entity.types";

type Props = {
    performance: Tables<"performances">;
    backHref?: string;
};

export const PerformanceHeader = ({ performance, backHref }: Props) => {
    return (
        <header className={"flex items-center gap-4 border-b border-border pb-4"}>
            {backHref && (
                <Button variant="ghost" size="icon" asChild className={"h-auto shrink-0"}>
                    <Link href={backHref}>
                        <ChevronLeft size={28} />
                    </Link>
                </Button>
            )}
            <div className={"flex min-w-0 flex-col gap-0.5"}>
                <h1 className={"truncate text-xl font-bold"}>{performance.name}</h1>
                <span className={"text-sm text-muted-foreground"}>{formatDate(performance.date)}</span>
            </div>
            <div className={"ml-auto shrink-0"}>
                <PerformanceStateToggle performanceId={performance.id} defaultState={performance.state} />
            </div>
        </header>
    );
};
