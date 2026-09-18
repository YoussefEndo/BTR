export interface ValidationError {
  field: string;
  message: string;
}

const PHONE_REGEX = /^\+?[0-9\s.-]{8,20}$/;

export function validateCustomerFields(input: {
  customer_name?: unknown;
  customer_phone?: unknown;
  customer_city?: unknown;
  customer_note?: unknown;
}): ValidationError[] {
  const errors: ValidationError[] = [];
  const name = typeof input.customer_name === "string" ? input.customer_name.trim() : "";
  const phone = typeof input.customer_phone === "string" ? input.customer_phone.trim() : "";
  const city = typeof input.customer_city === "string" ? input.customer_city.trim() : "";
  const note = typeof input.customer_note === "string" ? input.customer_note : "";

  if (name.length < 2 || name.length > 100) {
    errors.push({ field: "customer_name", message: "Nom invalide (2 à 100 caractères)." });
  }
  if (!PHONE_REGEX.test(phone)) {
    errors.push({ field: "customer_phone", message: "Numéro de téléphone invalide." });
  }
  if (city.length < 2 || city.length > 100) {
    errors.push({ field: "customer_city", message: "Ville invalide." });
  }
  if (note.length > 1000) {
    errors.push({ field: "customer_note", message: "Note trop longue (1000 caractères max)." });
  }
  return errors;
}

/** Validates one option value against its option definition. */
export function validateOptionValue(
  option: { name: string; type: string; is_required: boolean },
  rawValue: unknown
): string | null {
  const value = typeof rawValue === "string" ? rawValue.trim() : "";

  if (option.type === "number") {
    if (value === "") {
      return option.is_required ? "Ce champ est requis." : null;
    }
    const num = Number(value);
    if (!Number.isFinite(num) || num <= 0 || num > 100000) {
      return "Doit être un nombre positif.";
    }
    return null;
  }

  // text / select / textarea
  if (value === "") {
    return option.is_required ? "Ce champ est requis." : null;
  }
  if (value.length > 500) {
    return "Valeur trop longue (500 caractères max).";
  }
  return null;
}
