const rawApiBase =
  typeof import.meta !== "undefined" && import.meta.env
    ? import.meta.env.VITE_API_BASE ?? ""
    : "";

export const API_BASE: string = rawApiBase.replace(/\/$/, "");
export const apiUrl = (path: string): string => `${API_BASE}${path}`;
