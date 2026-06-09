/* Screen 2 — Customer in-product experience.
   Chat shell + stepped flow. Three entry points converge on one discovery.
   Loaded as text/babel. Depends on window.Icon, window.ValuePanel. */
const { useState, useRef, useEffect, useCallback } = React;
const I = window.Icon;

/* ---------------- sidebar ---------------- */
function NavRow({ icon: Ico, label, active, badge, muted }) {
  return (
    <div className={"s2-nav" + (active ? " on" : "") + (muted ? " muted" : "")}>
      <Ico size={18} />
      <span>{label}</span>
      {badge ? <span className="s2-badge">{badge}</span> : null}
    </div>
  );
}

function Sidebar({ hasWorkflow, runs, onOpenWorkflow, onNewChat }) {
  return (
    <aside className="s2-side">
      <div className="s2-side-top">
        <div className="s2-brand">
          <span className="s2-logo" />
          <span>Workspace</span>
        </div>
        <button className="s2-icon-btn" title="Collapse"><I.Sidebar size={18} /></button>
      </div>

      <div className="s2-side-scroll">
        <div className="s2-new" onClick={onNewChat}><I.NewChat size={18} /><span>New chat</span></div>
        <NavRow icon={I.Search} label="Search chats" />
        <NavRow icon={I.Library} label="Library" />
        <NavRow icon={I.Apps} label="Apps" />

        <div className="s2-section-label">Workflows</div>
        {hasWorkflow ? (
          <div className="s2-wf" onClick={onOpenWorkflow}>
            <I.Workflow size={17} />
            <div className="s2-wf-meta">
              <span className="s2-wf-name">Order export cleanup</span>
              <span className="s2-wf-sub tnum">{runs} runs · ~6 hrs/wk</span>
            </div>
            <span className="s2-wf-dot" />
          </div>
        ) : (
          <div className="s2-wf-empty">Nothing saved yet</div>
        )}

        <div className="s2-section-label">Chats</div>
        {["Order export cleanup", "Quote for Westside Signs", "Vinyl supplier comparison", "Reprint policy draft"].map((c, i) => (
          <div className={"s2-chat" + (i === 0 ? " on" : "")} key={i}>{c}</div>
        ))}
      </div>

      <div className="s2-side-foot">
        <div className="s2-avatar">M</div>
        <div className="s2-acct">
          <span className="s2-acct-name">Marlin Sign &amp; Print</span>
          <span className="s2-acct-plan">Business</span>
        </div>
      </div>
    </aside>
  );
}

/* ---------------- message primitives ---------------- */
function Avatar({ who }) {
  if (who === "user") return <div className="s2-msg-av user">M</div>;
  return <div className="s2-msg-av bot"><span className="s2-logo sm" /></div>;
}

function Msg({ who, children, anim }) {
  return (
    <div className={"s2-msg " + who + (anim ? " fade-in" : "")}>
      <Avatar who={who} />
      <div className="s2-msg-body">{children}</div>
    </div>
  );
}

function Chips({ items, onPick }) {
  return (
    <div className="s2-chips fade-in">
      {items.map((it, i) => (
        <button key={i} className={"s2-chip" + (it.primary ? " primary" : "")} onClick={() => onPick(it)}>
          {it.icon ? <it.icon size={15} /> : null}{it.label}
        </button>
      ))}
    </div>
  );
}

/* ---------------- inline cards ---------------- */
function TriggerCard({ onYes, onNo }) {
  return (
    <div className="s2-card fade-in">
      <div className="s2-card-icon"><I.Repeat size={18} /></div>
      <div className="s2-card-main">
        <div className="s2-card-title">You've cleaned up this export 4 weeks running.</div>
        <div className="s2-card-text">Want me to set it up as a workflow so you don't rebuild it each time? You'd just run it.</div>
        <div className="s2-card-actions">
          <button className="btn btn-primary btn-sm" onClick={onYes}>Set it up</button>
          <button className="btn btn-ghost btn-sm" onClick={onNo}>Not now</button>
        </div>
      </div>
    </div>
  );
}

function ConsentCard({ onYes, onNo }) {
  const scopes = [
    { label: "Orders", access: "Read" },
    { label: "Customers", access: "Read" },
    { label: "Invoices", access: "Read" },
  ];
  return (
    <div className="s2-card fade-in">
      <div className="s2-card-icon"><I.Plug size={18} /></div>
      <div className="s2-card-main">
        <div className="s2-card-title">Connect QuickBooks <span className="s2-ro"><I.Lock size={12} /> read-only</span></div>
        <div className="s2-card-text">So I can see when a new order comes in. I'll only read these — no changes are written back.</div>
        <div className="s2-scopes">
          {scopes.map((s, i) => (
            <div className="s2-scope" key={i}><span>{s.label}</span><span className="s2-scope-acc"><I.Check size={13} />{s.access}</span></div>
          ))}
        </div>
        <div className="s2-card-actions">
          <button className="btn btn-primary btn-sm" onClick={onYes}>Connect</button>
          <button className="btn btn-ghost btn-sm" onClick={onNo}>Not now</button>
        </div>
      </div>
    </div>
  );
}

function BlankPrompt({ onPick }) {
  return (
    <div className="s2-blank fade-in">
      <div className="s2-blank-bot"><span className="s2-logo lg" /></div>
      <div className="s2-blank-title">Want to set up something you do often?</div>
      <div className="s2-blank-text">Rather than start from a blank box — tell me a task you repeat each week, or I can look at your recent work and spot one.</div>
      <div className="s2-chips center">
        <button className="s2-chip primary" onClick={() => onPick("repeat")}><I.Repeat size={15} />Set up a repeat task</button>
        <button className="s2-chip" onClick={() => onPick("recent")}><I.Clock size={15} />Look at my recent work</button>
      </div>
    </div>
  );
}

function WorkflowCard({ state, onRun }) {
  const meta = [
    { k: "Trigger", v: "New order in QuickBooks" },
    { k: "Approval", v: "Shop manager sign-off" },
    { k: "Stages", v: "Received → In production → Ready" },
    { k: "Tracking", v: "Hours saved" },
  ];
  return (
    <div className="s2-wfcard fade-in">
      <div className="s2-wfcard-head">
        <div className="s2-wfcard-head-l">
          <div className="s2-card-icon sq"><I.Codex size={18} /></div>
          <div>
            <div className="s2-card-title">Weekly order export cleanup</div>
            <div className="s2-wfcard-sub">Reusable task · saved to Workflows</div>
          </div>
        </div>
        {state === "done"
          ? <span className="pill pill-accent"><span className="dot" />Ran just now</span>
          : <span className="pill"><span className="dot" />Ready</span>}
      </div>
      <div className="s2-wfcard-meta">
        {meta.map((m, i) => (
          <div className="s2-wfcard-row" key={i}><span className="s2-wfcard-k">{m.k}</span><span className="s2-wfcard-v">{m.v}</span></div>
        ))}
      </div>
      <div className="s2-wfcard-foot">
        <button className={"btn btn-primary btn-sm" + (state === "running" ? " is-running" : "")} onClick={onRun} disabled={state === "running"}>
          {state === "running"
            ? <><span className="s2-spin" />Running…</>
            : state === "done"
              ? <><I.Repeat size={15} />Run again</>
              : <><I.Play size={15} />Run</>}
        </button>
        <span className="s2-wfcard-note">Re-runs use Codex consumption past your included cap.</span>
      </div>
    </div>
  );
}

/* ---------------- value variant switcher ---------------- */
function VariantSwitch({ value, onChange }) {
  return (
    <div className="s2-vswitch">
      <span className="s2-vswitch-label">Value panel layout</span>
      <div className="s2-vswitch-seg">
        {["A", "B", "C"].map((v) => (
          <button key={v} className={value === v ? "on" : ""} onClick={() => onChange(v)}>{v}</button>
        ))}
      </div>
    </div>
  );
}

/* ---------------- main app ---------------- */
const ENTRY = {
  repeat: "Repeat task",
  connect: "Connect a tool",
  blank: "Blank page",
};

function App() {
  const [entry, setEntry] = useState("repeat");
  const [phase, setPhase] = useState("trigger"); // trigger | discovery | created | value
  const [thread, setThread] = useState([]);
  const [actions, setActions] = useState(null);
  const [wfState, setWfState] = useState("ready"); // ready | running | done
  const [runs, setRuns] = useState(13);
  const [variant, setVariant] = useState("A");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef(null);
  const idRef = useRef(0);
  const nid = () => ++idRef.current;

  const reset = useCallback((e) => {
    const mode = e || entry;
    setEntry(mode);
    setPhase("trigger");
    setWfState("ready");
    setRuns(13);
    setVariant("A");
    setActions(null);
    setTyping(false);
    if (mode === "blank") {
      setThread([{ id: nid(), kind: "blank" }]);
    } else if (mode === "connect") {
      setThread([
        { id: nid(), who: "user", text: "I want order updates to go out automatically when production status changes." },
        { id: nid(), who: "assistant", text: "I can do that. First I need to see when an order changes — mind connecting QuickBooks?" },
        { id: nid(), kind: "consent" },
      ]);
    } else {
      setThread([
        { id: nid(), who: "user", text: "Here's this week's order export — can you clean it up the usual way?" },
        { id: nid(), who: "assistant", text: "Done. Removed the duplicate SKUs, fixed the date column, and grouped the rows by job number. Cleaned file's ready below." },
        { id: nid(), kind: "trigger" },
      ]);
    }
  }, [entry]);

  useEffect(() => { reset("repeat"); /* eslint-disable-next-line */ }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [thread, actions, typing, phase, variant]);

  const push = (item) => setThread((t) => [...t, { id: nid(), ...item }]);

  // assistant says something after a short typing beat
  const botSay = (text, after) => {
    setActions(null);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      push({ who: "assistant", text });
      if (after) setTimeout(after, 120);
    }, 620);
  };

  // ----- discovery script -----
  const startDiscovery = () => {
    setPhase("discovery");
    botSay("Great — this'll take 30 seconds. What kicks it off each week?", () => {
      setActions({ kind: "chips", items: [
        { label: "A new order in QuickBooks", value: "A new order lands in QuickBooks." },
        { label: "I start it manually", value: "I just start it myself." },
      ], step: "trigger" });
    });
  };

  const onChip = (it, step) => {
    push({ who: "user", text: it.value || it.label });
    setActions(null);
    if (step === "trigger") {
      botSay("Got it. Who signs off before the cleaned file goes out?", () =>
        setActions({ kind: "chips", items: [
          { label: "Shop manager", value: "The shop manager signs off." },
          { label: "No approval needed", value: "No approval — it just goes." },
        ], step: "approval" }));
    } else if (step === "approval") {
      botSay("And what stages does an order move through?", () =>
        setActions({ kind: "chips", items: [
          { label: "Received → In production → Ready", value: "Received → In production → Ready." },
          { label: "Let me type them", value: "Let me type my own stages." },
        ], step: "stages" }));
    } else if (step === "stages") {
      botSay("Last one — and it's the one that matters. What outcome are you actually trying to move? I'll track it in your units, not mine.", () =>
        setActions({ kind: "chips", items: [
          { label: "Hours saved", icon: I.Clock, value: "Hours saved." },
          { label: "Quotes sent", value: "Quotes sent." },
          { label: "Tickets resolved", value: "Tickets resolved." },
          { label: "Cycle time", value: "Cycle time." },
        ], step: "outcome" }));
    } else if (step === "outcome") {
      setPhase("created");
      botSay("Perfect. I'll measure hours saved. Here's your workflow — it lives in the sidebar now, so just run it. No need to ask me again.", () =>
        push({ kind: "workflow" }));
    } else if (step === "blank") {
      startDiscovery();
    }
  };

  const runWorkflow = () => {
    if (wfState === "running") return;
    setWfState("running");
    setTimeout(() => {
      setWfState("done");
      setRuns((r) => r + 1);
      setTimeout(() => {
        setPhase("value");
        botSay("Run complete — file's cleaned and grouped. Here's where this workflow is netting out for you.", () =>
          push({ kind: "value" }));
      }, 500);
    }, 1700);
  };

  // render a thread item
  const renderItem = (it) => {
    if (it.kind === "blank") return <BlankPrompt key={it.id} onPick={() => onChip({ value: "Set up a repeat task." }, "blank")} />;
    if (it.kind === "trigger") return <Msg who="assistant" key={it.id}><TriggerCard onYes={startDiscovery} onNo={() => {}} /></Msg>;
    if (it.kind === "consent") return <Msg who="assistant" key={it.id}><ConsentCard onYes={startDiscovery} onNo={() => {}} /></Msg>;
    if (it.kind === "workflow") return <Msg who="assistant" key={it.id}><WorkflowCard state={wfState} onRun={runWorkflow} /></Msg>;
    if (it.kind === "value") return (
      <Msg who="assistant" key={it.id}>
        <VariantSwitch value={variant} onChange={setVariant} />
        <window.ValuePanel variant={variant} data={{ ...window.VALUE_DATA, runs }} />
      </Msg>
    );
    return <Msg who={it.who} key={it.id} anim>{it.text}</Msg>;
  };

  return (
    <div className="s2-root">
      <Sidebar
        hasWorkflow={phase === "created" || phase === "value"}
        runs={runs}
        onOpenWorkflow={() => {}}
        onNewChat={() => reset("blank")}
      />

      <main className="s2-main">
        <header className="s2-topbar">
          <div className="s2-topbar-title">Order export cleanup</div>
          <div className="s2-entry">
            <span className="s2-entry-label">Entry point</span>
            <div className="s2-entry-seg">
              {Object.keys(ENTRY).map((k) => (
                <button key={k} className={entry === k ? "on" : ""} onClick={() => reset(k)}>{ENTRY[k]}</button>
              ))}
            </div>
          </div>
        </header>

        <div className="s2-scroll" ref={scrollRef}>
          <div className="s2-thread">
            {thread.map(renderItem)}
            {typing && (
              <Msg who="assistant"><div className="s2-typing"><span /><span /><span /></div></Msg>
            )}
            {actions && actions.kind === "chips" && (
              <div className="s2-chips-wrap">
                <Chips items={actions.items} onPick={(it) => onChip(it, actions.step)} />
              </div>
            )}
            <div className="s2-thread-pad" />
          </div>
        </div>

        <div className="s2-composer-wrap">
          <div className="s2-composer">
            <input className="s2-input" placeholder="Ask anything…" />
            <div className="s2-composer-bar">
              <button className="s2-comp-btn"><I.Plus size={18} /></button>
              <div className="s2-composer-right">
                <button className="s2-comp-btn ghost"><I.Mic size={18} /></button>
                <button className="s2-send"><I.Wave size={17} /></button>
              </div>
            </div>
          </div>
          <div className="s2-disclaim">Workflows re-run on demand and use Codex consumption past your included cap.</div>
        </div>
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
