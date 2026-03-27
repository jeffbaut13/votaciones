export function Card({ children, className = "" }) {
  return (
    <div className={`rounded-[28px] border border-white/10 bg-white/5 p-6 ${className}`}>
      {children}
    </div>
  );
}
