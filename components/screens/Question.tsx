import { cookies } from "next/headers";

import { QuestionHeadline } from "@/components/screens/QuestionHeadline";
import { Timer } from "@/components/screens/Timer";
import { QuestionAnswers } from "@/components/screens/answers/QuestionAnswers";
import { Tables } from "@/utils/supabase/entity.types";
import { createClient } from "@/utils/supabase/server";

type Props = {
    performance: Tables<"performances">;
};
export const Question = async ({ performance }: Props) => {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const { data: question } = await supabase
        .from("questions")
        .select("*")
        .eq("performance_id", performance.id)
        .eq("state", "active")
        .order("index_order", { ascending: true })
        .limit(1)
        .single();

    if (!question) {
        return null;
    }

    const showTimer = question.time_limit > 0 && question.finish_at !== null;
    return (
        <div className={"flex flex-col items-center gap-8"}>
            <QuestionHeadline question={question} />
            {showTimer && <Timer />}
            {question.present_answers && <QuestionAnswers questionId={question.id} />}
        </div>
    );
};
