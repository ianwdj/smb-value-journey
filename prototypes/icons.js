/* Lucide-style inline icons, 1.5px stroke, currentColor.
   Exposed on window.Icon for use across both screens. */
(function () {
  const React = window.React;
  const s = {
    fill: "none", stroke: "currentColor", strokeWidth: 1.6,
    strokeLinecap: "round", strokeLinejoin: "round",
  };
  function make(paths, vb) {
    return function Icon({ size = 18, style, className }) {
      return React.createElement(
        "svg",
        { width: size, height: size, viewBox: vb || "0 0 24 24", ...s, style, className, "aria-hidden": true },
        paths.map((d, i) =>
          typeof d === "string"
            ? React.createElement("path", { key: i, d })
            : React.createElement(d.t, { key: i, ...d.p })
        )
      );
    };
  }
  window.Icon = {
    NewChat: make(["M12 20h9", "M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"]),
    Search: make([{ t: "circle", p: { cx: 11, cy: 11, r: 7 } }, "m21 21-4.3-4.3"]),
    Library: make([{ t: "rect", p: { x: 3, y: 4, width: 6, height: 16, rx: 1 } }, { t: "rect", p: { x: 11, y: 4, width: 4, height: 16, rx: 1 } }, "M17 4.5 21 6l-2.5 13"]),
    Apps: make([{ t: "circle", p: { cx: 6, cy: 6, r: 1.6 } }, { t: "circle", p: { cx: 12, cy: 6, r: 1.6 } }, { t: "circle", p: { cx: 18, cy: 6, r: 1.6 } }, { t: "circle", p: { cx: 6, cy: 12, r: 1.6 } }, { t: "circle", p: { cx: 12, cy: 12, r: 1.6 } }, { t: "circle", p: { cx: 18, cy: 12, r: 1.6 } }]),
    Workflow: make([{ t: "rect", p: { x: 3, y: 3, width: 7, height: 7, rx: 1.5 } }, { t: "rect", p: { x: 14, y: 14, width: 7, height: 7, rx: 1.5 } }, "M14 7h3a2 2 0 0 1 2 2v3", "M10 17H7a2 2 0 0 1-2-2v-3"]),
    Codex: make([{ t: "circle", p: { cx: 12, cy: 12, r: 9 } }, "m9.5 9-2.5 3 2.5 3", "m14.5 9 2.5 3-2.5 3"]),
    Plus: make(["M12 5v14", "M5 12h14"]),
    Sidebar: make([{ t: "rect", p: { x: 3, y: 4, width: 18, height: 16, rx: 2 } }, "M9 4v16"]),
    ChevDown: make(["m6 9 6 6 6-6"]),
    ChevRight: make(["m9 6 6 6-6 6"]),
    Check: make(["M20 6 9 17l-5-5"]),
    CheckCircle: make([{ t: "circle", p: { cx: 12, cy: 12, r: 9 } }, "m8.5 12 2.5 2.5 4.5-5"]),
    Play: make(["M7 4.5v15l12-7.5z"]),
    Repeat: make(["m17 2 4 4-4 4", "M3 11v-1a4 4 0 0 1 4-4h14", "m7 22-4-4 4-4", "M21 13v1a4 4 0 0 1-4 4H3"]),
    Plug: make(["M9 2v6", "M15 2v6", "M7 8h10v3a5 5 0 0 1-10 0Z", "M12 16v6"]),
    Clock: make([{ t: "circle", p: { cx: 12, cy: 12, r: 9 } }, "M12 7v5l3 2"]),
    Spark: make(["M12 3v3", "M12 18v3", "M3 12h3", "M18 12h3", "m5.6 5.6 2.1 2.1", "m16.3 16.3 2.1 2.1", "m18.4 5.6-2.1 2.1", "m7.7 16.3-2.1 2.1"]),
    Trend: make(["M3 17l6-6 4 4 7-7", "M17 7h4v4"]),
    Send: make(["M22 2 11 13", "M22 2 15 22l-4-9-9-4 20-7Z"]),
    Mic: make([{ t: "rect", p: { x: 9, y: 3, width: 6, height: 11, rx: 3 } }, "M5 11a7 7 0 0 0 14 0", "M12 18v3"]),
    Wave: make(["M4 10v4", "M8 6v12", "M12 8v8", "M16 5v14", "M20 9v6"]),
    User: make([{ t: "circle", p: { cx: 12, cy: 8, r: 4 } }, "M4 21a8 8 0 0 1 16 0"]),
    Sun: make([{ t: "circle", p: { cx: 12, cy: 12, r: 4 } }, "M12 2v2", "M12 20v2", "M4 12H2", "M22 12h-2", "m5 5 1.5 1.5", "m17.5 17.5 1.5 1.5", "m19 5-1.5 1.5", "m6.5 17.5-1.5 1.5"]),
    Moon: make(["M21 12.8A8 8 0 1 1 11.2 3 6.5 6.5 0 0 0 21 12.8Z"]),
    Inbox: make(["M3 12h5l2 3h4l2-3h5", "M5 5h14l2 7v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Z"]),
    Accounts: make([{ t: "circle", p: { cx: 9, cy: 8, r: 3.2 } }, "M3 20a6 6 0 0 1 12 0", "M16 5.2a3.2 3.2 0 0 1 0 5.6", "M18 14a6 6 0 0 1 3 5"]),
    Book: make(["M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2Z", "M4 19a2 2 0 0 0 2 2h13"]),
    Beaker: make(["M9 3h6", "M10 3v6l-5 8a2 2 0 0 0 1.7 3h10.6a2 2 0 0 0 1.7-3l-5-8V3", "M7.5 14h9"]),
    Settings: make([{ t: "circle", p: { cx: 12, cy: 12, r: 3 } }, "M19.4 13a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 1 1-4 0v-.2a1.6 1.6 0 0 0-2.7-1.1l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.6 1.6 0 0 0 4.6 13H4a2 2 0 1 1 0-4h.2a1.6 1.6 0 0 0 1.1-2.7l-.1-.1A2 2 0 1 1 8 3.4l.1.1A1.6 1.6 0 0 0 11 2.6V2a2 2 0 1 1 4 0v.2a1.6 1.6 0 0 0 2.7 1.1l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1A1.6 1.6 0 0 0 21.4 9H22a2 2 0 1 1 0 4Z"]),
    X: make(["M6 6 18 18", "M18 6 6 18"]),
    Edit: make(["M12 20h9", "M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"]),
    ArrowRight: make(["M5 12h14", "m13 6 6 6-6 6"]),
    Dots: make([{ t: "circle", p: { cx: 5, cy: 12, r: 1.4 } }, { t: "circle", p: { cx: 12, cy: 12, r: 1.4 } }, { t: "circle", p: { cx: 19, cy: 12, r: 1.4 } }]),
    Shield: make(["M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6Z"]),
    Lock: make([{ t: "rect", p: { x: 5, y: 11, width: 14, height: 9, rx: 2 } }, "M8 11V8a4 4 0 0 1 8 0v3"]),
    File: make(["M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z", "M14 3v5h5"]),
  };
})();
