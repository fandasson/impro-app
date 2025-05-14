import { PlayerWithPhotos } from "@/api/types.api";

export const shufflePlayers = (players: PlayerWithPhotos[]) => {
    if (!players.length) return [];
    const shuffledPlayers = [...players];
    for (let i = shuffledPlayers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledPlayers[i], shuffledPlayers[j]] = [shuffledPlayers[j], shuffledPlayers[i]];
    }
    return shuffledPlayers;
};
