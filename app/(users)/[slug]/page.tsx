import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import { UserIndex } from "@/components/users/UserIndex";
import { createClient } from "@/utils/supabase/server";

export default async function PerformanceView({ params }: { params: { slug: string } }) {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { data: performance } = await supabase
        .from("performances")
        .select("*")
        .eq("url_slug", params.slug)
        .limit(1)
        .single();

    if (!performance || !["intro", "life"].includes(performance.state)) {
        notFound();
    }

    return <UserIndex defaultPerformance={performance} />;
}
