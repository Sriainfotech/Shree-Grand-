import { MessageCircle } from "lucide-react";
import { whatsappHref, whatsappMessages } from "@/config/site";
import { trackWhatsApp } from "@/lib/analytics";

/** Floating WhatsApp entry point, present on every page. */
export function WhatsAppFloat() {
  return (
    <a
      href={whatsappHref(whatsappMessages.general)}
      target="_blank"
      rel="noreferrer noopener"
      onClick={() => trackWhatsApp("float")}
      aria-label="Chat with Shri Grand Farm Stay on WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform duration-300 hover:scale-105 focus-visible:scale-105"
    >
      <MessageCircle className="h-6 w-6" aria-hidden />
    </a>
  );
}
