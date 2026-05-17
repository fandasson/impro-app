import Link from "next/link";
import { redirect } from "next/navigation";

import { fetchPlayers } from "@/api/players.api";
import { PlayerList } from "@/components/admin/players/PlayerList";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/utils/supabase/server";

export default async function Players() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const result = await fetchPlayers();

    if (!result.success) {
        throw new Error(`Chyba při načítání improvizátorů: ${result.error}`);
    }

    return (
        <>
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-4xl font-bold">Improvizátoři</h1>
                <Button asChild>
                    <Link href="/admin/players/new">Přidat improvizátora</Link>
                </Button>
            </div>
            <PlayerList players={result.data} />
        </>
    );
}
