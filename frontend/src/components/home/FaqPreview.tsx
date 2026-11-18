import { faqItems } from "@/data/faq";
import { SectionHeader } from "@/components/ui/section";
import { WhatsAppButton } from "@/components/ui/actions";
import { whatsappMessages } from "@/config/site";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

/**
 * Homepage FAQ preview. Reuses the exact four Q&As from the About page
 * (src/data/faq.ts) plus three new questions.
 *
 * Two of the three new questions ("decorators/caterers" and "alcohol/DJ")
 * are genuinely unconfirmed policies — those answers are honest
 * placeholders, marked below, exactly like the site's existing
 * "Map coming soon" pattern. The third ("is the property private for our
 * booking") is answered truthfully rather than placeheld, because the site
 * already states this as fact elsewhere (the homepage intro and the About
 * page both say the whole property is exclusive to one booking at a time)
 * — placeholdering it here would just contradict what the site already
 * commits to two sections above.
 */
const newQuestions = [
  {
    id: "private-property",
    question: "Is the whole property private for our booking, or shared with other guests?",
    // Already an established claim (index.tsx intro, about.tsx "Our vision"),
    // not a new one — reused rather than placeheld.
    answer:
      "The whole property is yours for the duration of your booking — there are no shared lobbies and no other bookings running alongside yours.",
  },
  {
    id: "outside-vendors",
    question: "Can we bring our own decorators or caterers?",
    /* CONFIRM WITH PROPERTY: outside catering/decor policy */
    answer:
      "Our policy on outside decorators and caterers is being confirmed with the property. Ask us when you enquire and we'll give you a clear answer before you book.",
  },
  {
    id: "alcohol-dj",
    question: "Is alcohol or a DJ/sound system allowed?",
    /* CONFIRM WITH PROPERTY: alcohol and DJ/sound-system policy */
    answer:
      "Our policy on alcohol and sound systems or DJs is being confirmed with the property. Ask us directly and we'll tell you exactly what's allowed for your date.",
  },
];

const items = [...faqItems, ...newQuestions];

export function FaqPreview() {
  return (
    <section className="section-y bg-secondary/50">
      <div className="shell max-w-3xl">
        <SectionHeader
          eyebrow="FAQ"
          title="Questions before you book"
          intro="The things most people ask before their first conversation with us."
        />
        <Accordion type="single" collapsible className="mt-10">
          {items.map((item) => (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <div className="mt-10">
          <WhatsAppButton
            label="Have another question? Chat on WhatsApp"
            message={whatsappMessages.general}
            context="home_faq"
          />
        </div>
      </div>
    </section>
  );
}
