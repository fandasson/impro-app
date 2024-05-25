import { PlayerWithPhotos, VotedPlayer } from "@/api/types.api";
import { VoteCard } from "@/components/audience/answers/VoteCard";

type Props = {
    players: VotedPlayer<PlayerWithPhotos>[];
    hideResults: boolean;
};
export const VotingAnswers = ({ players, hideResults }: Props) => {
    return (
        <div className="flex h-screen items-center justify-center">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
                {players &&
                    players.map((player, index) => {
                        return <VoteCard key={player.id} player={player} hideResults={hideResults} />;
                    })}
            </div>
        </div>
    );
};
