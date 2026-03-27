export function FlowSection() {
  const steps = [
    "Ingresar numero y validar si ya existe voto",
    "Enviar y validar OTP",
    "Habilitar seleccion A o B",
    "Registrar voto y mostrar resumen",
  ];

  return (
    <section className="grid gap-4 py-8 md:grid-cols-4">
      {steps.map((step, index) => (
        <div key={step} className="rounded-[28px] border border-white/10 bg-white/5 p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-brand-300">Paso {index + 1}</p>
          <p className="mt-4 text-base leading-7 text-brand-50">{step}</p>
        </div>
      ))}
    </section>
  );
}
