"use client";

import React, { useEffect, useState } from "react";

import { fetchActiveOrLockedQuestion } from "@/api/questions.api";
import { MobileContainer } from "@/components/ui/layout/MobileContainer";
import { AlreadyAnswered } from "@/components/users/AlreadyAnswered";
import { NoQuestion } from "@/components/users/NoQuestion";
import { PlayerPickAnswers } from "@/components/users/answers/PlayerPickAnswers";
import { MatchQuestion } from "@/components/users/questions/MatchQuestion";
import { PlayerPickQuestion } from "@/components/users/questions/PlayerPickQuestion";
import { TextQuestion } from "@/components/users/questions/TextQuestion";
import { setLoading, useStore } from "@/store";
import { createClient } from "@/utils/supabase/client";
import { Tables } from "@/utils/supabase/entity.types";

type Props = {
    performanceId: number;
};

export const UserQuestionDetail = ({ performanceId }: Props) => {
    let component: React.JSX.Element | null = null;
    const loading = useStore((state) => state.loading);
    const [question, setQuestion] = useState<Tables<"questions"> | null>(null);
    const alreadyAnswered = useStore((state) => (question ? state.answeredQuestions[question.id] : false));

    useEffect(() => {
        // only setting the loading state to true; fetchUserAnswer will set it to false
        setLoading(true);
        fetchActiveOrLockedQuestion(performanceId)
            .then((response) => {
                if (!response.data) {
                    setLoading(false);
                    return;
                }
                setQuestion(response.data);
            })
            .finally(() => setLoading(false));
    }, [performanceId]);

    // FIXME: was causing issues with infinite loop
    // useEffect(() => {
    //     if (question) {
    //         checkUserAlreadyAnswered(question.id)
    //             .then((response) => {
    //                 if (response) {
    //                     markQuestionAsAnswered(question.id);
    //                 }
    //             })
    //             .finally(() => setLoading(false));
    //     }
    // }, [question]);

    console.log(question);
    // @ts-ignore
    useEffect(() => {
        const supabase = createClient();
        const channel = supabase
            .channel("anotherTest")
            .on<Tables<"questions">>(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "questions",
                    // todo use question.id instead
                    filter: "performance_id=eq." + performanceId,
                },
                (payload) => {
                    const newQuestion = payload.new;
                    if (["active", "locked"].includes(newQuestion?.state)) {
                        setQuestion(newQuestion);
                    } else {
                        setQuestion(null);
                    }
                },
            )
            .subscribe();

        return () => supabase.removeChannel(channel);
        // todo use question.id instead
    }, [performanceId]);

    // if (loading) {
    //     return <Loading />;
    // }

    if (!question) {
        return <NoQuestion />;
    }

    if (alreadyAnswered && !question.multiple) {
        return <AlreadyAnswered />;
    }

    switch (question.type) {
        case "text":
            component = <TextQuestion questionId={question.id} />;
            break;
        case "player-pick":
            if (question.state === "active") {
                component = <PlayerPickQuestion question={question} />;
            }
            if (question.state === "locked") {
                component = <PlayerPickAnswers questionId={question.id} />;
            }
            break;
        case "match":
            component = <MatchQuestion question={question} />;
            break;
    }

    return (
        <MobileContainer className={""}>
            <div className={"grid grid-flow-col gap-4"}>
                <h2 className={"text-lg font-medium"}>{question.question}</h2>
            </div>
            {component}
        </MobileContainer>
    );
};
