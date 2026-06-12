import { requireBand } from "@/lib/require-auth";
import { PanelShell } from "@/components/panel-shell";

export const metadata = { title: "Bend panel" };

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, band } = await requireBand();

  return (
    <PanelShell
      brand={band?.name ?? "Bend panel"}
      email={user.email}
      links={[
        { href: "/dashboard", label: "Pregled" },
        { href: "/dashboard/upiti", label: "Upiti" },
        { href: "/dashboard/kalendar", label: "Kalendar" },
        { href: "/dashboard/recenzije", label: "Recenzije" },
        { href: "/dashboard/profil", label: "Profil" },
      ]}
    >
      {children}
    </PanelShell>
  );
}
