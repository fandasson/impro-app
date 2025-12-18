"use client";

import { useActionState, useState } from "react";
import {
  assignPlayerToPerformance,
  removePlayerFromPerformance,
  type Player,
} from "@/api/performances.api";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";

type PlayerAssignmentProps = {
  performanceId: number;
  assignedPlayers: Player[];
  availablePlayers: Player[];
};

// Formats player display name: "Name Surname" with optional "(host)" suffix
// Shows surname if available, appends "(host)" for guest performers (quest=true)
function formatPlayerName(player: Player): string {
  const fullName = player.surname
    ? `${player.name} ${player.surname}`
    : player.name;
  return player.quest ? `${fullName} (host)` : fullName;
}

export function PlayerAssignment({
  performanceId,
  assignedPlayers,
  availablePlayers,
}: PlayerAssignmentProps) {
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>("");
  const [isAssigning, setIsAssigning] = useState(false);
  const [removingPlayerId, setRemovingPlayerId] = useState<number | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Get players not already assigned
  const unassignedPlayers = availablePlayers.filter(
    (player) => !assignedPlayers.some((ap) => ap.id === player.id),
  );

  async function handleAssign() {
    if (!selectedPlayerId) return;

    setIsAssigning(true);
    const result = await assignPlayerToPerformance({
      performance_id: performanceId,
      player_id: parseInt(selectedPlayerId),
    });
    setIsAssigning(false);

    if (result.success) {
      setMessage({ type: "success", text: "Hráč byl přiřazen" });
      setSelectedPlayerId("");
      setTimeout(() => setMessage(null), 3000);
    } else {
      setMessage({ type: "error", text: result.error });
      setTimeout(() => setMessage(null), 5000);
    }
  }

  async function handleRemove(playerId: number) {
    setRemovingPlayerId(playerId);
    const result = await removePlayerFromPerformance({
      performance_id: performanceId,
      player_id: playerId,
    });
    setRemovingPlayerId(null);

    if (result.success) {
      setMessage({ type: "success", text: "Hráč byl odstraněn" });
      setTimeout(() => setMessage(null), 3000);
    } else {
      setMessage({ type: "error", text: result.error });
      setTimeout(() => setMessage(null), 5000);
    }
  }

  return (
    <div className="space-y-6">
      {/* Message Display */}
      {message && (
        <div
          role={message.type === "error" ? "alert" : "status"}
          aria-live="polite"
          className={`p-4 border rounded ${
            message.type === "success"
              ? "bg-green-950 border-green-800"
              : "bg-red-950 border-red-800"
          }`}
        >
          <p
            className={`text-sm ${
              message.type === "success" ? "text-green-200" : "text-red-200"
            }`}
          >
            {message.text}
          </p>
        </div>
      )}

      {/* Add Player Section */}
      <div>
        <Label htmlFor="player-select">Přidat hráče</Label>
        <div className="flex gap-2 mt-2">
          <Select value={selectedPlayerId} onValueChange={setSelectedPlayerId}>
            <SelectTrigger className="flex-1" aria-label="Výběr hráče">
              <SelectValue placeholder="Vyberte hráče" />
            </SelectTrigger>
            <SelectContent>
              {unassignedPlayers.length === 0 ? (
                <SelectItem value="" disabled>
                  Všichni hráči jsou již přiřazeni
                </SelectItem>
              ) : (
                unassignedPlayers.map((player) => (
                  <SelectItem key={player.id} value={player.id.toString()}>
                    {formatPlayerName(player)}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          <Button
            type="button"
            onClick={handleAssign}
            disabled={!selectedPlayerId || isAssigning}
            aria-label="Přidat vybraného hráče"
          >
            {isAssigning ? "Přidávání..." : "Přidat"}
          </Button>
        </div>
      </div>

      {/* Assigned Players List */}
      <div>
        <Label>Přiřazení hráči ({assignedPlayers.length})</Label>
        {assignedPlayers.length === 0 ? (
          <p className="text-sm text-gray-500 mt-2">
            Zatím nejsou přiřazeni žádní hráči
          </p>
        ) : (
          <ul className="mt-2 space-y-2" role="list" aria-label="Seznam přiřazených hráčů">
            {assignedPlayers.map((player) => (
              <li
                key={player.id}
                className="flex items-center justify-between p-3 bg-gray-900 rounded border border-gray-700"
              >
                <span className="font-medium">{formatPlayerName(player)}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemove(player.id)}
                  disabled={removingPlayerId === player.id}
                  aria-label={`Odebrat hráče ${formatPlayerName(player)}`}
                >
                  {removingPlayerId === player.id ? "Odebírání..." : "Odebrat"}
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
