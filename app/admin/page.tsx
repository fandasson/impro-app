import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import { fetchPerformances } from "@/api/performances.api";
import { Button } from "@/components/ui/Button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { formatDate } from "@/utils/date.utils";
import { createClient } from "@/utils/supabase/server";

export default async function Performances() {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
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
                <Button asChild>
                    <Link href="/admin/performances/new">Vytvořit představení</Link>
                </Button>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Jméno</TableHead>
                        <TableHead>Datum</TableHead>
                        <TableHead className="w-[100px]">Stav</TableHead>
                        <TableHead />
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {performances.map((performance) => (
                        <TableRow key={performance.id}>
                            <TableCell>{performance.name}</TableCell>
                            <TableCell>{formatDate(performance.date)}</TableCell>
                            <TableCell>{performance.state}</TableCell>
                            <TableCell>
                                <Button asChild>
                                    <Link href={`/admin/performances/${performance.id}`}>Otevřít</Link>
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    );
}
