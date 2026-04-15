import { Navigate, useLocation } from "react-router-dom";
import { SITE_ACCESS_STORAGE_KEY } from "@/constants/site-access";

function hasSiteAccess() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.localStorage.getItem(SITE_ACCESS_STORAGE_KEY) === "true";
}

export function SitePasswordGuard({ children }) {
  const location = useLocation();

  if (hasSiteAccess()) {
    return children;
  }

  const nextPath = encodeURIComponent(
    `${location.pathname}${location.search}${location.hash}`,
  );

  return <Navigate to={`/acceso?next=${nextPath}`} replace />;
}
