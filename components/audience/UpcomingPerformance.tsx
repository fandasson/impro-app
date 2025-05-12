import { format } from "date-fns";
import { cs } from "date-fns/locale";

import { getUpcomingPerformances } from "@/api/web.api";

export async function UpcomingPerformance() {
    const upcomingPerformances = await getUpcomingPerformances();

    console.log(upcomingPerformances);

    if (!upcomingPerformances.length) {
        return null;
    }

    const performance = upcomingPerformances[0];
    return (
        <div>
            <h2 className="mb-4 text-center text-3xl font-bold">Přijďte příště!</h2>
            <div className="rounded-xl border-2 bg-white/5 p-6 shadow-md backdrop-blur-sm">
                <h3 className="mb-2 text-2xl font-bold">{performance.title}</h3>
                <div className="flex flex-col justify-between gap-4 md:flex-row">
                    <div className="text-xl">
                        <div className="font-medium">
                            {format(performance.date, "EEEE d. MMMM, HH:mm", { locale: cs })}
                        </div>
                        {performance?.venue && <div className="text-lg opacity-90">{performance.venue}</div>}
                    </div>
                </div>
            </div>
        </div>
    );
}
