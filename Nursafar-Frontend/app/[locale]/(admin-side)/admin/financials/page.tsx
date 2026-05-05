"use client";

import { useTranslations } from "next-intl";
import { DollarSign } from "lucide-react";
import { useGetTransactionsQuery } from "@/lib/api/adminApi";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

function StatusBadge({ status }: { status: string }) {
  if (status === "SUCCESS") return <Badge variant="success">Completed</Badge>;
  if (status === "CANCELLED") return <Badge variant="destructive">Cancelled</Badge>;
  return <Badge variant="secondary">Pending</Badge>;
}

function TypeBadge({ type }: { type: string }) {
  if (type === "TOUR") return <Badge variant="default">Tour Booking</Badge>;
  return <Badge variant="gold">Donation</Badge>;
}

export default function FinancialsPage() {
  const t = useTranslations("admin");
  const tCommon = useTranslations("common");
  const { data: transactions, isLoading } = useGetTransactionsQuery();

  const totalRevenue = transactions?.reduce((sum, tx) => sum + tx.amount, 0) ?? 0;

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <DollarSign className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">{t("financials")}</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {transactions?.length ?? 0} transactions
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">{t("total_revenue")}</p>
          <p className="text-2xl font-bold text-emerald-500">${totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      <div className="rounded-xl border bg-card">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground text-sm">{tCommon("loading")}</div>
        ) : !transactions || transactions.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-muted-foreground">{t("no_transactions")}</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("transaction_id")}</TableHead>
                <TableHead>{t("user")}</TableHead>
                <TableHead>{t("description")}</TableHead>
                <TableHead>{t("type")}</TableHead>
                <TableHead>{t("amount")}</TableHead>
                <TableHead>{t("status")}</TableHead>
                <TableHead>{t("date")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {tx.id.slice(0, 8)}…
                  </TableCell>
                  <TableCell className="font-medium">{tx.user}</TableCell>
                  <TableCell className="text-muted-foreground max-w-[200px] truncate">
                    {tx.description}
                  </TableCell>
                  <TableCell>
                    <TypeBadge type={tx.type} />
                  </TableCell>
                  <TableCell className="font-semibold">
                    ${tx.amount.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={tx.status} />
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(tx.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
