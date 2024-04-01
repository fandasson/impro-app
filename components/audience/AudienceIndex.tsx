"use client";

import { useEffect, useState } from "react";

import { AudienceQuestionDetail } from "@/components/audience/AudienceQuestionDetail";
import { Intro } from "@/components/audience/Intro";
import { CHANNEL_DATABASE } from "@/utils/constants.utils";
import { createClient } from "@/utils/supabase/client";
import { Tables } from "@/utils/supabase/entity.types";

type Props = {
    defaultPerformance: Tables<"performances">;
};

export const AudienceIndex = ({ defaultPerformance }: Props) => {
    const [performance, setPerformance] = useState(defaultPerformance);

    // @ts-ignore
    useEffect(() => {
        const supabase = createClient();
        const channel = supabase
            .channel(CHANNEL_DATABASE)
            .on<Tables<"performances">>(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "performances",
                    filter: "id=eq." + defaultPerformance.id,
                },
                (payload) => {
                    setPerformance(payload.new);
                },
            )
            .subscribe();

        return () => supabase.removeChannel(channel);
    }, [defaultPerformance.id]);

    if (performance.state === "intro") {
        return <Intro performance={performance} />;
    }

    if (performance.state === "life") {
        return <AudienceQuestionDetail performanceId={defaultPerformance.id} />;
    }
};
