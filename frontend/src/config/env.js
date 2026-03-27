// La URL base del backend. En desarrollo, Vite hace proxy de /api → localhost:4000
// En producción establece VITE_API_BASE_URL a la URL real del servidor.
export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "",
};
