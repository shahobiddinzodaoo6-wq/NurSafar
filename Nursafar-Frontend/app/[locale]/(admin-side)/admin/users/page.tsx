"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Users, Trash2 } from "lucide-react";
import { useGetAllUsersQuery, useDeleteUserMutation } from "@/lib/api/adminApi";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/lib/hooks/use-toast";
import { useAppSelector } from "@/lib/store/hooks";

const roleColors: Record<string, "default" | "secondary" | "outline" | "gold" | "success" | "destructive"> = {
  ADMIN: "destructive",
  PARTNER: "default",
  DRIVER: "gold",
  CLIENT: "success",
};

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

export default function UsersPage() {
  const t = useTranslations("admin");
  const tCommon = useTranslations("common");
  const { data: users, isLoading } = useGetAllUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const { toasts, toast } = useToast();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const currentUser = useAppSelector((s) => s.auth.user);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete user "${name}"?`)) return;
    setDeletingId(id);
    try {
      await deleteUser(id).unwrap();
      toast(t("delete_success"), "success");
    } catch {
      toast(tCommon("error"), "error");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center gap-3">
        <Users className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">{t("users")}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {users?.length ?? 0} registered users
          </p>
        </div>
      </div>

      <div className="rounded-xl border bg-card">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground text-sm">{tCommon("loading")}</div>
        ) : !users || users.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-muted-foreground">{t("no_users")}</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("name")}</TableHead>
                <TableHead>{t("email")}</TableHead>
                <TableHead>{t("phone")}</TableHead>
                <TableHead>{t("role")}</TableHead>
                <TableHead>{t("status")}</TableHead>
                <TableHead>{t("joined")}</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell className="text-muted-foreground">{user.email}</TableCell>
                  <TableCell className="text-muted-foreground">{user.phone}</TableCell>
                  <TableCell>
                    <Badge variant={roleColors[user.role] ?? "outline"}>{user.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.isApproved ? "success" : "secondary"}>
                      {user.isApproved ? t("approved") : t("pending")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {user.id !== currentUser?.id && (
                      <button
                        onClick={() => handleDelete(user.id, user.name)}
                        disabled={deletingId === user.id}
                        className="flex items-center gap-1.5 rounded-lg border border-destructive/40 px-3 py-1.5 text-xs font-medium text-destructive transition-colors hover:bg-destructive hover:text-destructive-foreground disabled:opacity-50 ml-auto"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        {tCommon("delete")}
                      </button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {toasts.map((t) => (
        <Toast key={t.id} message={t.message} variant={t.variant as "success" | "error"} />
      ))}
    </div>
  );
}
