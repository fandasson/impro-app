import Image from "next/image";

import { PlayerWithPhotos, VotedPlayer } from "@/api/types.api";

type Props = {
    players: VotedPlayer<PlayerWithPhotos>[];
};
export const VotingAnswersFinal = ({ players }: Props) => {
    if (players.length !== 2) {
        return null;
    }

    return (
        <div className="flex w-full max-w-5xl items-center justify-between rounded-lg bg-white p-8">
            <FinalVoteCard key={players[0].id} player={players[0]} />
            <div className="flex flex-grow flex-col items-center">
                <div className=" text-7xl text-gray-900">
                    132 <span className={"text-gray-500"}>:</span> 456
                </div>
            </div>
            <FinalVoteCard key={players[1].id} player={players[1]} />
        </div>
    );
};

type CardProps = {
    player: VotedPlayer<PlayerWithPhotos>;
};
const FinalVoteCard = ({ player }: CardProps) => {
    return (
        <div className="flex flex-col items-center">
            <Image
                src={player.photos.body}
                width={300}
                height={400}
                alt={player.name}
                className="w-300 mb-6 w-full max-w-[300px] rounded-lg"
                style={{
                    aspectRatio: "300/400",
                    objectFit: "cover",
                }}
            />
            <h3 className="text-3xl font-bold text-gray-900">{player.name}</h3>
        </div>
    );
};
