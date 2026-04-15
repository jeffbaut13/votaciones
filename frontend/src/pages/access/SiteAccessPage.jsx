import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { env } from "@/config/env";
import { SITE_ACCESS_STORAGE_KEY } from "@/constants/site-access";

export function SiteAccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const requestedNextPath = searchParams.get("next") || "/";
  const nextPath = requestedNextPath.startsWith("/") ? requestedNextPath : "/";
  const isPasswordConfigured = Boolean(env.siteAccessPassword);

  useEffect(() => {
    if (window.localStorage.getItem(SITE_ACCESS_STORAGE_KEY) === "true") {
      navigate(nextPath, { replace: true });
    }
  }, [navigate, nextPath]);

  const submit = (event) => {
    event.preventDefault();

    if (!isPasswordConfigured) {
      setError("Falta configurar VITE_SITE_ACCESS_PASSWORD en Vercel.");
      return;
    }

    if (password === env.siteAccessPassword) {
      window.localStorage.setItem(SITE_ACCESS_STORAGE_KEY, "true");
      navigate(nextPath, { replace: true });
      return;
    }

    setError("Contraseña incorrecta. Intenta de nuevo.");
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-brand-950 px-6 py-10">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md rounded-2xl border border-cb bg-brand-100/80 p-7 backdrop-blur"
      >
        <h1 className="mt-3 font-ppmedium text-4xl leading-none text-brand-50">
          Ingresa la contraseña
        </h1>

        <p className="mt-4 text-sm leading-relaxed text-brand-50/70">
          Este sitio está protegido. Necesitas una contraseña para navegar por
          cualquier ruta.
        </p>

        {!isPasswordConfigured && (
          <p className="mt-3 rounded-lg border border-accent/40 bg-accent/10 px-3 py-2 text-xs text-accent">
            Configuración pendiente: define VITE_SITE_ACCESS_PASSWORD en Vercel.
          </p>
        )}

        <form className="mt-8 space-y-5" onSubmit={submit}>
          <div>
            <label htmlFor="site-password" className="sr-only">
              Contraseña del sitio
            </label>
            <input
              id="site-password"
              type="password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                if (error) {
                  setError("");
                }
              }}
              autoFocus
              className="w-full rounded-xl border border-cb bg-transparent px-4 py-3 text-base text-brand-50 outline-none transition placeholder:text-brand-50/45 focus:border-brand-50"
              placeholder="Escribe la contraseña"
            />
            {error && <p className="mt-2 text-sm text-accent">{error}</p>}
          </div>

          <Button
            type="submit"
            variant="secondary"
            size="xl"
            className="w-full"
          >
            Entrar al sitio
          </Button>
        </form>
      </motion.section>
    </main>
  );
}
