import { NotificationsPanel } from "@/components/account/notifications-panel";
import { listNotificationsForCurrentUser } from "@/lib/account-server";

export default async function NotificacoesPage() {
  const notifications = await listNotificationsForCurrentUser();

  return <NotificationsPanel initialNotifications={notifications} />;
}
