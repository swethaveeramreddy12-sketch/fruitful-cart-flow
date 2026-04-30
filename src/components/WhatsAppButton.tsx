import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "919642333337";
const WHATSAPP_MESSAGE = "Hi Anu Natural Foods, I'd like to know more about your mangoes.";

const WhatsAppButton = () => (
  <a
    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Chat with us on WhatsApp"
    className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-white shadow-lg transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#25D366]/60"
  >
    <MessageCircle className="h-5 w-5" />
    <span className="hidden text-sm font-semibold sm:inline">Chat on WhatsApp</span>
  </a>
);

export default WhatsAppButton;
