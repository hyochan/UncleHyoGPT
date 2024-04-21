import { franc } from "franc";

export function detectLanguage(text: string): string {
  // Convert the text to ISO639-3 language code
  return franc(text, { minLength: 1 });
}
