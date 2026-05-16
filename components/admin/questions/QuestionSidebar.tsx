import { Plus } from "lucide-react";
import Link from "next/link";

import type { QuestionWithPool } from "@/api/types.api";
import { QuestionSidebarRow } from "@/components/admin/questions/QuestionSidebarRow";
import { Button } from "@/components/ui/Button";

type Props = {
    questions: QuestionWithPool[];
    currentQuestionId: number;
    performanceId: number;
};

export const QuestionSidebar = ({ questions, currentQuestionId, performanceId }: Props) => {
    return (
        <aside className={"flex w-72 shrink-0 flex-col border-r border-border"}>
            <div className={"flex gap-2 p-3"}>
                <Button variant={"default"} size={"sm"} asChild className={"gap-1.5"}>
                    <Link href={`/admin/performances/${performanceId}/add-question`}>
                        <Plus size={16} /> Přidat otázku
                    </Link>
                </Button>
                <Button variant={"outline"} size={"sm"} asChild>
                    <Link href={`/admin/performances/${performanceId}/question-pools`}>Skupiny</Link>
                </Button>
            </div>
            <nav className={"flex flex-1 flex-col overflow-y-auto px-2 pb-4"}>
                {questions.map((question) => (
                    <QuestionSidebarRow
                        key={question.id}
                        question={question}
                        selected={question.id === currentQuestionId}
                    />
                ))}
            </nav>
        </aside>
    );
};
