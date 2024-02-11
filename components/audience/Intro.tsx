import { MobileContainer } from "@/components/ui/layout/MobileContainer";
import { Tables } from "@/utils/supabase/entity.types";

type Props = {
    performance: Tables<"performances">;
};
export const Intro = ({ performance }: Props) => {
    return (
        <MobileContainer>
            <div className={"flex flex-col items-center gap-8"}>
                <h1 className={"text-center text-xl"}>{performance.name}</h1>
                <p>{performance.intro_text}</p>
            </div>
        </MobileContainer>
    );
};
