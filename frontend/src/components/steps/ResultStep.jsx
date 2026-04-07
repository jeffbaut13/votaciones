export default function ResultStep({ type }) {
  const isDone = type === "done";

  return (
    <div className="text-center py-6 space-y-4">
      <div className="text-6xl">{isDone ? "✅" : "🚫"}</div>

      <h2 className="text-xl font-bold text-slate-800">
        {isDone ? "¡Voto registrado!" : "Ya participaste"}
      </h2>

      <p className="text-slate-500 text-sm max-w-xs mx-auto">
        {isDone
          ? "Tu voto ha sido registrado de forma anónima. Gracias por participar en el proceso de votación."
          : "Ya existe un registro de participación asociado a tu correo o teléfono. Solo se permite un voto por persona."}
      </p>
    </div>
  );
}
