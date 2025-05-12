"use client";

import React from "react";

import { QuestionDetail, QuestionOptions } from "@/api/types.api";
import { AnswersHeadline } from "@/components/admin/answers/AnswersHeadline";
import { MatchingAnswers } from "@/components/admin/answers/MatchingAnswers";
import { OptionsAnswers } from "@/components/admin/answers/OptionsAnswers";
import { PlayersVotingAnswers } from "@/components/admin/answers/PlayersVotingAnswers";
import { TextAnswers } from "@/components/admin/answers/TextAnswers";

type Props = {
    question: QuestionDetail;
    // this is hack to safe time;
    questionOptions: QuestionOptions[];
};

export const Answers = ({ question, questionOptions }: Props) => {
    const renderComponent = () => {
        switch (question.type) {
            case "text":
                return <TextAnswers questionId={question.id} />;
            case "match":
                return (
                    <MatchingAnswers
                        questionId={question.id}
                        players={question.players}
                        characters={question.characters}
                    />
                );
            case "options":
                return <OptionsAnswers questionId={question.id} options={questionOptions} />;
            case "voting":
            case "player-pick":
                return <PlayersVotingAnswers questionId={question.id} players={question.players} />;
        }
    };
    return (
        <>
            <div className={"flex items-center justify-between"}>
                <h2 className={"text-2xl font-bold"}>Odpovědi</h2>
            </div>
            <AnswersHeadline uniqueUsers={question.type === "match"} />
            {renderComponent()}
        </>
    );
};
