import Image from "next/image";

import { PlayerWithPhotos, VotedPlayer } from "@/api/types.api";
import { cn } from "@/utils/styling.utils";

type Props = {
    player: VotedPlayer<PlayerWithPhotos>;
    onClick?: () => void;
    selected?: boolean;
    hideResults: boolean;
    heightFraction: number;
};

export const PlayerCard = ({ player, onClick, selected, hideResults }: Props) => {
    return (
        <div
            className={cn(
                "flex cursor-pointer select-none flex-col items-center rounded-[16px] border-2 border-transparent px-2.5 py-3.5 transition-all duration-200",
                selected
                    ? "border-primary [background:var(--amber-dim)] [box-shadow:0_0_20px_oklch(72%_0.14_72_/_0.15)]"
                    : "hover:[background:var(--card)]",
            )}
            onClick={onClick}
        >
            <div
                className={cn(
                    "h-[100px] w-[100px] overflow-hidden rounded-full border-2 border-transparent transition-all duration-200",
                    selected && "border-primary [box-shadow:0_0_0_3px_oklch(72%_0.14_72_/_0.25)]",
                )}
            >
                <Image
                    src={player.photos.profile}
                    alt={player.name}
                    width={150}
                    height={150}
                    className={cn("h-full w-full object-cover transition-all duration-200", !selected && "grayscale")}
                />
            </div>
            <div
                className={cn(
                    "mt-2.5 text-center text-[15px] font-semibold transition-colors duration-200",
                    selected ? "text-primary" : "text-foreground",
                )}
            >
                {player.name}
            </div>
            {!hideResults && <span className="mt-0.5 font-mono text-xs text-muted-foreground">{player.count}</span>}
        </div>
    );
};
