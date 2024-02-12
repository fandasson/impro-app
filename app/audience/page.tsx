import { cookies } from "next/headers";

import { AudienceIndex } from "@/components/audience/AudienceIndex";
import { createClient } from "@/utils/supabase/server";

export default async function AudienceView() {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const { data: performance } = await supabase
        .from("performances")
        .select("*")
        .in("state", ["intro", "life"])
        .limit(1)
        .single();

    if (!performance) {
        return null;
    }

    return <AudienceIndex defaultPerformance={performance} />;
}
