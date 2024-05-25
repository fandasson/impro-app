import { PlayerWithPhotos, VotedPlayer } from "@/api/types.api";
import { VoteCard } from "@/components/audience/answers/VoteCard";

type Props = {
    players: VotedPlayer<PlayerWithPhotos>[];
    hideResults: boolean;
};
export const VotingAnswers = ({ players, hideResults }: Props) => {
    return (
        <div className="flex h-screen w-screen items-center justify-center bg-black">
            <div className="flex w-full flex-wrap items-center justify-center gap-6 rounded-lg bg-white p-8 shadow-lg">
                {players &&
                    players.map((player, index) => {
                        return <VoteCard key={player.id} player={player} hideResults={hideResults} />;
                    })}
            </div>
        </div>
    );
};
