import Link from "next/link";
import { redirect } from "next/navigation";

import { fetchPerformances } from "@/api/performances.api";
import { PerformanceList } from "@/components/admin/performances/PerformanceList";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/utils/supabase/server";

export default async function Performances() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: performances, error } = await fetchPerformances();

    if (performances === null) {
        throw new Error(`Error when fetching performances: ${error.message}`);
    }

    return (
        <>
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-4xl font-bold">Představení</h1>
                <div className="flex gap-2">
                    <Button variant="outline" asChild>
                        <Link href="/admin/players">Improvizátoři</Link>
                    </Button>
                    <Button asChild>
                        <Link href="/admin/performances/new">Vytvořit představení</Link>
                    </Button>
                </div>
            </div>
            <PerformanceList performances={performances} />
        </>
    );
}
