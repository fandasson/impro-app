import { Button } from "@/components/ui/Button";
import { MobileContainer } from "@/components/ui/layout/MobileContainer";
import { SharingActions } from "@/components/users/SharingActions";
import { resetOnboarding } from "@/store/users.store";
import { Tables } from "@/utils/supabase/entity.types";

type Props = {
    performance: Tables<"performances">;
};
export const Intro = ({ performance }: Props) => {
    return (
        <MobileContainer>
            <div className={"flex flex-grow flex-col items-center gap-8"}>
                <h1 className={"text-center text-xl"}>{performance.name}</h1>
                <div className="flex flex-col gap-4" dangerouslySetInnerHTML={{ __html: performance.intro_text }} />
                <Button onClick={() => resetOnboarding()}>Vysvětli mi aplikaci</Button>
            </div>
            <SharingActions />
        </MobileContainer>
    );
};
