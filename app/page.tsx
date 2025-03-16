import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import { AuthUser } from "@/components/users/AuthUser";
import { UserIndex } from "@/components/users/UserIndex";
import { createClient } from "@/utils/supabase/server";

export default async function PerformanceView({ params }: { params: { slug: string } }) {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { data: performances } = await supabase.from("performances").select("*").in("state", ["intro", "life"]);

    if (!performances || performances.length !== 1) {
        if (performances && performances.length > 1) {
            console.warn("More than one performance found", performances);
        }
        notFound();
    }

    return (
        <AuthUser>
            <UserIndex defaultPerformance={performances[0]} />
        </AuthUser>
    );
}
