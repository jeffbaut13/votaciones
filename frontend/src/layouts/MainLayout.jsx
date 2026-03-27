import { Header } from "@/components/header/Header";
import { VideoPop } from "@/components/Video/VideoPopUp";
import { EffectsShowcaseGLPage } from "@/pages/effects-lab/EffectsShowcaseGLPage";

export function MainLayout({ children }) {
  return (
    <>
      <Header />
      <EffectsShowcaseGLPage>{children}</EffectsShowcaseGLPage>
      <VideoPop />
    </>
  );
}
