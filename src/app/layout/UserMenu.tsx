import { ChevronDown, LogOut, UserRound } from "lucide-react";
import { useAuth } from "../providers/AuthProvider";
import { useCurrentUser, userDisplayName, userInitials } from "../../features/profile/useCurrentUser";
import { useT } from "../../lib/i18n/LocalizationProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "../../shared/ui/dropdown-menu";

export function UserMenu({ onNavigate }: { onNavigate: (path: string) => void }) {
  const { logout } = useAuth();
  const { t } = useT();
  const me = useCurrentUser();
  const profile = me.data?.data;
  const name = userDisplayName(profile) || (me.isLoading ? "Loading..." : "Guest");
  const roles = profile?.roles ?? [];
  const role = roles[0] ?? "";

  function handleLogout() {
    logout();
    onNavigate("/login");
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="user-menu-trigger" aria-label="Open user menu">
        <span className="user-area">
          <span className="avatar avatar-sm">{userInitials(profile)}</span>
          <span className="user-area-text">
            <strong>{name}</strong>
            {role ? <small>{role}</small> : null}
          </span>
          <ChevronDown size={15} className="user-area-chevron" />
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[280px]">
        <DropdownMenuLabel className="flex items-center gap-3 font-normal">
          <span className="avatar avatar-lg">{userInitials(profile)}</span>
          <div className="grid gap-0.5 overflow-hidden">
            <strong className="truncate text-sm font-semibold">{name}</strong>
            {profile?.email ? <small className="truncate text-xs text-[hsl(var(--muted-foreground))]">{profile.email}</small> : null}
            {role ? <small className="truncate text-xs capitalize text-[hsl(var(--muted-foreground))]">{role}</small> : null}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => onNavigate("/profile")}>
          <UserRound size={18} /> Profile
        </DropdownMenuItem>
        <DropdownMenuItem destructive onSelect={handleLogout}>
          <LogOut size={18} /> {t("nav.logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}