import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { createPerformance } from "@/api/performances.api";
import { PerformanceForm } from "@/components/admin/performances/PerformanceForm";
import { Button } from "@/components/ui/Button";

export default function NewPerformancePage() {
    async function handleCreate(prevState: unknown, formData: FormData) {
        "use server";
        const result = await createPerformance({
            name: formData.get("name") as string,
            date: formData.get("date") as string,
            intro_text: formData.get("intro_text") as string,
            url_slug: formData.get("url_slug") as string,
            state: (formData.get("state") as any) || "draft",
        });

        if (result.success) {
            redirect("/admin");
        }

        return result;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" asChild className="h-auto">
                    <Link href="/admin">
                        <ChevronLeft size={28} />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold">Nové představení</h1>
                    <p className="mt-2 text-gray-400">Vytvořte nové představení a nastavte základní informace</p>
                </div>
            </div>

            <PerformanceForm action={handleCreate} submitLabel="Vytvořit" />
        </div>
    );
}
