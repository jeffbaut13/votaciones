import { createBrowserRouter } from "react-router-dom";
import { AppShell } from "@/app/AppShell";
import { HomePage } from "@/pages/home/HomePage";
import { AuthSmsPage } from "@/pages/auth-sms/AuthSmsPage";
import { VotingPage } from "@/pages/votacion/VotingPage";
import { EffectsShowcasePage } from "@/pages/effects-lab/EffectsShowcasePage";
import { EffectsShowcaseGLPage } from "@/pages/effects-lab/EffectsShowcaseGLPage";
import { YaVotoEstadoPage } from "@/pages/votacion-estados/YaVotoEstadoPage";
import { HabilitadoEstadoPage } from "@/pages/votacion-estados/HabilitadoEstadoPage";
import { PendienteEstadoPage } from "@/pages/votacion-estados/PendienteEstadoPage";
import { NuevoEstadoPage } from "@/pages/votacion-estados/NuevoEstadoPage";
import { ThankSuccesPage } from "@/pages/votacion-estados/ThankSuccesPage";
import { Terminos } from "@/pages/terminos/Terminos";
import { Thankiu } from "@/pages/success/Thankiu";
import { RegistroDeVotoPage } from "@/pages/registro-de-votaciones/RegistroDeVotoPage";
import { SitePasswordGuard } from "@/components/guards/SitePasswordGuard";
import { SiteAccessPage } from "@/pages/access/SiteAccessPage";

export const router = createBrowserRouter([
  {
    path: "/acceso",
    element: <SiteAccessPage />,
  },
  {
    path: "/",
    element: (
      <SitePasswordGuard>
        <AppShell />
      </SitePasswordGuard>
    ),
    children: [
      { index: true, element: <HomePage /> },
      { path: "auth-sms", element: <AuthSmsPage /> },
      { path: "votacion", element: <VotingPage /> },
      { path: "votacion/estado/ya-voto", element: <YaVotoEstadoPage /> },
      {
        path: "votacion/estado/habilitado",
        element: <HabilitadoEstadoPage />,
      },
      {
        path: "votacion/estado/pendiente",
        element: <PendienteEstadoPage />,
      },
      { path: "votacion/estado/nuevo", element: <NuevoEstadoPage /> },
      { path: "registro-de-voto", element: <RegistroDeVotoPage /> },
      { path: "thank-succes", element: <ThankSuccesPage /> },
      { path: "terminos-y-condiciones", element: <Terminos /> },
      { path: "success", element: <Thankiu /> },
    ],
  },
]);
