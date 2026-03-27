export function StepBadge({ step, label, isActive }) {
  return (
    <div className={`rounded-full px-4 py-2 text-xs uppercase tracking-[0.2em] ${isActive ? "bg-accent text-brand-950" : "bg-white/5 text-brand-100"}`}>
      Paso {step}: {label}
    </div>
  );
}
