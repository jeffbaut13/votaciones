const STEPS = ["Registro", "Verificación", "Votación"];

export default function StepIndicator({ current }) {
  return (
    <div className="flex items-center justify-center">
      {STEPS.map((label, index) => (
        <div key={index} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all
                ${
                  index < current
                    ? "bg-blue-600 text-white"
                    : index === current
                    ? "bg-blue-600 text-white ring-4 ring-blue-100"
                    : "bg-slate-200 text-slate-500"
                }`}
            >
              {index < current ? "✓" : index + 1}
            </div>
            <span
              className={`text-xs mt-1 font-medium ${
                index === current ? "text-blue-600" : "text-slate-400"
              }`}
            >
              {label}
            </span>
          </div>

          {index < STEPS.length - 1 && (
            <div
              className={`h-0.5 w-14 mx-1 mb-4 transition-all ${
                index < current ? "bg-blue-600" : "bg-slate-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
