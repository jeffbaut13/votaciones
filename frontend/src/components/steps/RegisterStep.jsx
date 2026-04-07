import { useState } from "react";
import { authService } from "../../services/auth-service.js";
import Button from "../ui/Button.jsx";
import Input from "../ui/Input.jsx";

export default function RegisterStep({ onResult }) {
  const [form, setForm] = useState({ nombre: "", email: "", telefono: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await authService.register(form);
      onResult(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-800">Ingresa tus datos</h2>
        <p className="text-sm text-slate-500 mt-1">
          Recibirás un código de 6 caracteres en tu correo para verificar tu identidad.
        </p>
      </div>

      <Input
        label="Nombre completo"
        name="nombre"
        value={form.nombre}
        onChange={handleChange}
        placeholder="Camilo Hernández"
        required
      />
      <Input
        label="Correo electrónico"
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        placeholder="correo@ejemplo.com"
        required
      />
      <Input
        label="Teléfono"
        name="telefono"
        type="tel"
        value={form.telefono}
        onChange={handleChange}
        placeholder="+57 300 000 0000"
        required
      />

      {error && (
        <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>
      )}

      <Button type="submit" loading={loading} className="w-full">
        Continuar
      </Button>
    </form>
  );
}
