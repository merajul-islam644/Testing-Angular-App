import { useEffect, useState } from "react";
import { AppShell } from "../layout/AppShell";
import { RedirectIfAuthenticated, RequireAuth } from "./guards";
import { CallbackPage } from "../../features/auth/CallbackPage";
import { ErrorPage } from "../../features/auth/ErrorPage";
import { LoginPage } from "../../features/auth/LoginPage";
import { NotFoundPage } from "../../features/auth/NotFoundPage";
import { ProfilePage } from "../../features/profile/ProfilePage";
import { Dashboard } from "../../features/releases/Dashboard";
import { DeploymentDetailPage } from "../../features/releases/DeploymentDetailPage";
import { VerificationPage } from "../../features/releases/VerificationPage";
import { IssueDetailPage } from "../../features/releases/IssueDetailPage";
import { NavPage } from "../../features/releases/NavPage";
import { DeploymentsPage } from "../../features/releases/DeploymentsPage";
import { IssuesPage } from "../../features/releases/IssuesPage";

function readQuery(search: string, key: string): string | undefined {
  return new URLSearchParams(search).get(key) ?? undefined;
}

export function AppRouter() {
  const [path, setPath] = useState(() => window.location.pathname);
  const [search, setSearch] = useState(() => window.location.search);

  useEffect(() => {
    const onPopState = () => {
      setPath(window.location.pathname);
      setSearch(window.location.search);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  function navigate(nextPath: string) {
    const [nextPathname = "/", queryString = ""] = nextPath.split("?");
    window.history.pushState({}, "", nextPath);
    setPath(nextPathname);
    setSearch(queryString ? `?${queryString}` : "");
  }

  if (path === "/login/callback") {
    return <CallbackPage onNavigate={navigate} />;
  }

  if (path === "/login") {
    const returnTo = new URLSearchParams(search).get("returnTo") || undefined;
    return (
      <RedirectIfAuthenticated onNavigate={navigate}>
        <LoginPage returnTo={returnTo} />
      </RedirectIfAuthenticated>
    );
  }

  if (path === "/error") {
    return <ErrorPage onNavigate={navigate} />;
  }

  const dashboard = (
    <Dashboard
      onOpenDeployment={(id) => navigate(`/deployments?id=${id}`)}
      onOpenIssue={(id) => navigate(`/issues?id=${id}`)}
      onViewAllDeployments={() => navigate("/deployments")}
      onNewDeployment={() => navigate("/deployments?new=1")}
      onViewAnalysis={() => navigate("/reports")}
    />
  );

  const deploymentId = readQuery(search, "id");
  const isNewDeployment = readQuery(search, "new") === "1";
  const issueId = readQuery(search, "id");

  const detailRoutes: Record<string, { page: JSX.Element; active: string }> = {
    "/deployments": {
      page: isNewDeployment
        ? <NavPage title="New Deployment" onBack={() => navigate("/")} />
        : deploymentId
          ? <DeploymentDetailPage deploymentId={deploymentId} onBack={() => navigate("/")} onViewVerification={() => navigate("/verification")} />
          : <DeploymentsPage onBack={() => navigate("/")} onOpen={(id) => navigate(`/deployments?id=${id}`)} />,
      active: "/deployments"
    },
    "/issues": {
      page: issueId
        ? <IssueDetailPage issueId={issueId} onBack={() => navigate("/")} />
        : <IssuesPage onBack={() => navigate("/")} onOpen={(id) => navigate(`/issues?id=${id}`)} />,
      active: "/issues"
    },
    "/verification": { page: <VerificationPage onBack={() => navigate("/")} />, active: "/verification" },
    "/test-runs": { page: <NavPage title="Test Runs" onBack={() => navigate("/")} />, active: "/test-runs" },
    "/reports": { page: <NavPage title="Reports" onBack={() => navigate("/")} />, active: "/reports" },
    "/settings": { page: <NavPage title="Settings" onBack={() => navigate("/")} />, active: "/settings" }
  };

  if (path === "/" || path === "") {
    return (
      <RequireAuth currentPath="/" onNavigate={navigate}>
        <AppShell activePath="/" onNavigate={navigate}>
          {dashboard}
        </AppShell>
      </RequireAuth>
    );
  }

  if (path === "/profile") {
    return (
      <RequireAuth currentPath={path} onNavigate={navigate}>
        <AppShell activePath="/profile" onNavigate={navigate}>
          <ProfilePage />
        </AppShell>
      </RequireAuth>
    );
  }

  const detail = detailRoutes[path];
  if (detail) {
    return (
      <RequireAuth currentPath={path} onNavigate={navigate}>
        <AppShell activePath={detail.active} onNavigate={navigate}>
          {detail.page}
        </AppShell>
      </RequireAuth>
    );
  }

  return <NotFoundPage onNavigate={navigate} />;
}