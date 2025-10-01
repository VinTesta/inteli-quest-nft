import { toast } from "@/components/ui/use-toast";

const BASE_URL = "http://localhost:3000";

export const api = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("jwt");

  const headers = new Headers(options.headers);
  if (token) {
    headers.append("Authorization", `Bearer ${token}`);
  }
  if (!headers.has("Content-Type")) {
    headers.append("Content-Type", "application/json");
  }

  options.headers = headers;

  const response = await fetch(`${BASE_URL}${url}`, options);

  if (response.status === 401) {
    localStorage.removeItem("jwt");
    toast({ title: "Sessão expirada", description: "Faça login novamente." });
    window.location.href = "/login";
  }

  return response;
};

export const getAccountData = async () => {
  const response = await api("/account");
  if (!response.ok) {
    throw new Error("Failed to fetch account data");
  }
  return response.json();
};
