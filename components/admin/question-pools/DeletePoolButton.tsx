"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { deletePool } from "@/api/question-pools.api";
import type { QuestionPool } from "@/api/types.api";
import { Button } from "@/components/ui/Button";

type Props = {
    pool: QuestionPool;
};

export const DeletePoolButton = ({ pool }: Props) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDelete = async () => {
        setLoading(true);
        setError(null);
        const result = await deletePool(pool.id, pool.performance_id);
        if (result.success) {
            router.push(`/admin/performances/${pool.performance_id}/question-pools`);
        } else {
            setError(result.error);
            setLoading(false);
        }
    };

    return (
        <div className={"flex flex-col gap-2"}>
            <Button variant="outline" className={"border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive"} onClick={handleDelete} disabled={loading}>
                <Trash2 size={16} />
                {loading ? "Mazání…" : "Smazat skupinu"}
            </Button>
            {error && (
                <p className={"text-sm text-destructive"} role="alert">
                    {error}
                </p>
            )}
        </div>
    );
};
