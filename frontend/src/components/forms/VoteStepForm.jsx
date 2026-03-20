import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { VOTING_OPTIONS } from "@/constants/voting-options";

export function VoteStepForm({ selectedOption, onSelect, onSubmit, isSubmitting }) {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        {VOTING_OPTIONS.map((option) => (
          <button key={option.id} type="button" onClick={() => onSelect(option.id)} className="text-left">
            <Card className={selectedOption === option.id ? "border-accent bg-accent/10" : ""}>
              <p className="text-xs uppercase tracking-[0.25em] text-brand-300">Opcion {option.id}</p>
              <h3 className="mt-3 font-display text-2xl text-brand-50">{option.title}</h3>
              <p className="mt-2 text-sm text-brand-100/70">{option.description}</p>
            </Card>
          </button>
        ))}
      </div>
      <Button onClick={onSubmit} disabled={!selectedOption || isSubmitting}>
        {isSubmitting ? "Registrando voto..." : "Registrar voto"}
      </Button>
    </div>
  );
}
