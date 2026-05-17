import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { fetchPlayer, updatePlayer } from "@/api/players.api";
import { PlayerForm } from "@/components/admin/players/PlayerForm";
import { PlayerName } from "@/components/admin/players/PlayerName";
import { PlayerPhotos } from "@/components/admin/players/PlayerPhotos";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/utils/supabase/server";

export default async function EditPlayerPage({ params }: { params: Promise<{ playerId: string }> }) {
    const { playerId } = await params;
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const result = await fetchPlayer(parseInt(playerId));

    if (!result.success) {
        notFound();
    }

    const player = result.data;

    async function handleUpdate(prevState: unknown, formData: FormData) {
        "use server";
        const result = await updatePlayer({
            id: player.id,
            name: formData.get("name") as string,
            surname: (formData.get("surname") as string) || null,
            motto: (formData.get("motto") as string) || null,
            quest: formData.get("quest") === "true",
        });

        if (result.success) {
            redirect(`/admin/players/${player.id}/edit`);
        }

        return result;
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" asChild className="h-auto">
                    <Link href="/admin/players">
                        <ChevronLeft size={28} />
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold">
                    <PlayerName player={player} />
                </h1>
            </div>

            <div>
                <h2 className="mb-4 text-xl font-semibold">Údaje hráče</h2>
                <PlayerForm initialData={player} action={handleUpdate} submitLabel="Uložit změny" />
            </div>

            <div className="rounded-lg border border-border p-6">
                <PlayerPhotos player={player} />
            </div>
        </div>
    );
}
