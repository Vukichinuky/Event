import { requireAdmin } from "@/lib/require-auth";
import { PanelShell } from "@/components/panel-shell";

export const metadata = { title: "Admin panel" };

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin();

  return (
    <PanelShell
      brand="Sve za svadbu"
      badge="Admin"
      email={user.email}
      links={[
        { href: "/admin/bendovi", label: "Ponuđači" },
        { href: "/admin/upiti", label: "Upiti" },
        { href: "/admin/recenzije", label: "Recenzije" },
      ]}
    >
      {children}
    </PanelShell>
  );
}
