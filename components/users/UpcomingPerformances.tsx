"use client";

import { WebPerformance } from "@/api/web.api";
import { PerformanceList } from "@/components/ui/PerformanceList";
import { SharingActions } from "@/components/users/SharingActions";

type Props = {
    upcomingPerformances: WebPerformance[];
};

export const UpcomingPerformances = ({ upcomingPerformances }: Props) => {
    return (
        <div className="flex min-h-svh flex-col pb-10">
            <div className="from-background/75 via-background/30 pointer-events-none sticky top-0 z-10 bg-gradient-to-b to-transparent pb-16 pt-6 backdrop-blur-md [-webkit-mask-image:linear-gradient(to_bottom,black_55%,transparent)] [mask-image:linear-gradient(to_bottom,black_55%,transparent)]">
                <div className="pointer-events-auto px-6">
                    <h1 className="text-[26px] font-bold leading-tight">
                        Nejbližší
                        <br />
                        představení
                    </h1>
                </div>
            </div>

            <div className="flex flex-grow flex-col">
                {upcomingPerformances.length === 0 && (
                    <div className="flex flex-grow flex-col items-center justify-center px-6 text-center">
                        <p className="text-base leading-relaxed text-muted-foreground">
                            Nemáme teď v kalendáři žádné další představení. Tak to asi máme prázdniny ☀️🌴🏖️
                        </p>
                    </div>
                )}
                {upcomingPerformances.length > 0 && <PerformanceList performances={upcomingPerformances} />}
            </div>

            <div className="mt-8 px-6">
                <SharingActions />
            </div>
        </div>
    );
};
