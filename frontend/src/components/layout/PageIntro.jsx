export function PageIntro({ eyebrow, title, description }) {
  return (
    <div className="mb-8 max-w-3xl">
      <p className="mb-3 text-xs uppercase tracking-[0.35em] text-brand-300">{eyebrow}</p>
      <h1 className="font-display text-4xl text-brand-50 md:text-5xl">{title}</h1>
      <p className="mt-4 text-base leading-7 text-brand-100/80">{description}</p>
    </div>
  );
}
