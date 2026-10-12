import { Activity, KeyRound, LayoutGrid, Clock, Settings, ShieldAlert, ShieldCheck, Star, Trash2, UserRound } from "lucide-react";

export type NavItem = { href: string; label: string; icon: typeof ShieldCheck };

export const sidebarGroups: { label: string; items: NavItem[] }[] = [
  {
    label: "Vault",
    items: [
      { href: "/", label: "All Items", icon: ShieldCheck },
      { href: "/favorites", label: "Favorites", icon: Star },
      { href: "/recent", label: "Recent", icon: Clock },
      { href: "/trash", label: "Trash", icon: Trash2 }
    ]
  },
  {
    label: "Security",
    items: [
      { href: "/generator", label: "Password Generator", icon: KeyRound },
      { href: "/security", label: "Security Checkup", icon: ShieldAlert },
      { href: "/breach", label: "Breach Monitor", icon: Activity }
    ]
  },
  {
    label: "Account",
    items: [
      { href: "/settings", label: "Settings", icon: Settings },
      { href: "/profile", label: "Profile", icon: UserRound }
    ]
  }
];

export const bottomNavItems: NavItem[] = [
  { href: "/", label: "Vault", icon: LayoutGrid },
  { href: "/generator", label: "Generator", icon: KeyRound },
  { href: "/security", label: "Security", icon: ShieldAlert },
  { href: "/settings", label: "Settings", icon: Settings }
];