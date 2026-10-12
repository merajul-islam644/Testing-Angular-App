import { PanelLeft, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { navItems } from "./navItems";
import { NotificationsMenu } from "./NotificationsMenu";
import { ShieldLogo } from "./ShieldLogo";
import { UserMenu } from "./UserMenu";
import { useT } from "../../lib/i18n/LocalizationProvider";

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
  const { t } = useT();

  const collapsed = collapsedPref && viewport === "desktop";
  const activeItem = navItems.find((item) => item.href === activePath);

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
      <div className="detail-empty">
        <ShieldLogo size={40} />
        <p>{t("vault.detailEmpty")}</p>
      </div>
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
                <span>{t("app.name")}</span>
              </a>
            )}
            <button className="icon-button sidebar-collapse-toggle" onClick={() => setCollapsedPref((value) => !value)} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
              <PanelLeft size={16} />
            </button>
          </div>
          <nav>
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                data-tooltip={t(item.labelKey)}
                className={activePath === item.href ? "active" : ""}
                onClick={(event) => {
                  event.preventDefault();
                  onNavigate(item.href);
                }}
              >
                <item.icon size={18} />
                {collapsed ? null : <span>{t(item.labelKey)}</span>}
              </a>
            ))}
          </nav>
        </aside>
      ) : null}

      <div className="content">
        <header className="topbar">
          <div className="breadcrumb">
            {activeItem ? <activeItem.icon size={16} /> : null}
            <span>{activeItem ? t(activeItem.labelKey) : t("app.name")}</span>
          </div>
          <div className="topbar-search">
            <Search size={15} />
            <input type="text" placeholder="Search in your vault…" aria-label="Search in your vault" />
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
        {navItems.map((item) => (
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
            <span>{t(item.labelKey)}</span>
          </a>
        ))}
      </nav>
    </div>
  );
}