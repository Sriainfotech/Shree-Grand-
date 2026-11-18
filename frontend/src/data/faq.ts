/**
 * Shared FAQ content.
 *
 * `faqItems` is the exact copy that has always lived on the About page
 * ("Good to know — Common questions") — extracted here so it can be reused
 * (e.g. by the homepage FAQ preview) without duplicating the text. Do not
 * reword these four; if the underlying policy changes, update it once here.
 */
export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export const faqItems: FaqItem[] = [
  {
    id: "checkin",
    question: "What are the check-in and check-out times?",
    answer:
      "Check-in is at 12:00 PM and check-out is at 10:00 AM. If your plans need a different window, tell us when you enquire and we will see what can be arranged for your dates.",
  },
  {
    id: "advance",
    question: "How do I confirm a booking?",
    answer:
      "A 50% advance confirms a booking, payable online or offline. The balance and any remaining details are settled once the stay or event is finalised.",
  },
  {
    id: "group",
    question: "Is there a fixed limit on group size?",
    answer:
      "Capacity is based on the party and the spaces you need — there is no fixed published cap. Share your expected group size when you enquire and we will confirm what fits comfortably for your dates.",
  },
  {
    id: "cancel",
    question: "What is the cancellation policy?",
    answer:
      "The cancellation policy is confirmed at the time of booking, since it can depend on your dates and how far in advance you are booking. Ask us directly and we will lay it out before you pay any advance.",
  },
];
