import { cookies } from "next/headers";

import { AuthUser } from "@/components/users/AuthUser";
import { UpcomingPerformances } from "@/components/users/UpcomingPerformances";
import { UserIndex } from "@/components/users/UserIndex";
import { createClient } from "@/utils/supabase/server";

export default async function PerformanceView({ params }: { params: { slug: string } }) {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data: performances } = await supabase.from("performances").select("*").in("state", ["intro", "life"]);

    if (!performances || performances.length !== 1) {
        if (performances && performances.length > 1) {
            console.warn("More than one performance found", performances);
        }
        return <UpcomingPerformances />;
    }

    return (
        <AuthUser>
            <UserIndex defaultPerformance={performances[0]} />
        </AuthUser>
    );
}
