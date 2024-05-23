import { VotedPlayer } from "@/api/types.api";
import { cn } from "@/utils/styling.utils";

type Props = {
    players: VotedPlayer[];
};
export const VotingAnswers = ({ players }: Props) => {
    return (
        <div className={"grid grid-cols-1 gap-4 text-2xl"}>
            {players &&
                players.map((player, index) => {
                    return (
                        <div
                            key={player.id}
                            className={cn(
                                "flex justify-between gap-16 rounded-md p-4",
                                index === 0 ? "border" : undefined,
                            )}
                        >
                            <h2 className={"font-medium"}>{player.name}</h2>
                            {player.count}
                        </div>
                    );
                })}
        </div>
    );
};
