import Link from "next/link";

import type { Player } from "@/api/types.api";
import { PlayerAvatar } from "@/components/admin/players/PlayerAvatar";
import { PlayerName } from "@/components/admin/players/PlayerName";
import { Button } from "@/components/ui/Button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";

type Props = {
    players: Player[];
};

export function PlayerList({ players }: Props) {
    if (players.length === 0) {
        return (
            <div className="py-12 text-center">
                <p className="text-gray-500">Zatím žádní improvizátoři</p>
                <Button className="mt-4" asChild>
                    <Link href="/admin/players/new">Vytvořit prvního improvizátora</Link>
                </Button>
            </div>
        );
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Improvizátor</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {players.map((player) => (
                    <TableRow key={player.id}>
                        <TableCell>
                            <Link href={`/admin/players/${player.id}/edit`}>
                            <div className="flex items-center gap-3">
                                <PlayerAvatar player={player} />
                                <span>
                                    <PlayerName player={player} />
                                </span>
                            </div>
                            </Link>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
