import { format } from "date-fns";
import { cs } from "date-fns/locale";
import Image from "next/image";
import Link from "next/link";

import { WebPerformance } from "@/api/web.api";
import { Button } from "@/components/ui/Button";

interface PerformanceListProps {
    performances: WebPerformance[];
}

export function PerformanceList({ performances }: PerformanceListProps) {
    return (
        <div className="space-y-4">
            {performances.map((performance) => (
                <div key={performance.id} className="rounded-lg border p-4 shadow-lg">
                    <h3 className="text-lg font-semibold">{performance.title}</h3>
                    <div className="mt-2 flex flex-col gap-2">
                        <Link href={performance.link}>
                            <Image
                                src={performance.coverImageUrl}
                                width={600}
                                height={188}
                                unoptimized={true}
                                alt={performance.title}
                            />
                        </Link>
                        <div className="mb-3 text-sm">
                            <div className="font-medium">
                                {format(performance.date, "EEEE d. MMMM, HH:mm", { locale: cs })}
                            </div>
                            {performance.venue && <div className="text-muted-foreground">{performance.venue}</div>}
                        </div>
                        <div className={"flex flex-col gap-3"}>
                            {performance.actions.map((action, index) => (
                                <Button
                                    key={`${performance.id}-action${index}`}
                                    asChild={true}
                                    variant={index === 0 ? "default" : "secondary"}
                                >
                                    <Link href={action.url} target={"_blank"}>
                                        {action.title}
                                    </Link>
                                </Button>
                            ))}
                            {performance.facebookUrl && (
                                <Button asChild={true} variant={"secondary"}>
                                    <Link href={performance.facebookUrl} target={"_blank"}>
                                        Událost na Facebooku
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
