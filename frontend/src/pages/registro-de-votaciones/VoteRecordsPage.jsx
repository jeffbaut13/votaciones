import { useEffect } from "react";
import { PageIntro } from "@/components/layout/PageIntro";
import { Card } from "@/components/ui/Card";
import { votingService } from "@/services/voting-service";
import { useVotingStore } from "@/store/voting-store";

export function VoteRecordsPage() {
  const { summary, records, hydrateSummary, hydrateRecords } = useVotingStore();

  useEffect(() => {
    async function loadData() {
      const [summaryResponse, recordsResponse] = await Promise.all([
        votingService.getSummary(),
        votingService.getRecords(),
      ]);
      hydrateSummary(summaryResponse.data.summary);
      hydrateRecords(recordsResponse.data.records);
    }

    loadData().catch(() => undefined);
  }, [hydrateRecords, hydrateSummary]);

  return (
    <div>
      <PageIntro
        eyebrow="Registro"
        title="Resumen y trazabilidad"
        description="Vista base para historial, conteo total y futura adicion de filtros o auditoria."
      />
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <p className="text-xs uppercase tracking-[0.3em] text-brand-300">Resultado A</p>
          <p className="mt-4 font-display text-5xl text-brand-50">{summary.A}</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-[0.3em] text-brand-300">Resultado B</p>
          <p className="mt-4 font-display text-5xl text-brand-50">{summary.B}</p>
        </Card>
      </div>
      <div className="mt-8 space-y-4">
        {records.map((record) => (
          <Card key={record.id}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-brand-100">{record.phoneMasked}</p>
                <p className="text-xs uppercase tracking-[0.25em] text-brand-300">{record.createdAt}</p>
              </div>
              <p className="font-display text-3xl text-accent">{record.option}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
