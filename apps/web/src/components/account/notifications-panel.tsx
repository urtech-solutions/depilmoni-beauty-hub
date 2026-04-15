"use client";

import Link from "next/link";
import { useState } from "react";
import { BellRing, CheckCheck } from "lucide-react";
import { toast } from "sonner";

import type { Notification } from "@depilmoni/core";
import { Button } from "@depilmoni/ui";

import { formatDateTime } from "@/lib/format";

const NOTIFICATION_EVENT = "depilmoni-notifications-updated";

type NotificationsPanelProps = {
  initialNotifications: Notification[];
};

export const NotificationsPanel = ({
  initialNotifications
}: NotificationsPanelProps) => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const unreadCount = notifications.filter((item) => !item.read).length;

  const emitRefresh = () => {
    window.dispatchEvent(new Event(NOTIFICATION_EVENT));
  };

  const markAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}/read`, { method: "POST" });
      const json = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(json.error ?? "Falha ao atualizar notificação");
      }

      setNotifications((current) =>
        current.map((item) => (item.id === id ? { ...item, read: true } : item))
      );
      emitRefresh();
      toast.success("Notificação marcada como lida");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Falha ao atualizar notificação");
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch("/api/notifications/read-all", { method: "POST" });
      const json = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(json.error ?? "Falha ao marcar tudo como lido");
      }

      setNotifications((current) => current.map((item) => ({ ...item, read: true })));
      emitRefresh();
      toast.success("Todas as notificações foram marcadas como lidas");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Falha ao marcar tudo como lido");
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 rounded-[28px] border border-border/70 bg-card p-6 shadow-[0_24px_60px_-42px_rgba(84,46,28,0.38)] md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Central de avisos</p>
          <h3 className="mt-2 font-display text-2xl font-semibold text-foreground">
            {unreadCount ? `${unreadCount} notificações aguardando leitura` : "Tudo em dia por aqui"}
          </h3>
        </div>
        <Button variant="outline" onClick={markAllAsRead} disabled={!unreadCount}>
          <CheckCheck size={16} />
          Marcar todas como lidas
        </Button>
      </div>

      <div className="space-y-4">
        {notifications.length ? (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className="rounded-[24px] border border-border/70 bg-card p-5 shadow-[0_24px_60px_-42px_rgba(84,46,28,0.38)]"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-copper/10 text-copper">
                      <BellRing size={16} />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{notification.title}</p>
                      <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                        {formatDateTime(notification.createdAt)}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm leading-6 text-muted-foreground">{notification.message}</p>

                  {notification.href ? (
                    <Link href={notification.href} className="text-sm text-foreground underline">
                      Abrir referência
                    </Link>
                  ) : null}
                </div>

                {!notification.read ? (
                  <Button variant="outline" size="sm" onClick={() => markAsRead(notification.id)}>
                    Marcar como lida
                  </Button>
                ) : (
                  <span className="rounded-full bg-secondary px-3 py-1 text-xs uppercase tracking-[0.24em] text-secondary-foreground">
                    Lida
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-[24px] border border-dashed border-border/70 bg-card p-6 text-sm text-muted-foreground">
            Nenhuma notificação registrada ainda para este perfil.
          </div>
        )}
      </div>
    </div>
  );
};
