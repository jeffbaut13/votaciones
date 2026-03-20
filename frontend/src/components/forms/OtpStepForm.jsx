import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { StatusMessage } from "@/components/feedback/StatusMessage";

export function OtpStepForm({ onSubmit, isLoading, feedback }) {
  const [code, setCode] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    await onSubmit(code).catch(() => undefined);
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <label className="block space-y-2">
        <span className="text-sm text-brand-100">Codigo OTP</span>
        <Input
          placeholder="123456"
          maxLength={6}
          value={code}
          onChange={(event) => setCode(event.target.value)}
        />
      </label>
      <StatusMessage tone={feedback?.tone} message={feedback?.message} />
      <Button type="submit" disabled={isLoading || code.length < 4}>
        {isLoading ? "Verificando..." : "Validar codigo"}
      </Button>
    </form>
  );
}
