export default function Input({ label, error, className = "", ...props }) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-slate-700">{label}</label>
      )}
      <input
        className={`w-full rounded-lg border px-3 py-2.5 text-sm text-slate-800 outline-none transition
          placeholder:text-slate-400
          focus:ring-2 focus:ring-blue-100
          ${error ? "border-red-400 focus:border-red-400" : "border-slate-300 focus:border-blue-500"}
          ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
