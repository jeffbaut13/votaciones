import { useState } from "react";
import { votingService } from "../../services/voting-service.js";
import Button from "../ui/Button.jsx";

const CANDIDATES = [
  { id: "A", label: "Candidato A" },
  { id: "B", label: "Candidato B" },
];

export default function VoteStep({ userId, onDone }) {
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!selected) return;
    setError("");
    setLoading(true);
    try {
      await votingService.submitVote({ userId, candidato: selected });
      onDone();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-slate-800">Emite tu voto</h2>
        <p className="text-sm text-slate-500 mt-1">
          Selecciona tu candidato. Tu voto es secreto y anónimo.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {CANDIDATES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setSelected(c.id)}
            className={`rounded-xl border-2 p-5 text-center transition-all
              ${
                selected === c.id
                  ? "border-blue-600 bg-blue-50 shadow-sm"
                  : "border-slate-200 hover:border-blue-300 hover:bg-slate-50"
              }`}
          >
            <div className="text-4xl mb-3">🗳️</div>
            <div
              className={`font-semibold text-sm ${
                selected === c.id ? "text-blue-700" : "text-slate-700"
              }`}
            >
              {c.label}
            </div>
            {selected === c.id && (
              <div className="mt-2 text-xs text-blue-500 font-medium">Seleccionado ✓</div>
            )}
          </button>
        ))}
      </div>

      {!selected && (
        <p className="text-xs text-slate-400 text-center">
          Selecciona un candidato para continuar
        </p>
      )}

      {error && (
        <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>
      )}

      <Button
        type="submit"
        loading={loading}
        className="w-full"
        disabled={!selected}
      >
        Registrar voto
      </Button>
    </form>
  );
}
