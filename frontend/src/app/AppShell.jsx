import { Outlet } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";

export function AppShell() {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
}
