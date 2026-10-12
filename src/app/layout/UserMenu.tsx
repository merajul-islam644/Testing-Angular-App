import { LogOut, UserRound } from "lucide-react";
import { lockVault, useVaultAuth } from "../../features/vault/vaultStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "../../shared/ui/dropdown-menu";

export function UserMenu({ onNavigate }: { onNavigate: (path: string) => void }) {
  const auth = useVaultAuth();

  function handleSignOut() {
    lockVault();
    onNavigate("/");
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="user-menu-trigger" aria-label="Open user menu">
        <span className="avatar avatar-sm">MI</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[260px]">
        <DropdownMenuLabel className="flex items-center gap-3 font-normal">
          <span className="avatar avatar-lg">MI</span>
          <div className="grid gap-0.5 overflow-hidden">
            <strong className="truncate text-sm font-semibold">Merajul Islam</strong>
            <small className="truncate text-xs text-[hsl(var(--muted-foreground))]">{auth.email || "merajul@example.com"}</small>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => onNavigate("/profile")}>
          <UserRound size={18} /> Profile
        </DropdownMenuItem>
        <DropdownMenuItem destructive onSelect={handleSignOut}>
          <LogOut size={18} /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}