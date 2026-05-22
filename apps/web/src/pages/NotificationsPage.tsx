import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Bell, CheckCircle } from "lucide-react";
import { Button, Card, EmptyState, Skeleton, StatusPill } from "../components/ui";
import { api, errorMessage } from "../lib/api";
import { shortDate } from "../lib/format";
import type { NotificationItem } from "../types/api";

function toneFor(severity: NotificationItem["severity"]) {
  if (severity === "danger") return "red" as const;
  if (severity === "warning") return "gold" as const;
  if (severity === "success") return "green" as const;
  return "neutral" as const;
}

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const { data } = await api.get<{ notifications: NotificationItem[] }>("/notifications");
      setNotifications(data.notifications);
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function markRead(id: string) {
    try {
      await api.patch(`/notifications/${id}/read`);
      await load();
    } catch (error) {
      toast.error(errorMessage(error));
    }
  }

  if (loading) return <Skeleton className="h-[520px]" />;

  return (
    <div className="grid gap-6">
      <div>
        <p className="label">Notifications</p>
        <h2 className="text-3xl font-black">Budget alerts and savings reminders</h2>
      </div>

      <Card>
        {notifications.length ? (
          <div className="grid gap-3">
            {notifications.map((notification) => (
              <div key={notification.id} className="grid gap-3 rounded-2xl border border-slate-100 p-4 sm:grid-cols-[1fr_auto] sm:items-center dark:border-slate-800">
                <div className="flex gap-3">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-slate-100 dark:bg-slate-800">
                    <Bell size={18} />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-black">{notification.title}</p>
                      <StatusPill tone={toneFor(notification.severity)}>{notification.severity}</StatusPill>
                      {!notification.isRead ? <StatusPill tone="green">Unread</StatusPill> : null}
                    </div>
                    <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">{notification.message}</p>
                    <p className="mt-1 text-xs font-semibold text-slate-400">{shortDate(notification.createdAt)}</p>
                  </div>
                </div>
                {!notification.isRead ? (
                  <Button variant="secondary" onClick={() => markRead(notification.id)}>
                    <CheckCircle size={16} /> Mark read
                  </Button>
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="No notifications" body="Budget warnings, exceeded-budget alerts, and savings reminders appear here when your real records trigger them." />
        )}
      </Card>
    </div>
  );
}
