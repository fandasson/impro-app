import Image from "next/image";

import { PlayerWithPhotos, VotedPlayer } from "@/api/types.api";

type Props = {
    player: VotedPlayer<PlayerWithPhotos>;
    hideResults: boolean;
};

export const VoteCard = ({ player, hideResults }: Props) => {
    return (
        <div className="flex flex-col items-center">
            <Image
                src={player.photos.profile}
                width={150}
                height={150}
                alt={player.name}
                className="w-15 mb-4 max-w-[300px] rounded-full"
                style={{
                    aspectRatio: "1/1",
                    objectFit: "cover",
                }}
            />
            <div className="text-center text-2xl">
                <h3 className="font-bold text-gray-900">{player.name}</h3>
                <span className="font-mono font-bold text-gray-600">{hideResults ? "" : player.count}</span>
            </div>
        </div>
    );
};
