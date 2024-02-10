import { cookies } from "next/headers";

import { Badge } from "@/components/ui/Badge";
import { createClient } from "@/utils/supabase/server";

type Props = {
    questionId: number;
};
export const QuestionAnswers = async ({ questionId }: Props) => {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const { data: answers } = await supabase.from("answers").select("*").eq("question_id", questionId);

    if (!answers) {
        return null;
    }
    return (
        <div className={"flex flex-wrap gap-4"}>
            {answers.map((answer) => (
                <Badge className={"text-md"} key={answer.id} variant="outline">
                    {answer.value}
                </Badge>
            ))}
        </div>
    );
};
