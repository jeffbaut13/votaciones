import { cn } from "@/utils/class-names";

export function Button({ children, className, variant = "primary", ...props }) {
  return (
    <button
      className={cn(
        "rounded-full px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary" && "bg-accent text-brand-950 hover:opacity-90",
        variant === "ghost" && "border border-white/15 bg-white/5 text-brand-50 hover:bg-white/10",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
