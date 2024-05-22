import { Eye, EyeOff, HelpCircle, Pencil, ProjectorIcon, SmartphoneIcon } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

import { hideAllForQuestion } from "@/api/questions.api";
import { QuestionWithPool } from "@/api/types.api";
import { Button } from "@/components/ui/Button";

type Props = QuestionWithPool;
export const QuestionItem = (props: Props) => {
    const { id, name, state, audience_visibility, questions_pool: pool, performance_id } = props;

    const handleDelete = async (data: FormData) => {
        "use server";
        const questionId = data.get("questionId");
        if (questionId && typeof questionId === "string") {
            await hideAllForQuestion(parseInt(questionId), performance_id);
        }
    };

    let stateIcon: ReactNode | null = null;
    switch (state) {
        case "draft":
        case "answered":
            stateIcon = <EyeOff />;
            break;
        case "active":
            stateIcon = <Pencil className={"stroke-destructive"} />;
            break;
        case "locked":
            stateIcon = <Eye className={"stroke-destructive"} />;
            break;
    }

    let audienceVisibilityIcon: ReactNode | null = null;
    switch (audience_visibility) {
        case "hidden":
            audienceVisibilityIcon = <EyeOff />;
            break;
        case "question":
            audienceVisibilityIcon = <HelpCircle className={"stroke-destructive"} />;
            break;
        case "results":
            audienceVisibilityIcon = <Eye className={"stroke-destructive"} />;
            break;
    }

    return (
        <div className={"flex items-center justify-between gap-4"}>
            <Link
                href={`/admin/questions/${id}/view`}
                className={"grid flex-grow grid-cols-7 gap-2 rounded border px-3.5 py-3"}
            >
                <strong className={"col-span-4"}>{name}</strong>
                <span>{pool?.name}</span>
                <div className={"flex items-center justify-end"}>
                    <SmartphoneIcon size={28} className={"mr-4"} />
                    {stateIcon}
                </div>
                <div className={"flex items-center justify-end"}>
                    <ProjectorIcon size={28} className={"mr-4"} />
                    {audienceVisibilityIcon}
                </div>
            </Link>
            <form action={handleDelete}>
                <input className={"hidden"} type={"hidden"} name={"questionId"} value={id} />
                <Button
                    variant={"outline"}
                    type={"submit"}
                    size={"icon"}
                    className={"rounded border-destructive bg-destructive"}
                >
                    <EyeOff />
                </Button>
            </form>
        </div>
    );
};
