import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import {
  fetchPerformanceWithPlayers,
  fetchAllPlayers,
} from "@/api/performances.api";
import { TabletContainer } from "@/components/ui/layout/TabletContainer";
import { Button } from "@/components/ui/Button";
import { EditPerformanceClient } from "./EditPerformanceClient";

export default async function EditPerformancePage({
  params,
}: {
  params: Promise<{ performanceId: string }>;
}) {
  const { performanceId } = await params;
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Auth check
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch performance with players
  const performanceResult = await fetchPerformanceWithPlayers(
    parseInt(performanceId)
  );

  if (!performanceResult.success) {
    throw new Error(
      `Failed to load performance: ${performanceResult.error}`
    );
  }

  // Fetch all available players
  const playersResult = await fetchAllPlayers();
  const allPlayers = playersResult.success ? playersResult.data : [];

  return (
    <TabletContainer>
      <div className="space-y-6">
        <div className="flex items-stretch">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="h-auto"
          >
            <Link
              href={`/admin/performances/${performanceResult.data.id}`}
            >
              <ChevronLeft size={28} />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Upravit představení</h1>
            <p className="text-gray-300 mt-2">
              {performanceResult.data.name}
            </p>
          </div>
        </div>

        <EditPerformanceClient
          performance={performanceResult.data}
          assignedPlayers={performanceResult.data.players}
          availablePlayers={allPlayers}
        />
      </div>
    </TabletContainer>
  );
}
