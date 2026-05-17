import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { createPlayer } from "@/api/players.api";
import { PlayerForm } from "@/components/admin/players/PlayerForm";
import { Button } from "@/components/ui/Button";

export default function NewPlayerPage() {
    async function handleCreate(prevState: unknown, formData: FormData) {
        "use server";
        const result = await createPlayer({
            name: formData.get("name") as string,
            surname: (formData.get("surname") as string) || undefined,
            motto: (formData.get("motto") as string) || undefined,
            quest: formData.get("quest") === "true",
        });

        if (result.success) {
            redirect(`/admin/players/${result.data.id}/edit`);
        }

        return result;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" asChild className="h-auto">
                    <Link href="/admin/players">
                        <ChevronLeft size={28} />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold">Nový improvizátor</h1>
                    <p className="mt-2 text-gray-400">
                        Vytvořte nového improvizátora a po vytvoření přidejte fotografie
                    </p>
                </div>
            </div>

            <PlayerForm action={handleCreate} submitLabel="Přidat improvizátora" />
        </div>
    );
}
