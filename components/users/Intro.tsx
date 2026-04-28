import { Button } from "@/components/ui/Button";
import { SharingActions } from "@/components/users/SharingActions";
import { resetOnboarding } from "@/store/users.store";
import { Tables } from "@/utils/supabase/entity.types";

type Props = {
    performance: Tables<"performances">;
};

export const Intro = ({ performance }: Props) => {
    return (
        <div className="flex min-h-svh flex-col px-6 pb-10 pt-8">
            <div className="flex flex-grow flex-col gap-6">
                <h1 className="text-2xl font-bold uppercase tracking-wide">{performance.name}</h1>
                <div
                    className="flex flex-col gap-4 text-base leading-relaxed text-muted-foreground [&_strong]:font-semibold [&_strong]:text-foreground"
                    dangerouslySetInnerHTML={{ __html: performance.intro_text }}
                />
                <Button onClick={() => resetOnboarding()} className="w-full">
                    Vysvětli mi aplikaci
                </Button>
            </div>
            <div className="mt-8">
                <SharingActions />
            </div>
        </div>
    );
};
