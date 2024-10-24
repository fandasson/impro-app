import { Character, Player } from "@/api/types.api";

type Props = {
    player: Player;
    character?: Character;
};
export const PlayerMatch = ({ player, character }: Props) => {
    return (
        <div className={"flex justify-between rounded border px-3 py-3"}>
            <strong>{player.name}</strong>
            <span>{" -> "}</span>
            <div>{character?.name ?? "?"}</div>
        </div>
    );
};
