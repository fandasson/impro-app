import { Tables } from "@/utils/supabase/entity.types";

type Props = {
    player: Tables<"players">;
    name?: string;
};
export const PlayerMatch = ({ player, name }: Props) => {
    return (
        <div className={"flex justify-between rounded border px-3 py-3"}>
            <strong>{player.name}</strong>
            <span>{" -> "}</span>
            <div>{name ?? "?"}</div>
        </div>
    );
};
