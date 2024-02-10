import { cookies } from "next/headers";

import { EmptyScreen } from "@/components/screens/EmptyScreen";
import { Intro } from "@/components/screens/Intro";
import { Question } from "@/components/screens/Question";
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
        return <EmptyScreen />;
    }

    if (performance.state === "intro") {
        return <Intro performance={performance} />;
    }

    if (performance.state === "life") {
        return <Question performance={performance} />;
    }

    // FIXME handle other states
}
