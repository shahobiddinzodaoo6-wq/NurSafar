"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { CheckCircle, XCircle, ShieldCheck } from "lucide-react";
import {
  useGetPendingPartnersQuery,
  useApprovePartnerMutation,
  useRejectPartnerMutation,
} from "@/lib/api/adminApi";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/lib/hooks/use-toast";

function Toast({ message, variant }: { message: string; variant: "success" | "error" }) {
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium shadow-lg animate-in slide-in-from-bottom-2 ${
        variant === "success" ? "bg-green-500 text-white" : "bg-destructive text-destructive-foreground"
      }`}
    >
      {message}
    </div>
  );
}

export default function PartnersPage() {
  const t = useTranslations("admin");
  const tCommon = useTranslations("common");
  const { data: partners, isLoading } = useGetPendingPartnersQuery();
  const [approvePartner, { isLoading: isApproving }] = useApprovePartnerMutation();
  const [rejectPartner, { isLoading: isRejecting }] = useRejectPartnerMutation();
  const { toasts, toast } = useToast();
  const [processingId, setProcessingId] = useState<string | null>(null);

  async function handleApprove(id: string) {
    setProcessingId(id);
    try {
      await approvePartner(id).unwrap();
      toast(t("approve_success"), "success");
    } catch {
      toast(tCommon("error"), "error");
    } finally {
      setProcessingId(null);
    }
  }

  async function handleReject(id: string) {
    setProcessingId(id);
    try {
      await rejectPartner(id).unwrap();
      toast(t("reject_success"), "success");
    } catch {
      toast(tCommon("error"), "error");
    } finally {
      setProcessingId(null);
    }
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center gap-3">
        <ShieldCheck className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">{t("partners")}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {partners?.length ?? 0} pending
          </p>
        </div>
      </div>

      <div className="rounded-xl border bg-card">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground text-sm">{tCommon("loading")}</div>
        ) : !partners || partners.length === 0 ? (
          <div className="p-12 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
            <p className="font-medium">{t("no_pending")}</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("name")}</TableHead>
                <TableHead>{t("email")}</TableHead>
                <TableHead>{t("phone")}</TableHead>
                <TableHead>{t("role")}</TableHead>
                <TableHead>{t("joined")}</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {partners.map((partner) => (
                <TableRow key={partner.id}>
                  <TableCell className="font-medium">{partner.name}</TableCell>
                  <TableCell className="text-muted-foreground">{partner.email}</TableCell>
                  <TableCell className="text-muted-foreground">{partner.phone}</TableCell>
                  <TableCell>
                    <Badge variant={partner.role === "PARTNER" ? "default" : "secondary"}>
                      {partner.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(partner.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleApprove(partner.id)}
                        disabled={processingId === partner.id}
                        className="flex items-center gap-1.5 rounded-lg bg-green-500 px-3 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                      >
                        <CheckCircle className="h-3.5 w-3.5" />
                        {t("approve")}
                      </button>
                      <button
                        onClick={() => handleReject(partner.id)}
                        disabled={processingId === partner.id}
                        className="flex items-center gap-1.5 rounded-lg bg-destructive px-3 py-1.5 text-xs font-medium text-destructive-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        {t("reject")}
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {toasts.map((toast) => (
        <Toast key={toast.id} message={toast.message} variant={toast.variant as "success" | "error"} />
      ))}
    </div>
  );
}
