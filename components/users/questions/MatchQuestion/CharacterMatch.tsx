import { Character, Player } from "@/api/types.api";

type Props = {
    character: Character;
    player?: Player;
};
export const CharacterMatch = ({ character, player }: Props) => {
    return (
        <div className={"flex justify-between rounded border px-3 py-3"}>
            <strong>{character.name}</strong>
            <span>{" -> "}</span>
            <div>{player?.name ?? "?"}</div>
        </div>
    );
};
