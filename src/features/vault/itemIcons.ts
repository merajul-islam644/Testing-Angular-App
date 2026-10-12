import { Banknote, CreditCard, Fingerprint, KeyRound, Landmark, ShieldQuestion, Wifi } from "lucide-react";
import type { ItemType } from "./vaultStore";

export function itemIcon(type: ItemType) {
  switch (type) {
    case "Login":
      return KeyRound;
    case "Credit Card":
      return CreditCard;
    case "Identity":
      return Fingerprint;
    case "Secure Note":
      return ShieldQuestion;
    case "Wi-Fi":
      return Wifi;
    case "Bank Account":
      return Landmark;
    case "API Key":
      return Banknote;
    default:
      return KeyRound;
  }
}

export function itemTypeLabel(type: ItemType): string {
  return type;
}