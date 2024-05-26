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

export const PlayerCard = ({ player, onClick, selected, hideResults, heightFraction }: Props) => {
    return (
        <div
            className={cn("flex flex-col items-center rounded p-2", selected ? "bg-white text-black" : "")}
            key={player.id}
            onClick={onClick}
            style={{
                maxHeight: `calc((100svh - 48px - (${heightFraction - 1} * 16px)) / ${heightFraction})`,
            }}
        >
            <div className={"relative aspect-square max-h-[100px]"}>
                <Image
                    src={player.photos.profile}
                    alt={player.name}
                    width={150}
                    height={150}
                    className="h-full w-full rounded-full"
                />
            </div>
            <div className="text-center font-bold">
                <h3 className="text-xl">{player.name}</h3>
                {!hideResults && <span className="text-md text-gray-200">{player.count}</span>}
            </div>
        </div>
    );
};
