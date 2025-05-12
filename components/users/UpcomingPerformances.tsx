import { getUpcomingPerformances } from "@/api/web.api";
import { Paragraph } from "@/components/ui/Paragraph";
import { PerformanceList } from "@/components/ui/PerformanceList";
import { MobileContainer } from "@/components/ui/layout/MobileContainer";
import { SharingActions } from "@/components/users/SharingActions";

export const UpcomingPerformances = async () => {
    const upcomingPerformances = await getUpcomingPerformances();
    return (
        <MobileContainer>
            <div className="flex flex-grow flex-col">
                {upcomingPerformances.length === 0 && (
                    <div className="flex flex-grow flex-col justify-center text-center">
                        <Paragraph>
                            Nemáme teď v kalendáři žádné další představení. Tak to asi máme prázdniny ☀️🌴🏖️
                        </Paragraph>
                    </div>
                )}
                {upcomingPerformances.length > 0 && (
                    <div>
                        <div className="py-2 pb-4 text-center">
                            <h1 className="text-xl font-bold">Nejbližší představení</h1>
                        </div>
                        <PerformanceList performances={upcomingPerformances} />
                    </div>
                )}
            </div>
            <SharingActions />
        </MobileContainer>
    );
};
