import { useEffect, useMemo, useState } from "react";

import { fetchAvailablePlayers } from "@/api/performances.api";
import { getPlayerPhotos } from "@/api/photos.api";
import type { PlayerWithPhotos } from "@/api/types.api";
import { Button } from "@/components/ui/Button";
import { Paragraph } from "@/components/ui/Paragraph";
import { PlayerCard } from "@/components/users/questions/PlayersVotingQuestion/PlayerCard";
import { VotedOverlay } from "@/components/users/questions/PlayersVotingQuestion/VotedOverlay";
import { useUsersStore } from "@/store/users.store";
import { shufflePlayers } from "@/utils/data.utils";
import { cn } from "@/utils/styling.utils";

type Props = {
    onComplete: () => void;
    hasMottoQuestion: boolean;
};

export const OnboardingPracticeQuestion = ({ onComplete, hasMottoQuestion }: Props) => {
    const [players, setPlayers] = useState<PlayerWithPhotos[]>([]);
    const [selectedPlayer, setSelectedPlayer] = useState<number>();
    const [overlayPlayer, setOverlayPlayer] = useState<PlayerWithPhotos | null>(null);
    const [loading, setLoading] = useState(true);
    const performance = useUsersStore((state) => state.performance);

    useEffect(() => {
        if (performance) {
            fetchAvailablePlayers(performance.id)
                .then((fetchedPlayers) => {
                    const playersWithPhotos = fetchedPlayers.map((player) => {
                        const photos = getPlayerPhotos(player.id);
                        return {
                            ...player,
                            photos,
                            count: 0,
                        } as PlayerWithPhotos;
                    });
                    setPlayers(playersWithPhotos);
                })
                .catch((error) => {
                    console.error("Error fetching players:", error);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [performance]);

    const handleSelect = (player: PlayerWithPhotos) => {
        setSelectedPlayer(player.id);
        if (hasMottoQuestion) {
            setOverlayPlayer(player);
        }
    };

    const shuffledPlayers = useMemo(() => shufflePlayers(players), [players]);

    const rows = Math.ceil(shuffledPlayers.length / 2) || 1;

    if (loading) {
        return (
            <div className="flex h-full flex-col items-center justify-center">
                <p>Načítám...</p>
            </div>
        );
    }

    return (
        <>
            <h2 className="text-2xl font-bold">Ukázka hlasování</h2>
            <Paragraph>
                Takhle bude vypadat hlasování. Improvizátoři se zobrazí v náhodném pořadí. Stačí kliknout. Vybraný se
                označí bíle.
            </Paragraph>
            <Paragraph>Rozhodnutí můžete libovolně měnit dokud moderátor neukončí hlasování.</Paragraph>
            <Paragraph>Odpovědi není třeba potvrzovat žádným tlačítkem.</Paragraph>

            {shuffledPlayers && (
                <div
                    className={cn("grid grid-cols-2 items-center justify-center gap-x-2 gap-y-4", `grid-rows-${rows}`)}
                >
                    {shuffledPlayers.map((player) => (
                        <PlayerCard
                            player={{ ...player, count: 0 }}
                            key={player.id}
                            hideResults={true}
                            selected={selectedPlayer === player.id}
                            onClick={() => handleSelect(player)}
                            heightFraction={rows}
                        />
                    ))}
                </div>
            )}

            <div className="mt-4 flex flex-col items-center gap-4">
                <Paragraph className={"italic"}>Nezapomeňte. Žádné tlačítko na odeslání odpovědi.</Paragraph>
                <Button onClick={onComplete} className="w-full">
                    Chápu. Jsem připraven/a si užít představení 💪
                </Button>
            </div>

            {overlayPlayer && (
                <VotedOverlay
                    key={overlayPlayer.id}
                    questionName="Ukázka hlasování"
                    player={overlayPlayer}
                    onDismiss={() => setOverlayPlayer(null)}
                />
            )}
        </>
    );
};
