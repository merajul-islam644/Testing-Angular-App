import { Bot, PanelLeft, Search, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { environments, navItems } from "./navItems";
import { NotificationsMenu } from "./NotificationsMenu";
import { ThemeToggle } from "./ThemeToggle";
import { UserMenu } from "./UserMenu";

const COLLAPSED_KEY = "lattice:sidebar-collapsed";
const MOBILE_QUERY = "(max-width: 880px)";

function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(() => window.matchMedia(MOBILE_QUERY).matches);

  useEffect(() => {
    const mql = window.matchMedia(MOBILE_QUERY);
    const onChange = () => setIsMobile(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return isMobile;
}

export function AppShell({ activePath, children, onNavigate }: { activePath: string; children: ReactNode; onNavigate: (path: string) => void }) {
  const isMobile = useIsMobile();
  const [collapsedPref, setCollapsedPref] = useState(() => localStorage.getItem(COLLAPSED_KEY) === "true");
  const collapsed = collapsedPref || isMobile;
  const activeItem = navItems.find((item) => item.href === activePath);

  useEffect(() => {
    localStorage.setItem(COLLAPSED_KEY, String(collapsedPref));
  }, [collapsedPref]);

  return (
    <div className="shell">
      <aside className={collapsed ? "collapsed" : ""}>
        <div className="sidebar-header">
          {collapsed ? null : (
            <a className="brand" href="/" onClick={(event) => { event.preventDefault(); onNavigate("/"); }}>
              <span className="brand-mark"><Share2 size={16} /></span>
              <span>Lattice</span>
            </a>
          )}
          <button className="icon-button sidebar-collapse-toggle" onClick={() => setCollapsedPref((value) => !value)} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
            <PanelLeft size={16} />
          </button>
        </div>

        <div className="sidebar-nav">
          <nav>
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                data-tooltip={item.label}
                className={activePath === item.href ? "active" : ""}
                onClick={(event) => {
                  event.preventDefault();
                  onNavigate(item.href);
                }}
              >
                <item.icon size={18} />
                {collapsed ? null : <span>{item.label}</span>}
              </a>
            ))}
          </nav>

          <div className="sidebar-section">
            {collapsed ? null : <div className="sidebar-section-label">Environments</div>}
            <div>
              {environments.map((env) => (
                <div key={env.name} className="environment-item" data-tooltip={`${env.name} · ${env.health}`}>
                  <span className="environment-dot" style={{ background: env.color }} />
                  {collapsed ? null : <span>{env.name}</span>}
                  {collapsed ? null : <small>{env.health}</small>}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="ai-card">
          <div className="ai-card-title">
            <Bot size={15} />
            {collapsed ? null : <span>AI Assistant</span>}
          </div>
          {collapsed ? null : <p>Ask anything about deployments, tests or issues.</p>}
        </div>
      </aside>

      <div className="content">
        <header className="topbar">
          {activeItem ? (
            <div className="breadcrumb">
              <activeItem.icon size={16} />
              <span>{activeItem.label}</span>
            </div>
          ) : null}
          <label className="topbar-search">
            <Search size={16} />
            <input placeholder="Search deployments, tests, issues…" aria-label="Search" />
            <span className="topbar-kbd">⌘K</span>
          </label>
          <div className="topbar-spacer" />
          <ThemeToggle />
          <NotificationsMenu />
          <UserMenu onNavigate={onNavigate} />
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
}