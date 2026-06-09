/* Screen 1 — Operator console data. Realistic, grouped by archetype. */
window.METRICS = [
  { label: "Consumption lift vs holdout", value: "+34", suffix: "%", tone: "accent" },
  { label: "Cap-break rate", value: "41", suffix: "%" },
  { label: "Accounts / operator", value: "86" },
  { label: "Suggestion → outcome", value: "62", suffix: "%" },
  { label: "Opt-out rate", value: "3.2", suffix: "%" },
];

window.ARCHETYPES = [
  {
    id: "signprint",
    title: "Sign & print manufacturers stalled on quote-drafting",
    count: 12,
    workflow: "Quote draft from QuickBooks order",
    unit: "hrs / wk saved",
    accounts: [
      { id: "marlin", name: "Marlin Sign & Print", seg: "80 ppl · Manufacturing", stall: "Activated, drafted one quote, never reused it", value: "~6", unit: "hrs/wk", conf: 0.86, status: "review" },
      { id: "brightway", name: "Brightway Signs", seg: "45 ppl · Manufacturing", stall: "Ran quote-drafting twice, then went quiet 3 wks", value: "~5", unit: "hrs/wk", conf: 0.78, status: "review" },
      { id: "cascade", name: "Cascade Graphics", seg: "120 ppl · Manufacturing", stall: "One workflow run, no repeat", value: "~8", unit: "hrs/wk", conf: 0.81, status: "approved" },
      { id: "northgate", name: "Northgate Press", seg: "30 ppl · Manufacturing", stall: "Held back to measure baseline", value: "—", unit: "", conf: 0, status: "holdout" },
      { id: "vertex", name: "Vertex Signage", seg: "60 ppl · Manufacturing", stall: "Activated last week, no workflow yet", value: "~4", unit: "hrs/wk", conf: 0.72, status: "review" },
    ],
  },
  {
    id: "agency",
    title: "Agencies stalled on proposal drafting",
    count: 7,
    workflow: "Reusable proposal from a one-line brief",
    unit: "proposals / mo",
    accounts: [
      { id: "fieldday", name: "Field Day Studio", seg: "18 ppl · Marketing", stall: "Wrote one proposal with help, didn't save it", value: "~12", unit: "/mo", conf: 0.83, status: "review" },
      { id: "northloop", name: "North Loop Creative", seg: "24 ppl · Marketing", stall: "Two proposals, then stalled", value: "~9", unit: "/mo", conf: 0.69, status: "sent" },
      { id: "atlas", name: "Atlas & Co.", seg: "40 ppl · Marketing", stall: "Suppressed — opted out of suggestions", value: "—", unit: "", conf: 0, status: "suppressed" },
    ],
  },
  {
    id: "law",
    title: "Law firms stalled on email-to-intake",
    count: 4,
    workflow: "Matter-intake summary from inbox thread",
    unit: "intakes / wk",
    accounts: [
      { id: "harbin", name: "Harbin Legal", seg: "3 ppl · Legal", stall: "Drafted one intake summary, never reused", value: "~14", unit: "/wk", conf: 0.79, status: "review" },
      { id: "pell", name: "Pell & Mercer", seg: "9 ppl · Legal", stall: "Running, value accruing", value: "~22", unit: "/wk", conf: 0.9, status: "sustaining" },
    ],
  },
];

window.STATUS = {
  review:    { label: "Needs review", cls: "" },
  approved:  { label: "Approved", cls: "pill-accent" },
  sent:      { label: "Sent", cls: "" },
  sustaining:{ label: "Sustaining", cls: "pill-accent" },
  holdout:   { label: "Holdout", cls: "pill-warn" },
  suppressed:{ label: "Suppressed", cls: "pill-muted" },
};

/* per-account detail (only a few fleshed out; others fall back) */
window.ACCOUNT_DETAIL = {
  marlin: {
    why: [
      "Activated 5 weeks ago, ran quote-drafting once, then no workflow installed.",
      "Drafts customer quotes 10–15× / week — all manual today.",
      "Next-best workflow after quotes: order-status updates.",
    ],
    process: [
      { k: "Trigger", v: "New order in QuickBooks" },
      { k: "Approval", v: "Shop manager sign-off" },
      { k: "Stages", v: "Received → In production → Ready" },
      { k: "Outcome unit", v: "Hours saved (chosen at discovery)" },
    ],
    task: "Read the new QuickBooks order, draft a customer quote from the line items and the shop's standard pricing, hold for shop-manager sign-off, then send.",
    baseline: "Captured at discovery: ~45 min / quote, ~12 quotes / week.",
  },
};
