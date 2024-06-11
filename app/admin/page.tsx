import { cookies } from "next/headers";
import Link from "next/link";

import { fetchPerformances } from "@/api/performances.api";
import { Button } from "@/components/ui/Button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { formatDate } from "@/utils/date.utils";
import { createClient } from "@/utils/supabase/server";

export default async function Performances() {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const { data: performances, error } = await supabase
        .from("performances")
        .select("*")
        .order("date", { ascending: false });
    const { data: performances, error } = await fetchPerformances();

    if (performances === null) {
        throw new Error(`Error when fetching performances: ${error.message}`);
    }

    return (
        <>
            <h1 className="mb-4 text-4xl font-bold">Představení</h1>
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
