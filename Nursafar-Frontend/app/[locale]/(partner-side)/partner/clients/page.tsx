"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { useGetPartnerClientsQuery } from "@/lib/api/partnerApi";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const statusVariant: Record<string, "success" | "default" | "destructive" | "secondary"> = {
  PAID: "success",
  CONFIRMED: "default",
  PENDING: "secondary",
  CANCELLED: "destructive",
};

export default function ClientsPage() {
  const t = useTranslations("partner");
  const tCommon = useTranslations("common");
  const { data: clients, isLoading } = useGetPartnerClientsQuery();

  return (
    <div className="max-w-5xl space-y-6">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6 text-emerald-600" />
          <div>
            <h1 className="text-2xl font-bold">{t("clients")}</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {clients?.length ?? 0} pilgrim{(clients?.length ?? 0) !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border bg-card overflow-hidden"
      >
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground text-sm">{tCommon("loading")}</div>
        ) : !clients || clients.length === 0 ? (
          <div className="p-16 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="font-medium text-muted-foreground">{t("no_clients")}</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("client_name")}</TableHead>
                <TableHead>{t("phone")}</TableHead>
                <TableHead>{t("tour_name")}</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>{t("booking_status")}</TableHead>
                <TableHead>{t("booked_at")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client, i) => (
                <motion.tr
                  key={client.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b transition-colors hover:bg-muted/50"
                >
                  <TableCell>
                    <p className="font-medium">{client.user.name}</p>
                    <p className="text-xs text-muted-foreground">{client.user.email}</p>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{client.user.phone}</TableCell>
                  <TableCell className="font-medium max-w-[200px] truncate">{client.tour.title}</TableCell>
                  <TableCell className="font-semibold text-emerald-600">
                    ${client.tour.price.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[client.status] ?? "secondary"}>
                      {client.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(client.createdAt).toLocaleDateString()}
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        )}
      </motion.div>
    </div>
  );
}
