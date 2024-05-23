import { ChevronLeft, ProjectorIcon, SmartphoneIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { fetchQuestion } from "@/api/questions.api";
import { Answers } from "@/components/admin/answers/Answers";
import { QuestionMatch } from "@/components/admin/questions";
import { QuestionAudienceStateToggle } from "@/components/admin/questions/QuestionAudienceStateToggle";
import { QuestionUserStateToggle } from "@/components/admin/questions/QuestionUserStateToggle";
import { Button } from "@/components/ui/Button";

export default async function QuestionDetail({ params }: { params: { questionId: string } }) {
    const questionId = parseInt(params.questionId);
    const { data: question } = await fetchQuestion(questionId);

    if (!question) {
        notFound();
    }

    return (
        <>
            <header className={"mb-4"}>
                <div className={"flex justify-between"}>
                    <div className={"flex items-stretch"}>
                        <Button variant="ghost" size="icon" asChild className={"h-auto"}>
                            <Link href={`/admin/performances/${question.performance_id}`}>
                                <ChevronLeft size={28} />
                            </Link>
                        </Button>
                        <div className={"flex flex-col gap-2"}>
                            <h1 className="text-2xl font-bold">{question.name}</h1>
                            <em className={"relative -left-0.5"}>{question.question}</em>
                        </div>
                        {question.questions_pool && (
                            <Link
                                href={`/admin/performances/${question.performance_id}/question-pools/${question.pool_id}`}
                            >
                                <Button variant="ghost" size="sm" className={"ml-4 gap-2"}>
                                    Skupina otázek <strong>{question.questions_pool.name}</strong>
                                </Button>
                            </Link>
                        )}
                    </div>
                    <Link href={`/admin/questions/${question.id}/edit`}>
                        <Button variant={"outline"}>Upravit otázku</Button>
                    </Link>
                </div>
            </header>
            <div className={"flex flex-col justify-between gap-8 lg:flex-row"}>
                <div className={"flex items-center"}>
                    <SmartphoneIcon size={28} className={"mr-4"} />
                    <QuestionUserStateToggle defaultState={question.state} question={question} />
                </div>
                <div className={"flex items-center"}>
                    <ProjectorIcon size={28} className={"mr-4"} />
                    <QuestionAudienceStateToggle question={question} />
                </div>
            </div>
            <article className={"mb-4 grid grid-cols-2 gap-3"}>
                <QuestionMatch question={question} />
            </article>
            <aside className={"mt-4"}>
                <Answers question={question} />
            </aside>
        </>
    );
}
