const STATUS_THEMES: Record<
  string,
  { dot: string; text: string; button: string }
> = {
  draft: {
    dot: "bg-amber-500",
    text: "text-amber-700",
    button:
      "border-amber-500/30 text-amber-700 bg-amber-500/10 hover:bg-amber-500/20",
  },
  published: {
    dot: "bg-emerald-500",
    text: "text-emerald-700",
    button:
      "border-emerald-500/30 text-emerald-700 bg-emerald-500/10 hover:bg-emerald-500/20",
  },
  archived: {
    dot: "bg-slate-500",
    text: "text-slate-700",
    button:
      "border-slate-500/30 text-slate-700 bg-slate-500/10 hover:bg-slate-500/20",
  },
};

const DEFAULT_THEME = {
  dot: "bg-zinc-500",
  text: "text-zinc-700",
  button:
    "border-zinc-500/30 text-zinc-700 bg-zinc-500/10 hover:bg-zinc-500/20",
};

export { STATUS_THEMES, DEFAULT_THEME };
