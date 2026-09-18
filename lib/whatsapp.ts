const FALLBACK_NUMBER = "0000000000";

/** Raw business WhatsApp number from env (international format, no + or spaces). */
export function getWhatsAppNumber(): string {
  const raw = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  if (!raw) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[whatsapp] NEXT_PUBLIC_WHATSAPP_NUMBER is not set");
    }
    return FALLBACK_NUMBER;
  }
  // Defensive: strip +, spaces, dashes if someone pastes a formatted number.
  const digits = raw.replace(/[^\d]/g, "");
  // Defensive: accept Moroccan local format (0X XX XX XX XX) and convert to 212X.
  if (/^0\d{9}$/.test(digits)) {
    return `212${digits.slice(1)}`;
  }
  return digits;
}

export interface WhatsAppOrderData {
  productName: string;
  options: { name: string; value: string }[];
  customerName: string;
  customerPhone: string;
  customerCity: string;
  note?: string | null;
}

/** Builds the French quote-request message shown to the customer in WhatsApp. */
export function buildWhatsAppMessage(data: WhatsAppOrderData): string {
  const lines: string[] = [];

  lines.push("Bonjour,");
  lines.push("");
  lines.push("Je souhaite demander un devis pour le produit suivant :");
  lines.push("");
  lines.push(`Produit : ${data.productName}`);
  lines.push("");

  if (data.options.length > 0) {
    lines.push("Dimensions et options :");
    for (const option of data.options) {
      lines.push(`- ${option.name} : ${option.value}`);
    }
    lines.push("");
  }

  lines.push("Client :");
  lines.push(`Nom : ${data.customerName}`);
  lines.push(`Téléphone : ${data.customerPhone}`);
  lines.push(`Ville : ${data.customerCity}`);

  if (data.note) {
    lines.push("");
    lines.push(`Note : ${data.note}`);
  }

  lines.push("");
  lines.push("Merci.");

  return lines.join("\n");
}

/** Encodes everything into a wa.me click-to-chat URL. */
export function buildWhatsAppUrl(data: WhatsAppOrderData): string {
  const phone = getWhatsAppNumber();
  const message = encodeURIComponent(buildWhatsAppMessage(data));
  return `https://wa.me/${phone}?text=${message}`;
}
