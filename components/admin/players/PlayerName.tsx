import type { Player } from "@/api/types.api";

type Props = {
    player: Player;
};

export function PlayerName({ player }: Props) {
    return (
        <>
            <strong>{player.name}</strong>
            {player.surname ? ` ${player.surname}` : ""}
            {player.quest ? " - host" : ""}
        </>
    );
}
