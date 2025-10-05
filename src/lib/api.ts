import { toast } from "@/components/ui/use-toast";

const BASE_URL = "https://inteli-day.inteliblockchain.org";

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

export const getNfts = async () => {
  const response = await api("/nft");
  if (!response.ok) {
    throw new Error("Failed to fetch nfts");
  }
  return response.json();
};

export const getClubs = async () => {
  const response = await api("/clubs");
  if (!response.ok) {
    throw new Error("Failed to fetch clubs");
  }
  return (await response.json())["items"];
};

export const getMissions = async () => {
  const response = await api("/missions/detailed");
  if (!response.ok) {
    throw new Error("Failed to fetch missions");
  }
  return response.json();
}

export const getUserNfts = async (publicKey: string) => {
  const response = await api(`/compressed/recipients/${publicKey}/mints`);
  if (!response.ok) {
    throw new Error("Failed to fetch user nfts");
  }
  return response.json();
}
