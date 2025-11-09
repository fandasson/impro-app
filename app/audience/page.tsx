import { fetchVisiblePerformance } from "@/api/performances.api";
import { fetchVisiblePool } from "@/api/question-pools.api";
import { findQuestion } from "@/api/questions.api";
import { getUpcomingPerformances } from "@/api/web.api";
import { AudienceIndex } from "@/components/audience/AudienceIndex";

export default async function AudienceView() {
    const { data: performance } = await fetchVisiblePerformance();

    if (!performance) {
        return null;
    }

    // Fetch initial question and pool data
    const { data: initialQuestion } = await findQuestion(
        performance.id,
        "audience_visibility.eq.question,audience_visibility.eq.results",
    );
    const initialPool = await fetchVisiblePool(performance.id);

    // Fetch upcoming performances for closing state
    const upcomingPerformances = await getUpcomingPerformances();

    return (
        <AudienceIndex
            defaultPerformance={performance}
            initialQuestion={initialQuestion ?? null}
            initialPool={initialPool ?? null}
            upcomingPerformances={upcomingPerformances}
        />
    );
}
