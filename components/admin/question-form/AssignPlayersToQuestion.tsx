import React, { useState } from "react";

import { Player } from "@/api/types.api";
import { Badge } from "@/components/ui/Badge";

type Props = {
    players: Player[];
    handlePlayersChange: (players: Player[]) => void;
    initialSelectedPlayers?: Player[];
    disabled: boolean;
};
export const AssignPlayersToQuestion = (props: Props) => {
    const { players, handlePlayersChange, initialSelectedPlayers = [], disabled } = props;
    const [selectedPlayers, setSelectedPlayers] = useState<Player[]>(initialSelectedPlayers);

    const handlePlayerClick = (player: Player) => {
        if (disabled) {
            return;
        }
        const index = selectedPlayers.findIndex((p) => p.id === player.id);
        let newList = [];
        if (index === -1) {
            newList = [...selectedPlayers, player];
        } else {
            newList = selectedPlayers.filter(({ id }) => id !== player.id);
        }
        setSelectedPlayers(newList);
        handlePlayersChange(newList);
    };

    const selectedPlayersIds = selectedPlayers.map(({ id }) => id);
    return (
        <div className={"grid grid-cols-2 gap-4"}>
            {players.map((player) => {
                return (
                    <Badge
                        key={player.id}
                        variant={`${selectedPlayersIds.includes(player.id) ? "default" : "outline"}`}
                        className={"justify-center p-5 text-lg uppercase"}
                        onClick={() => handlePlayerClick(player)}
                    >
                        {player.name}
                    </Badge>
                );
            })}
        </div>
    );
};
