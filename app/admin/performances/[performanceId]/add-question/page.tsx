import { ChevronLeft } from "lucide-react";
import Link from "next/link";

import { QuestionForm } from "@/components/admin/question-form";
import { Button } from "@/components/ui/Button";

export default async function AddQuestion({ params }: { params: { performanceId: string } }) {
    const performanceId = parseInt(params.performanceId);

    return (
        <>
            <header className={"mb-4 flex items-center gap-2"}>
                <Button variant="ghost" size="icon" asChild>
                    <Link href={`/admin/performances/${performanceId}`}>
                        <ChevronLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <h1 className="text-2xl font-bold">Nová otázka</h1>
            </header>
            <article className={"pb-8"}>
                <QuestionForm performanceId={performanceId} />
            </article>
        </>
    );
}
