import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { fetchAllPlayers, fetchPerformanceWithPlayers, updatePerformance } from "@/api/performances.api";
import { PerformanceForm } from "@/components/admin/performances/PerformanceForm";
import { PlayerAssignment } from "@/components/admin/performances/PlayerAssignment";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/utils/supabase/server";

export default async function EditPerformancePage({ params }: { params: Promise<{ performanceId: string }> }) {
    const { performanceId } = await params;
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const performanceResult = await fetchPerformanceWithPlayers(parseInt(performanceId));

    if (!performanceResult.success) {
        throw new Error(`Failed to load performance: ${performanceResult.error}`);
    }

    const playersResult = await fetchAllPlayers();
    const allPlayers = playersResult.success ? playersResult.data : [];

    const performance = performanceResult.data;

    async function handleUpdate(prevState: unknown, formData: FormData) {
        "use server";
        const result = await updatePerformance({
            id: performance.id,
            name: formData.get("name") as string,
            date: formData.get("date") as string,
            intro_text: formData.get("intro_text") as string,
            url_slug: formData.get("url_slug") as string,
            state: formData.get("state") as any,
        });

        if (result.success) {
            redirect(`/admin/performances/${performance.id}`);
        }

        return result;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-stretch">
                <Button variant="ghost" size="icon" asChild className="h-auto">
                    <Link href={`/admin/performances/${performance.id}`}>
                        <ChevronLeft size={28} />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold">Upravit představení</h1>
                    <p className="mt-2 text-gray-300">{performance.name}</p>
                </div>
            </div>

            <PerformanceForm initialData={performance} action={handleUpdate} submitLabel="Uložit změny" />

            <div className="mt-8 rounded-lg border border-gray-800 bg-gray-950 p-6">
                <h2 className="mb-4 text-xl font-semibold">Správa hráčů</h2>
                <PlayerAssignment
                    performanceId={performance.id}
                    assignedPlayers={performance.players}
                    availablePlayers={allPlayers}
                />
            </div>
        </div>
    );
}
