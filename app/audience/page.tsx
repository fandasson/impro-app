import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import { Intro } from "@/components/audience/Intro";
import { Question } from "@/components/audience/Question";
import { createClient } from "@/utils/supabase/server";

export default async function ScreenIndex() {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const { data: performance } = await supabase
        .from("performances")
        .select("*")
        .in("state", ["intro", "life"])
        .limit(1)
        .single();

    if (!performance) {
        notFound();
    }

    if (performance.state === "intro") {
        return <Intro performance={performance} />;
    }

    if (performance.state === "life") {
        return <Question performance={performance} />;
    }

    // FIXME handle other states
}
