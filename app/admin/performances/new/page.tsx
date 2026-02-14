"use client";

import { useRouter } from "next/navigation";
import { PerformanceForm } from "@/components/admin/performances/PerformanceForm";
import { createPerformance } from "@/api/performances.api";
import { TabletContainer } from "@/components/ui/layout/TabletContainer";

export default function NewPerformancePage() {
  const router = useRouter();

  async function handleCreate(prevState: any, formData: FormData) {
    const result = await createPerformance({
      name: formData.get("name") as string,
      date: formData.get("date") as string,
      intro_text: formData.get("intro_text") as string,
      url_slug: formData.get("url_slug") as string,
      state: (formData.get("state") as any) || "draft",
    });

    if (result.success) {
      // Success - redirect to admin
      router.push("/admin");
      return { ...result, successMessage: "Představení bylo vytvořeno" };
    }

    return result;
  }

  return (
    <TabletContainer>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Nové představení</h1>
          <p className="text-gray-600 mt-2">
            Vytvořte nové představení a nastavte základní informace
          </p>
        </div>

        <PerformanceForm action={handleCreate} submitLabel="Vytvořit" />
      </div>
    </TabletContainer>
  );
}
