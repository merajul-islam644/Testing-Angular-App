export function NavPage({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <section>
      <button className="link-button back-link" onClick={onBack}>← Back to dashboard</button>
      <div className="page-header">
        <div>
          <h2>{title}</h2>
          <p>This section is coming in a future release.</p>
        </div>
      </div>
      <div className="panel">
        <p className="muted">
          {title} isn't part of this release yet. The dashboard already shows the information this section will expand on.
        </p>
      </div>
    </section>
  );
}