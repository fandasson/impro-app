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
        <div className="flex flex-col gap-5 px-4">
            {performances.map((performance, index) => (
                <div key={performance.id} className="overflow-hidden rounded-[14px] border bg-card">
                    <Link href={performance.link} target="_blank">
                        <Image
                            src={performance.coverImageUrl}
                            width={600}
                            height={188}
                            unoptimized={true}
                            alt={performance.title}
                            className="aspect-[16/5] w-full object-cover"
                            priority={index === 0}
                        />
                    </Link>
                    <div className="p-4 pt-3.5">
                        <h3
                            className="mb-2 text-[15px] font-bold uppercase tracking-wide text-foreground"
                            dangerouslySetInnerHTML={{ __html: performance.title ?? "" }}
                        />
                        <div className="mb-3.5 flex flex-col gap-0.5">
                            <div className="text-sm font-medium text-foreground">
                                {format(new Date(performance.date.replace(" ", "T")), "EEEE d. MMMM, HH:mm", {
                                    locale: cs,
                                })}
                            </div>
                            {performance.venue && (
                                <div className="text-xs text-muted-foreground">{performance.venue}</div>
                            )}
                        </div>
                        <div className="flex flex-col gap-2">
                            {performance.actions.map((action, index) => (
                                <Button
                                    key={`${performance.id}-action${index}`}
                                    asChild={true}
                                    variant={index === 0 ? "default" : "outline"}
                                    className="w-full"
                                >
                                    <Link href={action.url} target="_blank">
                                        {action.title}
                                    </Link>
                                </Button>
                            ))}
                            {performance.facebookUrl && (
                                <Button asChild={true} variant="outline" className="w-full">
                                    <Link href={performance.facebookUrl} target="_blank">
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
