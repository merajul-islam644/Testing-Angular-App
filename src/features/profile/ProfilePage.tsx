import { Mail, RefreshCw, UserRound } from "lucide-react";
import { useAuth } from "../../app/providers/AuthProvider";
import { useT } from "../../lib/i18n/LocalizationProvider";
import { ActionButton } from "../../shared/ui/ActionButton";
import { PageHeader } from "../../shared/ui/PageHeader";
import { Skeleton } from "../../shared/ui/Skeleton";
import { useCurrentUser, userDisplayName, userInitials } from "./useCurrentUser";

export function ProfilePage() {
  const me = useCurrentUser();
  const { t } = useT();
  const profile = me.data?.data;
  const name = userDisplayName(profile);

  return (
    <section>
      <PageHeader
        title={t("profile.title")}
        subtitle="Your SecureVault account"
        actions={<ActionButton variant="icon" onClick={() => me.refetch()} title="Refresh" icon={<RefreshCw size={18} />} />}
      />

      {me.isLoading ? (
        <div className="profile-card">
          <Skeleton className="skeleton-avatar-lg" />
          <div className="profile-heading">
            <Skeleton className="skeleton-line-lg" />
            <Skeleton className="skeleton-line" />
          </div>
        </div>
      ) : (
        <div className="profile-card">
          <span className="avatar avatar-lg">{userInitials(profile)}</span>
          <div className="profile-heading">
            <h3>{name || "Guest"}</h3>
            {profile?.email ? <span className="muted"><Mail size={14} /> {profile.email}</span> : null}
          </div>
        </div>
      )}

      <div className="grid">
        <div className="panel">
          <div className="panel-title"><UserRound size={16} /><span>{t("profile.title")}</span></div>
          {me.isLoading ? <Skeleton className="skeleton-line" /> : <strong>{name || "Not available"}</strong>}
        </div>
      </div>
    </section>
  );
}