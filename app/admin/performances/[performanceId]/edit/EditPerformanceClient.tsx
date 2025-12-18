"use client";

import { useRouter } from "next/navigation";
import { PerformanceForm } from "@/components/admin/performances/PerformanceForm";
import { PlayerAssignment } from "@/components/admin/performances/PlayerAssignment";
import { updatePerformance, type Player } from "@/api/performances.api";
import type { Performance } from "@/api/types.api";

type EditPerformanceClientProps = {
  performance: Performance;
  assignedPlayers: Player[];
  availablePlayers: Player[];
};

export function EditPerformanceClient({
  performance,
  assignedPlayers,
  availablePlayers,
}: EditPerformanceClientProps) {
  const router = useRouter();

  async function handleUpdate(prevState: any, formData: FormData) {
    // Parse datetime-local value from form input (format: "2025-12-18T13:02")
    const dateTimeLocal = formData.get("date") as string;
    // Append ":00" seconds for reliable Date parsing, then convert to UTC ISO string
    // Without seconds, Date constructor may parse inconsistently across browsers
    const dateISO = new Date(dateTimeLocal + ":00").toISOString();

    const result = await updatePerformance({
      id: performance.id,
      name: formData.get("name") as string,
      date: dateISO,
      intro_text: formData.get("intro_text") as string,
      url_slug: formData.get("url_slug") as string,
      state: formData.get("state") as any,
    });

    if (result.success) {
      // Success - redirect to performance detail
      router.push(`/admin/performances/${performance.id}`);
      return { ...result, successMessage: "Představení bylo aktualizováno" };
    }

    return result;
  }

  return (
    <>
      <PerformanceForm
        initialData={performance}
        action={handleUpdate}
        submitLabel="Uložit změny"
      />

      {/* Player Assignment Section */}
      <div className="mt-8 p-6 bg-gray-950 rounded-lg border border-gray-800">
        <h2 className="text-xl font-semibold mb-4">Správa hráčů</h2>
        <PlayerAssignment
          performanceId={performance.id}
          assignedPlayers={assignedPlayers}
          availablePlayers={availablePlayers}
        />
      </div>
    </>
  );
}
