"use client";

import { QuestionPool } from "@/api/types.api";
import { PoolVotingAnswers } from "@/components/audience/answers/PoolVotingAnswers";

type Props = {
    pool: QuestionPool;
};
export const AudiencePoolResults = ({ pool }: Props) => {
    return (
        <>
            <PoolVotingAnswers poolId={pool.id} performanceId={pool.performance_id} />
        </>
    );
};
