export const DEFAULT_WHATSAPP = "916282878843";

export async function getWhatsAppNumber(): Promise<string> {
  return DEFAULT_WHATSAPP;
}

export const CITY = "Bangalore";

export const WHATSAPP = {
  number: "916282878843",
  url: "https://wa.me/916282878843",
  orderLink: (productName?: string, flavour?: string) => {
    const base = "https://wa.me/916282878843";
    const city = "Bangalore";
    const greetings = ["Hi", "Hey", "Hello", "Hi there"];
    const confirmPhrases = [
      `Please confirm availability and delivery time in ${city}.`,
      `Can you confirm if this is available in ${city}?`,
      `Let me know the availability and ETA in ${city}.`,
      `How soon can this be delivered in ${city}?`,
      `Please check availability and confirm delivery to ${city}.`,
    ];
    const listPhrases = [
      `I want to place an order from ${city}. Please share what's available.`,
      `Can I see your current product list? I'm in ${city}.`,
      `I'd like to order something. I'm based in ${city}.`,
      `Please share your menu. Ordering from ${city}.`,
    ];
    const r = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
    const greeting = r(greetings);
    const confirm = r(confirmPhrases);
    if (productName) {
      const msg = flavour
        ? `${greeting}, I want to order ${productName} — ${flavour} flavour. ${confirm}`
        : `${greeting}, I want to order ${productName}. ${confirm}`;
      return `${base}?text=${encodeURIComponent(msg)}`;
    }
    return `${base}?text=${encodeURIComponent(`${greeting}, ${r(listPhrases)}`)}`;
  },
};
