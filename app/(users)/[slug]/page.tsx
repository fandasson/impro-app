import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import { Intro } from "@/components/users/Intro";
import { NoQuestion } from "@/components/users/NoQuestion";
import { Questions } from "@/components/users/questions/Questions";
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

    if (performance.state === "intro") {
        return <Intro performance={performance} />;
    }

    if (performance.state === "life") {
        const { data: question } = await supabase
            .from("questions")
            .select("*")
            .eq("performance_id", performance.id)
            .eq("state", "active")
            .limit(1)
            .single();

        if (!question) {
            return <NoQuestion />;
        }

        return <Questions question={question} />;
    }
}
