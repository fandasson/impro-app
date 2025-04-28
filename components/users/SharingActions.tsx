import { Facebook, Instagram, Youtube } from "lucide-react";
import Link from "next/link";

export const SharingActions = () => {
    return (
        <div className={"flex flex-col gap-4"}>
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
            <p className={"text-center"}>
                <a href="https://improvariace.cz" target="_blank">
                    improvariace.cz
                </a>
            </p>
        </div>
    );
};
