import { fetchVisiblePerformance } from "@/api/performances.api";
import { AudienceIndex } from "@/components/audience/AudienceIndex";

export default async function AudienceView() {
    const { data: performance } = await fetchVisiblePerformance();

    if (!performance) {
        return null;
    }

    return <AudienceIndex defaultPerformance={performance} />;
}
