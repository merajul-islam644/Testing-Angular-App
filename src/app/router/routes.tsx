import { useEffect, useState } from "react";
import { AppShell } from "../layout/AppShell";
import { NotFoundPage } from "../../features/auth/NotFoundPage";
import { SetupPage } from "../../features/auth/SetupPage";
import { UnlockPage } from "../../features/auth/UnlockPage";
import { useVaultAuth } from "../../features/vault/vaultStore";
import { VaultUIProvider } from "../../features/vault/VaultUIContext";
import { VaultListPage } from "../../features/vault/VaultListPage";
import { TrashView } from "../../features/vault/TrashView";
import { GeneratorPage } from "../../features/generator/GeneratorPage";
import { SecurityPage } from "../../features/security/SecurityPage";
import { BreachPage } from "../../features/security/BreachPage";
import { SettingsPage } from "../../features/settings/SettingsPage";
import { ProfilePage } from "../../features/profile/ProfilePage";

export function AppRouter() {
  const [path, setPath] = useState(() => window.location.pathname);
  const auth = useVaultAuth();

  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  function navigate(nextPath: string) {
    window.history.pushState({}, "", nextPath);
    setPath(nextPath);
  }

  if (!auth.exists) {
    return <SetupPage onCreated={() => navigate("/")} />;
  }

  if (!auth.unlocked) {
    return <UnlockPage email={auth.email} onUnlocked={() => navigate("/")} />;
  }

  return (
    <VaultUIProvider>
      <AppShell activePath={path} onNavigate={navigate}>
        <CurrentPage path={path} onNavigate={navigate} />
      </AppShell>
    </VaultUIProvider>
  );
}

function CurrentPage({ path, onNavigate }: { path: string; onNavigate: (next: string) => void }) {
  switch (path) {
    case "/":
      return <VaultListPage view="all" />;
    case "/favorites":
      return <VaultListPage view="favorites" />;
    case "/recent":
      return <VaultListPage view="recent" />;
    case "/trash":
      return <TrashView />;
    case "/generator":
      return <GeneratorPage />;
    case "/security":
      return <SecurityPage onNavigate={onNavigate} />;
    case "/breach":
      return <BreachPage onNavigate={onNavigate} />;
    case "/settings":
      return <SettingsPage />;
    case "/profile":
      return <ProfilePage onSignOut={onNavigate} />;
    default:
      return <NotFoundPage onNavigate={onNavigate} />;
  }
}