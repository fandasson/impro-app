import Link from "next/link";

import type { Performance } from "@/api/types.api";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/utils/date.utils";

type Props = {
    performances: Performance[];
};

export function PlayerPerformances({ performances }: Props) {
    return (
        <div className="space-y-3">
            <h2 className="text-xl font-semibold">Představení</h2>
            {performances.length === 0 ? (
                <p className="text-sm text-muted-foreground">Improvizátor zatím není přiřazen k žádnému představení.</p>
            ) : (
                <ul className="divide-y divide-border">
                    {performances.map((performance) => (
                        <li key={performance.id} className="flex items-center justify-between py-3">
                            <Link href={`/admin/performances/${performance.id}`}>
                                <div>
                                    <span className="font-medium">{performance.name}</span>
                                    <span className="ml-3 text-sm text-muted-foreground">{formatDate(performance.date)}</span>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
