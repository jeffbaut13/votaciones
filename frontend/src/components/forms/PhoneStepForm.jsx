import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { StatusMessage } from "@/components/feedback/StatusMessage";
import { normalizePhone } from "@/helpers/format-phone";

export function PhoneStepForm({ onSubmit, isLoading, feedback }) {
  const [phone, setPhone] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    await onSubmit(normalizePhone(phone)).catch(() => undefined);
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <label className="block space-y-2">
        <span className="text-sm text-brand-100">Numero de celular</span>
        <Input
          placeholder="+573001234567"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
        />
      </label>
      <StatusMessage tone={feedback?.tone} message={feedback?.message} />
      <Button type="submit" disabled={isLoading || !phone}>
        {isLoading ? "Validando..." : "Continuar"}
      </Button>
    </form>
  );
}
