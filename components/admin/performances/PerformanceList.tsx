import Link from "next/link";
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import { Button } from "@/components/ui/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import type { Performance } from "@/api/types.api";

type PerformanceListProps = {
  performances: Performance[];
};

const stateLabels: Record<string, string> = {
  draft: "Koncept",
  intro: "Úvod",
  life: "Živě",
  closing: "Závěr",
  finished: "Ukončeno",
};

const stateColors: Record<string, string> = {
  draft: "bg-gray-200 text-gray-800",
  intro: "bg-blue-200 text-blue-800",
  life: "bg-green-200 text-green-800",
  closing: "bg-yellow-200 text-yellow-800",
  finished: "bg-slate-200 text-slate-800",
};

export function PerformanceList({ performances }: PerformanceListProps) {
  if (performances.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Zatím žádná představení</p>
        <Link href="/admin/performances/new">
          <Button className="mt-4">Vytvořit první představení</Button>
        </Link>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Název</TableHead>
          <TableHead>Datum</TableHead>
          <TableHead>Stav</TableHead>
          <TableHead className="text-right">Akce</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {performances.map((performance) => (
          <TableRow key={performance.id}>
            <TableCell className="font-medium">{performance.name}</TableCell>
            <TableCell>
              {format(new Date(performance.date), "d. MMMM yyyy, HH:mm", {
                locale: cs,
              })}
            </TableCell>
            <TableCell>
              <Badge
                className={stateColors[performance.state] || "bg-gray-200"}
              >
                {stateLabels[performance.state] || performance.state}
              </Badge>
            </TableCell>
            <TableCell className="text-right space-x-2">
              <Link href={`/admin/performances/${performance.id}`}>
                <Button variant="outline" size="sm">
                  Detail
                </Button>
              </Link>
              <Link href={`/admin/performances/${performance.id}/edit`}>
                <Button variant="outline" size="sm">
                  Upravit
                </Button>
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
