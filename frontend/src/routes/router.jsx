import { createBrowserRouter } from "react-router-dom";
import { AppShell } from "@/app/AppShell";
import { HomePage } from "@/pages/home/HomePage";
import { AuthSmsPage } from "@/pages/auth-sms/AuthSmsPage";
import { VotingPage } from "@/pages/votacion/VotingPage";
import { VoteRecordsPage } from "@/pages/registro-de-votaciones/VoteRecordsPage";
import { EffectsShowcasePage } from "@/pages/effects-lab/EffectsShowcasePage";
import { EffectsShowcaseGLPage } from "@/pages/effects-lab/EffectsShowcaseGLPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "auth-sms", element: <AuthSmsPage /> },
      { path: "votacion", element: <VotingPage /> },
      { path: "registro-de-votaciones", element: <VoteRecordsPage /> },
      { path: "effects-lab", element: <EffectsShowcasePage /> },
      { path: "effects-lab-gl", element: <EffectsShowcaseGLPage /> },
    ],
  },
]);
