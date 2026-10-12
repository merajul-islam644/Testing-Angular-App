import { LogOut, Mail, Pencil, UserRound } from "lucide-react";
import { useState } from "react";
import { Modal } from "../../shared/ui/Modal";
import { useToast } from "../../shared/ui/Toast";
import { lockVault, updateEmail, useVaultAuth } from "../vault/vaultStore";

export function ProfilePage({ onSignOut }: { onSignOut: (path: string) => void }) {
  const auth = useVaultAuth();
  const toast = useToast();
  const [emailModal, setEmailModal] = useState(false);
  const [email, setEmail] = useState(auth.email);

  function handleSignOut() {
    lockVault();
    onSignOut("/");
  }

  function saveEmail() {
    updateEmail(email);
    setEmailModal(false);
    toast({ message: "Email updated", tone: "success" });
  }

  return (
    <section className="profile-page">
      <div className="page-header">
        <div>
          <h2>Profile</h2>
          <p className="page-count">Your SecureVault account.</p>
        </div>
      </div>

      <div className="profile-card">
        <span className="avatar avatar-lg">MI</span>
        <div className="profile-heading">
          <h3>Merajul Islam</h3>
          <span className="muted"><Mail size={14} /> {auth.email || "merajul@example.com"}</span>
          <span className="muted">Account created: September 2026</span>
        </div>
      </div>

      <div className="panel">
        <div className="panel-title"><UserRound size={16} /><span>Account</span></div>
        <div className="setting-row">
          <div>
            <strong>Edit profile</strong>
            <p className="muted">Update your display name and avatar.</p>
          </div>
          <button className="secondary-button" onClick={() => toast({ message: "Profile editing is unavailable in this version", tone: "info" })}>
            <Pencil size={15} /> Edit Profile
          </button>
        </div>
        <div className="setting-row">
          <div>
            <strong>Change email</strong>
            <p className="muted">Used to sign in and unlock your vault.</p>
          </div>
          <button className="secondary-button" onClick={() => { setEmail(auth.email); setEmailModal(true); }}>
            <Mail size={15} /> Change Email
          </button>
        </div>
        <div className="setting-row">
          <div>
            <strong>Sign out</strong>
            <p className="muted">Lock your vault. Your items stay on this device.</p>
          </div>
          <button className="secondary-button danger-soft" onClick={handleSignOut}>
            <LogOut size={15} /> Sign Out
          </button>
        </div>
      </div>

      {emailModal ? (
        <Modal title="Change Email" onClose={() => setEmailModal(false)}>
          <label className="form-field">
            <span>Email</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <div className="modal-actions">
            <button className="icon-button" onClick={() => setEmailModal(false)}>Cancel</button>
            <button className="primary-button" onClick={saveEmail}>Save</button>
          </div>
        </Modal>
      ) : null}
    </section>
  );
}