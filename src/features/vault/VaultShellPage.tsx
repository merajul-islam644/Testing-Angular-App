import { useEffect, useState } from "react";
import { useT } from "../../lib/i18n/LocalizationProvider";
import { ShieldLogo } from "../../app/layout/ShieldLogo";
import { Skeleton } from "../../shared/ui/Skeleton";

type VaultStatus = "loading" | "empty" | "error";

function useVaultLoad(): { status: VaultStatus; retry: () => void } {
  const [status, setStatus] = useState<VaultStatus>("loading");

  function retry() {
    setStatus("loading");
  }

  useEffect(() => {
    // The vault item store arrives in a later build; for now the vault
    // resolves to an empty collection. Loading and error states are wired
    // so a future data source drives them without further shell changes.
    if (status === "loading") setStatus("empty");
  }, [status]);

  return { status, retry };
}

export function VaultShellPage() {
  const { t } = useT();
  const { status, retry } = useVaultLoad();

  return (
    <section className="vault-page">
      <div className="page-header">
        <div>
          <h2>{t("vault.title")}</h2>
          <p className="page-count">{status === "empty" ? "0 items" : ""}</p>
        </div>
      </div>

      {status === "loading" ? (
        <VaultSkeleton />
      ) : status === "error" ? (
        <div className="empty-state vault-empty">
          <div className="empty-icon"><ShieldLogo size={40} /></div>
          <h3>{t("vault.errorTitle")}</h3>
          <button className="primary-button" onClick={retry}>{t("vault.retry")}</button>
        </div>
      ) : (
        <div className="empty-state vault-empty">
          <div className="empty-icon"><ShieldLogo size={40} /></div>
          <h3>{t("vault.emptyTitle")}</h3>
          <p>{t("vault.emptyBody")}</p>
        </div>
      )}
    </section>
  );
}

function VaultSkeleton() {
  return (
    <div className="vault-skeleton" aria-label="Loading your vault">
      {Array.from({ length: 6 }).map((_, index) => (
        <div className="skeleton-row" key={index}>
          <Skeleton className="skeleton-icon" />
          <div className="skeleton-cols">
            <Skeleton className="skeleton-line" style={{ width: "45%" }} />
            <Skeleton className="skeleton-line" style={{ width: "30%" }} />
          </div>
        </div>
      ))}
    </div>
  );
}