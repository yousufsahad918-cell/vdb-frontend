const RAILWAY_URL = "https://web-production-92e501.up.railway.app";
const DEFAULT_WA = "916282878843";

let cachedNumber: string | null = null;

export async function getWhatsAppNumber(): Promise<string> {
  if (cachedNumber) return cachedNumber;
  try {
    const res = await fetch(`${RAILWAY_URL}/settings`, { next: { revalidate: 60 } });
    const data = await res.json();
    cachedNumber = data.whatsapp || DEFAULT_WA;
    return cachedNumber;
  } catch {
    return DEFAULT_WA;
  }
}

export const DEFAULT_WHATSAPP = DEFAULT_WA;
