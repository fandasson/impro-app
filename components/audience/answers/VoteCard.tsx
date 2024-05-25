import { PlayerWithPhotos, VotedPlayer } from "@/api/types.api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";

type Props = {
    player: VotedPlayer<PlayerWithPhotos>;
    hideResults: boolean;
};

export const VoteCard = ({ player, hideResults }: Props) => {
    return (
        <div className="flex flex-col items-center justify-center ">
            <Avatar className="h-30 w-30 mb-4">
                <AvatarImage alt={player.name} src={player.photos.profile} />
                <AvatarFallback>?</AvatarFallback>
            </Avatar>
            <div className="text-center text-white">
                <h3 className="mb-2 text-2xl font-bold">{player.name}</h3>
                <span className="text-6xl font-bold">{hideResults ? "???" : player.count}</span>
            </div>
        </div>
    );
};
