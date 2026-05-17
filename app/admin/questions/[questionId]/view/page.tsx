import { ProjectorIcon, SmartphoneIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { fetchMatchingAnswers, fetchOptionsAnswers, fetchTextAnswers, fetchVoteAnswers } from "@/api/answers.api";
import { fetchAvailablePlayers, fetchPerformance } from "@/api/performances.api";
import { fetchQuestion, fetchQuestionOptions, fetchQuestions } from "@/api/questions.api";
import type { Answer, QuestionOptions } from "@/api/types.api";
import { Answers } from "@/components/admin/answers/Answers";
import { PerformanceHeader } from "@/components/admin/performance/PerformanceHeader";
import { QuestionMatch, QuestionSidebar, VisCard } from "@/components/admin/questions";
import { QuestionAudienceStateToggle } from "@/components/admin/questions/QuestionAudienceStateToggle";
import { QuestionOptions as QuestionOptionsHeader } from "@/components/admin/questions/QuestionOptions";
import { QuestionUserStateToggle } from "@/components/admin/questions/QuestionUserStateToggle";
import { Button } from "@/components/ui/Button";

export default async function QuestionDetail(props: { params: Promise<{ questionId: string }> }) {
    const params = await props.params;
    const questionId = parseInt(params.questionId);
    const { data: question } = await fetchQuestion(questionId);

    if (!question) {
        notFound();
    }

    // Fetch performance, sidebar question list and the optional follow-up in parallel.
    const [performanceResponse, questionsResponse, followUpResponse] = await Promise.all([
        fetchPerformance(question.performance_id),
        fetchQuestions(question.performance_id),
        question.following_question_id ? fetchQuestion(question.following_question_id) : Promise.resolve(null),
    ]);

    const performance = performanceResponse.data;
    if (!performance) {
        notFound();
    }
    const questions = questionsResponse.data ?? [];
    const followUpQuestion = followUpResponse?.data;

    if (question.type === "match" && question.players.length === 0) {
        const performancePlayers = await fetchAvailablePlayers(question.performance_id);
        question.players = performancePlayers;
    }

    const options: QuestionOptions[] = [];
    if (question.type === "options") {
        const results = await fetchQuestionOptions(question.id);
        options.push(...results);
    }

    // Fetch initial answers based on question type
    let initialAnswers: Answer[] | undefined;
    switch (question.type) {
        case "text":
            const textAnswersResponse = await fetchTextAnswers(questionId);
            initialAnswers = textAnswersResponse.data ?? undefined;
            break;
        case "voting":
        case "player-pick":
            const voteAnswersResponse = await fetchVoteAnswers(questionId);
            initialAnswers = voteAnswersResponse.data ?? undefined;
            break;
        case "match":
            const matchAnswersResponse = await fetchMatchingAnswers(questionId);
            initialAnswers = matchAnswersResponse.data ?? undefined;
            break;
        case "options":
            const optionsAnswersResponse = await fetchOptionsAnswers(questionId);
            initialAnswers = optionsAnswersResponse.data ?? undefined;
            break;
    }

    return (
        <>
            <PerformanceHeader performance={performance} backHref={`/admin/performances/${question.performance_id}`} />
            <div className={"flex min-h-0 flex-1 gap-6"}>
                <QuestionSidebar
                    questions={questions}
                    currentQuestionId={question.id}
                    performanceId={question.performance_id}
                />
                <main className={"flex min-w-0 flex-1 flex-col gap-6 overflow-y-auto"}>
                    <header className={"flex items-start justify-between gap-4 border-b border-border pb-5"}>
                        <div className={"flex min-w-0 flex-col gap-1.5"}>
                            <div className={"flex flex-wrap items-center gap-2"}>
                                <h1 className={"text-2xl font-bold"}>{question.name}</h1>
                                {question.optional && (
                                    <span className={"rounded bg-amber px-1.5 py-0.5 text-xs font-medium"}>
                                        Volitelné
                                    </span>
                                )}
                                {question.show_player_motto && (
                                    <span className={"rounded bg-amber px-1.5 py-0.5 text-xs font-medium"}>Motto</span>
                                )}
                            </div>
                            <em className={"text-sm text-muted-foreground"}>{question.question}</em>
                            {followUpQuestion && (
                                <span className={"text-sm"}>
                                    pokračuje otázkou{" "}
                                    <Link href={`/admin/questions/${followUpQuestion.id}/view`} className={"underline"}>
                                        {followUpQuestion.name}
                                    </Link>
                                </span>
                            )}
                            {question.questions_pool && (
                                <Link
                                    href={`/admin/performances/${question.performance_id}/question-pools/${question.pool_id}`}
                                    className={"text-sm underline"}
                                >
                                    Skupina otázek <strong>{question.questions_pool.name}</strong>
                                </Link>
                            )}
                        </div>
                        <Link href={`/admin/questions/${question.id}/edit`} className={"shrink-0"}>
                            <Button variant={"outline"}>Upravit otázku</Button>
                        </Link>
                    </header>

                    <div className={"grid gap-4 lg:grid-cols-2"}>
                        <VisCard icon={<SmartphoneIcon size={14} />} title={"Diváci (telefon)"}>
                            <QuestionUserStateToggle defaultState={question.state} question={question} />
                        </VisCard>
                        <VisCard icon={<ProjectorIcon size={14} />} title={"Diváci / projekce"}>
                            <QuestionAudienceStateToggle question={question} />
                        </VisCard>
                    </div>

                    <article className={"grid grid-cols-2 gap-3"}>
                        <QuestionMatch question={question} />
                        <QuestionOptionsHeader question={question} />
                    </article>

                    <aside>
                        <Answers question={question} questionOptions={options} initialAnswers={initialAnswers} />
                    </aside>
                </main>
            </div>
        </>
    );
}
