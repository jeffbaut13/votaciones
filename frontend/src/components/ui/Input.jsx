export function Input(props) {
  return (
    <input
      className="w-full rounded-2xl border border-white/10 bg-brand-900/60 px-4 py-3 text-brand-50 outline-none transition placeholder:text-brand-300 focus:border-accent"
      {...props}
    />
  );
}
