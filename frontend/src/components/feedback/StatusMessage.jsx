export function StatusMessage({ tone = "info", message }) {
  if (!message) {
    return null;
  }

  const toneClass = {
    info: "border-brand-300/30 bg-brand-300/10 text-brand-50",
    success: "border-emerald-400/30 bg-emerald-400/10 text-emerald-100",
    error: "border-rose-400/30 bg-rose-400/10 text-rose-100",
    warning: "border-amber-400/30 bg-amber-400/10 text-amber-100",
  };

  return <div className={`rounded-2xl border px-4 py-3 text-sm ${toneClass[tone]}`}>{message}</div>;
}
