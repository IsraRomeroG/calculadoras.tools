interface FaqJsonLdItem {
  question: string;
  answer: string;
}

export const buildFaqJsonLd = (faqs: FaqJsonLdItem[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
});
