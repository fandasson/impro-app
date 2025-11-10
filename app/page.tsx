import { cookies } from "next/headers";

import { fetchActiveOrLockedQuestion } from "@/api/questions.api";
import { getUpcomingPerformances } from "@/api/web.api";
import { AuthUser } from "@/components/users/AuthUser";
import { UpcomingPerformances } from "@/components/users/UpcomingPerformances";
import { UserIndex } from "@/components/users/UserIndex";
import { createClient } from "@/utils/supabase/server";

export default async function PerformanceView({ params }: { params: { slug: string } }) {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data: performances } = await supabase.from("performances").select("*").in("state", ["intro", "life"]);

    // Fetch upcoming performances for finished/closing states
    const upcomingPerformances = await getUpcomingPerformances();

    if (!performances || performances.length !== 1) {
        if (performances && performances.length > 1) {
            console.warn("More than one performance found", performances);
        }
        return <UpcomingPerformances upcomingPerformances={upcomingPerformances} />;
    }

    // Fetch initial active or locked question
    const { data: initialQuestion } = await fetchActiveOrLockedQuestion(performances[0].id);

    return (
        <AuthUser>
            <UserIndex
                defaultPerformance={performances[0]}
                initialQuestion={initialQuestion ?? null}
                upcomingPerformances={upcomingPerformances}
            />
        </AuthUser>
    );
}
