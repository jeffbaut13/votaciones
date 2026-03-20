import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Inicio" },
  { to: "/auth-sms", label: "Auth SMS" },
  { to: "/votacion", label: "Votacion" },
  { to: "/registro-de-votaciones", label: "Registros" },
  { to: "/effects-lab", label: "Effects Lab" },
  { to: "/effects-lab-gl", label: "Effects GL" },
];

export function MainLayout({ children }) {
  return (
    <div className="min-dvh">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-brand-950/85 backdrop-blur">
        <div className="mx-auto flex items-center justify-between px-6 py-4">
          <div>
            <p className="font-display text-xl tracking-wide text-brand-100">
              Votaciones
            </p>
            <p className="text-xs uppercase tracking-[0.3em] text-brand-300">
              Logo Decision Flow
            </p>
          </div>
          <nav className="flex gap-2 text-sm">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 transition ${
                    isActive
                      ? "bg-accent text-brand-950"
                      : "text-brand-100 hover:bg-white/10"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full px-6 py-10">{children}</main>
    </div>
  );
}
