import { Facebook, Instagram, Youtube } from "lucide-react";
import Link from "next/link";

import { MobileContainer } from "@/components/ui/layout/MobileContainer";
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
            </div>
            <div className={"flex flex-grow items-center justify-evenly"}>
                {process.env.NEXT_PUBLIC_SOCIAL_FACEBOK && (
                    <Link href={process.env.NEXT_PUBLIC_SOCIAL_FACEBOK} target="_blank">
                        <Facebook size={40} color="white" />
                    </Link>
                )}
                {process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM && (
                    <Link href={process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM} target="_blank">
                        <Instagram size={40} color="white" />
                    </Link>
                )}
                {process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE && (
                    <Link href={process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE} target="_blank">
                        <Youtube size={46} color="white" />
                    </Link>
                )}
            </div>
        </MobileContainer>
    );
};
