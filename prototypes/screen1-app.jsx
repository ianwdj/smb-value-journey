/* Screen 1 — CS operator console. Archetype-grouped review queue + bulk approve + detail panel.
   Loaded as text/babel. Depends on window.Icon, window.ARCHETYPES, window.METRICS, window.STATUS, window.ACCOUNT_DETAIL. */
const { useState, useMemo } = React;
const I = window.Icon;

function Logo() {
  return <span className="s1-logo" />;
}

function Nav() {
  const items = [
    { icon: I.Inbox, label: "Review queue", active: true, badge: "23" },
    { icon: I.Accounts, label: "Accounts" },
    { icon: I.Book, label: "Playbooks" },
    { icon: I.Beaker, label: "Results & holdout" },
    { icon: I.Settings, label: "Settings" },
  ];
  return (
    <aside className="s1-side">
      <div className="s1-brand"><Logo /><span>Lifecycle Agent</span></div>
      <nav className="s1-nav">
        {items.map((it, i) => (
          <div key={i} className={"s1-nav-row" + (it.active ? " on" : "")}>
            <it.icon size={18} /><span>{it.label}</span>
            {it.badge ? <span className="s1-nav-badge tnum">{it.badge}</span> : null}
          </div>
        ))}
      </nav>
      <div className="s1-side-foot">
        <div className="s1-op-av">OD</div>
        <div className="s1-op">
          <span className="s1-op-name">Operations · Dana K.</span>
          <span className="s1-op-sub">Growth &amp; CS</span>
        </div>
      </div>
    </aside>
  );
}

function MetricsStrip() {
  return (
    <div className="s1-metrics">
      {window.METRICS.map((m, i) => (
        <div className="s1-metric" key={i}>
          <div className={"s1-metric-val tnum" + (m.tone === "accent" ? " accent" : "")}>
            {m.value}<span className="s1-metric-suf">{m.suffix || ""}</span>
          </div>
          <div className="s1-metric-label">{m.label}</div>
        </div>
      ))}
    </div>
  );
}

function Confidence({ v }) {
  if (!v) return <span className="s1-conf-na">—</span>;
  const label = v >= 0.8 ? "High" : v >= 0.65 ? "Medium" : "Low";
  return (
    <div className="s1-conf" title={label + " confidence"}>
      <div className="s1-conf-bar"><div className="s1-conf-fill" style={{ width: Math.round(v * 100) + "%" }} /></div>
      <span className="s1-conf-label">{label}</span>
    </div>
  );
}

function StatusPill({ status }) {
  const s = window.STATUS[status];
  return <span className={"pill " + s.cls}><span className="dot" />{s.label}</span>;
}

function AccountRow({ a, checked, onCheck, onOpen }) {
  const holdout = a.status === "holdout" || a.status === "suppressed";
  return (
    <div className={"s1-row" + (holdout ? " locked" : "") + (checked ? " checked" : "")}>
      <label className="s1-check">
        <input type="checkbox" checked={checked} disabled={holdout} onChange={onCheck} />
        <span className="s1-check-box">{checked ? <I.Check size={13} /> : null}</span>
      </label>
      <div className="s1-cell s1-acct">
        <div className="s1-acct-name">{a.name}</div>
        <div className="s1-acct-seg">{a.seg}</div>
      </div>
      <div className="s1-cell s1-stall">{a.stall}</div>
      <div className="s1-cell s1-value">
        {a.value === "—" ? <span className="s1-conf-na">—</span> : <><span className="tnum accent">{a.value}</span> <span className="s1-value-unit">{a.unit}</span></>}
      </div>
      <div className="s1-cell s1-confcell"><Confidence v={a.conf} /></div>
      <div className="s1-cell s1-statuscell"><StatusPill status={a.status} /></div>
      <div className="s1-cell s1-actions">
        {holdout ? (
          <span className="s1-locked-note"><I.Lock size={13} />{a.status === "holdout" ? "Holdout" : "Opted out"}</span>
        ) : (
          <>
            <button className="btn btn-secondary btn-sm" onClick={onOpen}>Review</button>
            <button className="s1-icon" title="Edit"><I.Edit size={16} /></button>
            <button className="s1-icon" title="Reject"><I.X size={16} /></button>
          </>
        )}
      </div>
    </div>
  );
}

function ArchetypeGroup({ g, selected, setSelected, onOpen }) {
  const [open, setOpen] = useState(g.id === "signprint");
  const actionable = g.accounts.filter((a) => a.status !== "holdout" && a.status !== "suppressed");
  const selCount = g.accounts.filter((a) => selected[a.id]).length;
  const allSel = actionable.length > 0 && actionable.every((a) => selected[a.id]);

  const toggleAll = (e) => {
    e.stopPropagation();
    const next = { ...selected };
    actionable.forEach((a) => { next[a.id] = !allSel; });
    setSelected(next);
  };

  return (
    <section className="s1-group">
      <header className="s1-group-head" onClick={() => setOpen((o) => !o)}>
        <button className="s1-group-chev" aria-label="Toggle">
          {open ? <I.ChevDown size={18} /> : <I.ChevRight size={18} />}
        </button>
        <label className="s1-check group" onClick={(e) => e.stopPropagation()}>
          <input type="checkbox" checked={allSel} onChange={toggleAll} />
          <span className="s1-check-box">{allSel ? <I.Check size={13} /> : null}</span>
        </label>
        <div className="s1-group-title">
          {g.title} <span className="s1-group-count tnum">{g.count} accounts</span>
          <div className="s1-group-wf"><I.Codex size={14} />Recommended: {g.workflow} · expected {g.unit}</div>
        </div>
        <div className="s1-group-actions" onClick={(e) => e.stopPropagation()}>
          {selCount > 0 && <span className="s1-selcount tnum">{selCount} selected</span>}
          <button className="btn btn-primary btn-sm">
            <I.Check size={15} />{`Approve & send (${selCount || g.count})`}
          </button>
        </div>
      </header>
      {open && (
        <div className="s1-rows">
          <div className="s1-rows-headrow">
            <span /><span>Account</span><span>Stall</span><span>Expected value</span><span>Confidence</span><span>Status</span><span />
          </div>
          {g.accounts.map((a) => (
            <AccountRow
              key={a.id} a={a}
              checked={!!selected[a.id]}
              onCheck={() => setSelected((s) => ({ ...s, [a.id]: !s[a.id] }))}
              onOpen={() => onOpen(a)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function DetailPanel({ a, onClose }) {
  const d = (a && window.ACCOUNT_DETAIL[a.id]) || null;
  if (!a) return null;
  return (
    <>
      <div className="s1-scrim" onClick={onClose} />
      <aside className="s1-detail">
        {true && (
          <>
            <header className="s1-detail-head">
              <div>
                <div className="s1-detail-name">{a.name}</div>
                <div className="s1-detail-seg">{a.seg}</div>
              </div>
              <button className="s1-icon" onClick={onClose} title="Close"><I.X size={18} /></button>
            </header>
            <div className="s1-detail-body">
              <div className="s1-detail-sec">
                <div className="s1-detail-label">Why this account</div>
                {d ? d.why.map((w, i) => (
                  <div className="s1-evidence" key={i}><span className="s1-evidence-dot" />{w}</div>
                )) : <div className="s1-evidence"><span className="s1-evidence-dot" />{a.stall}.</div>}
              </div>

              <div className="s1-detail-sec">
                <div className="s1-detail-label">Discovery-surfaced process</div>
                <div className="s1-detail-card">
                  {(d ? d.process : [
                    { k: "Trigger", v: "Repeated task detected" },
                    { k: "Approval", v: "To be confirmed at discovery" },
                    { k: "Outcome unit", v: "Customer names it at discovery" },
                  ]).map((p, i) => (
                    <div className="s1-detail-row" key={i}><span className="s1-detail-k">{p.k}</span><span>{p.v}</span></div>
                  ))}
                </div>
              </div>

              <div className="s1-detail-sec">
                <div className="s1-detail-label">Reusable Codex task</div>
                <div className="s1-task">
                  <div className="s1-task-head"><I.Codex size={16} />{a.value !== "—" ? "Quote draft from QuickBooks order" : "Reusable workflow"}</div>
                  <p className="s1-task-body">{d ? d.task : "A reusable task the customer re-runs. Each re-run is paid Codex consumption past the included cap."}</p>
                </div>
              </div>

              <div className="s1-detail-sec">
                <div className="s1-detail-label">Value baseline</div>
                <div className="s1-baseline">
                  <div className="s1-baseline-num"><span className="tnum accent">{a.value}</span> <span>{a.unit} expected</span></div>
                  <p>{d ? d.baseline : "Baseline captured at discovery, measured in the customer's chosen unit."}</p>
                </div>
              </div>
            </div>
            <footer className="s1-detail-foot">
              <button className="btn btn-primary"><I.Check size={16} />Approve &amp; send</button>
              <button className="btn btn-secondary"><I.Edit size={16} />Edit</button>
              <button className="btn btn-ghost" onClick={onClose}>Reject</button>
            </footer>
          </>
        )}
      </aside>
    </>
  );
}

function App() {
  const [selected, setSelected] = useState({});
  const [detail, setDetail] = useState(null);
  const totalSel = useMemo(() => Object.values(selected).filter(Boolean).length, [selected]);

  return (
    <div className="s1-root">
      <Nav />
      <main className="s1-main">
        <header className="s1-top">
          <div className="s1-top-l">
            <h1 className="s1-h1">Review queue</h1>
            <p className="s1-sub">Stalled accounts grouped by archetype. Approve a recommended reusable workflow to send it to the customer.</p>
          </div>
          <div className="s1-top-r">
            <button className="btn btn-secondary btn-sm"><I.Beaker size={15} />Holdout view</button>
            <button className="btn btn-primary btn-sm" disabled={!totalSel}>
              <I.Check size={15} />Approve &amp; send{totalSel ? ` (${totalSel})` : ""}
            </button>
          </div>
        </header>

        <div className="s1-scroll">
          <MetricsStrip />
          <div className="s1-queue">
            {window.ARCHETYPES.map((g) => (
              <ArchetypeGroup key={g.id} g={g} selected={selected} setSelected={setSelected} onOpen={setDetail} />
            ))}
          </div>
          <div className="s1-queue-foot">Showing 3 of 6 archetypes · 23 accounts need review</div>
        </div>
      </main>
      <DetailPanel a={detail} onClose={() => setDetail(null)} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
