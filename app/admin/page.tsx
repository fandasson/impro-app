import { format } from "date-fns";
import { cookies } from "next/headers";
import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { createClient } from "@/utils/supabase/server";

export default async function Performances() {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const { data: performances, error } = await supabase.from("performances").select("*");

    if (performances === null) {
        throw new Error("Error when fetching performances.");
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
                            <TableCell>{format(new Date(performance.date), "dd. MM. yyyy")}</TableCell>
                            <TableCell>{performance.state}</TableCell>
                            <TableCell>
                                <Link href={`/admin/performances/${performance.id}`}>
                                    <Button>Otevřít</Button>
                                </Link>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    );
}
