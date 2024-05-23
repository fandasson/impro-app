import { PlayerWithPhotos, VotedPlayer } from "@/api/types.api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";

type Props = {
    player: VotedPlayer<PlayerWithPhotos>;
};

export const VoteCard = ({ player }: Props) => {
    return (
        <div className="opacity-05 flex flex-col items-center justify-center rounded-lg bg-white p-4 shadow-md">
            <Avatar className="h-30 w-30 mb-4">
                <AvatarImage alt={player.name} src={player.photos.profile} />
                <AvatarFallback>?</AvatarFallback>
            </Avatar>
            <div className="text-center">
                <h3 className="mb-2 text-2xl font-bold text-black">{player.name}</h3>
                <span className="text-6xl font-bold text-black">{player.count}</span>
            </div>
        </div>
    );
};
