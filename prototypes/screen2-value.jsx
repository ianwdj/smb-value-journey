/* Screen 2 — Value panel (the centerpiece), three switchable variants.
   Monochrome stat cards; single green accent on the positive outcome number. */
(function () {
  const React = window.React;
  const { useMemo } = React;
  const I = window.Icon;

  function Spark({ points, w = 132, h = 36, stroke = "var(--accent)", fill = true }) {
    const { d, area, dotX, dotY } = useMemo(() => {
      const max = Math.max(...points), min = Math.min(...points);
      const span = max - min || 1;
      const step = w / (points.length - 1);
      const xy = points.map((p, i) => [i * step, h - 4 - ((p - min) / span) * (h - 8)]);
      const d = xy.map(([x, y], i) => (i ? "L" : "M") + x.toFixed(1) + " " + y.toFixed(1)).join(" ");
      const area = d + ` L ${w} ${h} L 0 ${h} Z`;
      return { d, area, dotX: xy[xy.length - 1][0], dotY: xy[xy.length - 1][1] };
    }, [points, w, h]);
    return React.createElement("svg", { width: w, height: h, viewBox: `0 0 ${w} ${h}`, style: { overflow: "visible", display: "block" } },
      fill && React.createElement("path", { d: area, fill: "var(--accent)", opacity: 0.08 }),
      React.createElement("path", { d, fill: "none", stroke, strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" }),
      React.createElement("circle", { cx: dotX, cy: dotY, r: 3, fill: "var(--accent)" }),
    );
  }

  function Consumption({ data }) {
    const pct = Math.min(100, Math.round((data.used / data.cap) * 100));
    const overPct = Math.min(100, Math.round(((data.used - data.cap) / data.cap) * 100));
    return React.createElement("div", { className: "vp-consume" },
      React.createElement("div", { className: "vp-consume-bar" },
        React.createElement("div", { className: "vp-consume-fill", style: { width: "100%" } }),
        React.createElement("div", { className: "vp-consume-over", style: { width: overPct + "%" } }),
      ),
      React.createElement("div", { className: "vp-consume-key" },
        React.createElement("span", null, React.createElement("i", { className: "k k-base" }), "Included ", React.createElement("span", { className: "tnum" }, data.cap.toLocaleString())),
        React.createElement("span", null, React.createElement("i", { className: "k k-over" }), "Over cap ", React.createElement("span", { className: "tnum" }, "+" + (data.used - data.cap))),
      ),
    );
  }

  // ---------- Variant A: three stat cards ----------
  function VariantA({ d }) {
    return React.createElement("div", { className: "vp vp-a" },
      React.createElement("div", { className: "vp-grid" },
        React.createElement("div", { className: "vp-card" },
          React.createElement("div", { className: "vp-label" }, "Hours saved"),
          React.createElement("div", { className: "vp-num accent tnum" }, "~6", React.createElement("span", { className: "vp-unit" }, "hrs / wk")),
          React.createElement(Spark, { points: d.spark }),
        ),
        React.createElement("div", { className: "vp-card" },
          React.createElement("div", { className: "vp-label" }, "Runs"),
          React.createElement("div", { className: "vp-num tnum" }, d.runs),
          React.createElement("div", { className: "vp-sub" }, "this period"),
        ),
        React.createElement("div", { className: "vp-card" },
          React.createElement("div", { className: "vp-label" }, "Codex usage"),
          React.createElement("div", { className: "vp-num tnum" }, d.used.toLocaleString()),
          React.createElement("div", { className: "vp-sub" }, "+" + (d.used - d.cap) + " over included"),
        ),
      ),
      React.createElement("div", { className: "vp-foot" },
        React.createElement(I.Repeat, { size: 14 }),
        React.createElement("span", null, "Replaces ", React.createElement("b", null, "~45 min"), " of manual cleanup, run ", React.createElement("b", { className: "tnum" }, "14×"), " so far."),
      ),
    );
  }

  // ---------- Variant B: hero number ----------
  function VariantB({ d }) {
    return React.createElement("div", { className: "vp vp-b" },
      React.createElement("div", { className: "vp-hero" },
        React.createElement("div", { className: "vp-hero-l" },
          React.createElement("div", { className: "vp-label" }, "Hours saved · this period"),
          React.createElement("div", { className: "vp-hero-num accent tnum" }, "~6", React.createElement("span", { className: "vp-unit" }, "hrs / week")),
          React.createElement("div", { className: "vp-foot tight" },
            React.createElement(I.Repeat, { size: 14 }),
            React.createElement("span", null, "Replaces ~45 min of manual cleanup, ", React.createElement("b", { className: "tnum" }, "14×"), "."),
          ),
        ),
        React.createElement("div", { className: "vp-hero-r" },
          React.createElement(Spark, { points: d.spark, w: 150, h: 56 }),
          React.createElement("div", { className: "vp-trend" }, React.createElement(I.Trend, { size: 13 }), " trending up 6 wks"),
        ),
      ),
      React.createElement("div", { className: "vp-rowstats" },
        React.createElement("div", null, React.createElement("span", { className: "tnum" }, d.runs), " runs"),
        React.createElement("div", null, React.createElement("span", { className: "tnum" }, d.used.toLocaleString()), " Codex credits"),
        React.createElement("div", null, React.createElement("span", { className: "tnum" }, "+" + (d.used - d.cap)), " over included"),
      ),
    );
  }

  // ---------- Variant C: report rows ----------
  function VariantC({ d }) {
    const rows = [
      { label: "Hours saved", value: "~6", unit: "hrs / wk", accent: true, spark: d.spark },
      { label: "Runs this period", value: d.runs, unit: "" },
      { label: "Codex usage", value: d.used.toLocaleString(), unit: "credits" },
      { label: "Over included cap", value: "+" + (d.used - d.cap), unit: "billed" },
    ];
    return React.createElement("div", { className: "vp vp-c" },
      rows.map((r, i) =>
        React.createElement("div", { className: "vp-line", key: i },
          React.createElement("div", { className: "vp-line-label" }, r.label),
          r.spark && React.createElement("div", { className: "vp-line-spark" }, React.createElement(Spark, { points: r.spark, w: 90, h: 22, fill: false })),
          React.createElement("div", { className: "vp-line-val tnum" + (r.accent ? " accent" : "") }, r.value, r.unit && React.createElement("span", { className: "vp-unit sm" }, r.unit)),
        )
      ),
      React.createElement("div", { className: "vp-foot" },
        React.createElement(I.Repeat, { size: 14 }),
        React.createElement("span", null, "Replaces ~45 min of manual cleanup each run."),
      ),
    );
  }

  function ValuePanel({ variant, data }) {
    const V = variant === "B" ? VariantB : variant === "C" ? VariantC : VariantA;
    return React.createElement("div", { className: "vp-wrap" },
      React.createElement("div", { className: "vp-head" },
        React.createElement("div", { className: "vp-head-l" },
          React.createElement("div", { className: "vp-title" }, "Weekly order export cleanup"),
          React.createElement("div", { className: "vp-head-sub" }, "Value · last 6 weeks"),
        ),
        React.createElement("span", { className: "pill pill-accent" }, React.createElement("span", { className: "dot" }), "Sustaining"),
      ),
      React.createElement(V, { d: data }),
    );
  }

  window.ValuePanel = ValuePanel;
  window.VALUE_DATA = {
    unit: "hours saved", runs: 14, used: 1240, cap: 1000,
    spark: [2, 3, 3, 4, 5, 5, 6],
  };
})();
