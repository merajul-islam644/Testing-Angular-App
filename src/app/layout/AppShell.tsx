import { PanelLeft, Plus, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { sidebarGroups, bottomNavItems } from "./navItems";
import { NotificationsMenu } from "./NotificationsMenu";
import { ShieldLogo } from "./ShieldLogo";
import { UserMenu } from "./UserMenu";
import { VaultDetailPanel } from "../../features/vault/VaultDetailPanel";
import { useVaultUI } from "../../features/vault/VaultUIContext";

const COLLAPSED_KEY = "securevault:sidebar-collapsed";
const DESKTOP_QUERY = "(min-width: 1025px)";
const MOBILE_QUERY = "(max-width: 768px)";
const TABLET_QUERY = "(max-width: 1024px)";

type Viewport = "desktop" | "tablet" | "mobile";

function useViewport(): Viewport {
  const [viewport, setViewport] = useState<Viewport>(() =>
    window.matchMedia(DESKTOP_QUERY).matches ? "desktop" : window.matchMedia(MOBILE_QUERY).matches ? "mobile" : "tablet"
  );

  useEffect(() => {
    const compute = () => {
      if (window.matchMedia(DESKTOP_QUERY).matches) setViewport("desktop");
      else if (window.matchMedia(MOBILE_QUERY).matches) setViewport("mobile");
      else setViewport("tablet");
    };
    compute();
    window.matchMedia(DESKTOP_QUERY).addEventListener("change", compute);
    window.matchMedia(MOBILE_QUERY).addEventListener("change", compute);
    return () => {
      window.matchMedia(DESKTOP_QUERY).removeEventListener("change", compute);
      window.matchMedia(MOBILE_QUERY).removeEventListener("change", compute);
    };
  }, []);

  return viewport;
}

export function AppShell({ activePath, children, onNavigate }: { activePath: string; children: ReactNode; onNavigate: (path: string) => void }) {
  const viewport = useViewport();
  const [collapsedPref, setCollapsedPref] = useState(() => localStorage.getItem(COLLAPSED_KEY) === "true");
  const [detailOpen, setDetailOpen] = useState(false);
  const { setSearch, openNewItem } = useVaultUI();

  const collapsed = collapsedPref && viewport === "desktop";

  useEffect(() => {
    localStorage.setItem(COLLAPSED_KEY, String(collapsedPref));
  }, [collapsedPref]);

  useEffect(() => {
    if (viewport !== "tablet") setDetailOpen(false);
  }, [viewport]);

  const showSidebar = viewport === "desktop";
  const detailAsDrawer = viewport === "tablet";

  const detailPanel = (
    <div className={["detail-panel", detailAsDrawer ? "drawer" : "", detailOpen ? "open" : ""].filter(Boolean).join(" ")}>
      <VaultDetailPanel />
    </div>
  );

  return (
    <div className="shell">
      {showSidebar ? (
        <aside className={collapsed ? "collapsed" : ""}>
          <div className="sidebar-header">
            {collapsed ? null : (
              <a className="brand" href="/" onClick={(event) => { event.preventDefault(); onNavigate("/"); }}>
                <ShieldLogo size={30} />
                <span>SecureVault</span>
              </a>
            )}
            <button className="icon-button sidebar-collapse-toggle" onClick={() => setCollapsedPref((value) => !value)} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
              <PanelLeft size={16} />
            </button>
          </div>
          <button className="primary-button new-item-button" onClick={openNewItem}><Plus size={16} /> New Item</button>
          <nav className="sidebar-nav">
            {sidebarGroups.map((group) => (
              <div className="nav-group" key={group.label}>
                {collapsed ? null : <div className="nav-group-label">{group.label}</div>}
                {group.items.map((item) => (
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
              </div>
            ))}
          </nav>
        </aside>
      ) : null}

      <div className="content">
        <header className="topbar">
          <div className="topbar-search">
            <Search size={15} />
            <input type="text" placeholder="Search in your vault…" aria-label="Search in your vault" onChange={(e) => setSearch(e.target.value)} />
            <kbd>⌘K</kbd>
          </div>
          <div className="topbar-spacer" />
          <LanguageSwitcher />
          <NotificationsMenu />
          <UserMenu onNavigate={onNavigate} />
          {detailAsDrawer ? (
            <button className="icon-button" onClick={() => setDetailOpen((value) => !value)} aria-label="Toggle details">
              {detailOpen ? <X size={18} /> : <PanelLeft size={18} />}
            </button>
          ) : null}
        </header>
        <div className="main-row">
          <main>{children}</main>
          {viewport === "desktop" ? detailPanel : null}
        </div>
      </div>

      {detailAsDrawer ? (
        <>
          {detailOpen ? <div className="drawer-scrim" onClick={() => setDetailOpen(false)} /> : null}
          {detailPanel}
        </>
      ) : null}

      <nav className="bottom-nav">
        {bottomNavItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={activePath === item.href ? "active" : ""}
            onClick={(event) => {
              event.preventDefault();
              onNavigate(item.href);
            }}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </a>
        ))}
      </nav>
    </div>
  );
}