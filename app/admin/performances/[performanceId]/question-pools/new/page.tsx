import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { createPool } from "@/api/question-pools.api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

export default async function NewQuestionPool(props: { params: Promise<{ performanceId: string }> }) {
    const params = await props.params;
    const performanceId = parseInt(params.performanceId);

    async function handleSubmit(formData: FormData) {
        "use server";
        const name = formData.get("name") as string;
        const result = await createPool(performanceId, name);
        if (result.success) {
            redirect(`/admin/performances/${performanceId}/question-pools/${result.data.id}`);
        }
    }

    return (
        <>
            <header className={"mb-4 flex items-center gap-2"}>
                <Button variant="ghost" size="icon" asChild>
                    <Link href={`/admin/performances/${performanceId}/question-pools`}>
                        <ChevronLeft size={28} />
                    </Link>
                </Button>
                <h1 className="text-2xl font-bold">Nová skupina otázek</h1>
            </header>
            <article className={"pb-8"}>
                <form action={handleSubmit} className={"flex flex-col gap-4"}>
                    <div className={"flex flex-col gap-2"}>
                        <Label htmlFor="name">Název skupiny</Label>
                        <Input id="name" name="name" required maxLength={255} autoFocus />
                    </div>
                    <div>
                        <Button type="submit">Vytvořit skupinu</Button>
                    </div>
                </form>
            </article>
        </>
    );
}
