import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    id: "1",
    question: "What programs does Kapiri Mposhi Baraka offer?",
    answer: "We offer a variety of programs including Bootcamp (tech skills), Sports (athletics and fitness), Clubs (interest-based groups), Day-In (daily activities), Outreach (community service), and Library (reading and research resources).",
  },
  {
    id: "2",
    question: "How can I enroll in a program?",
    answer: "You can submit an enrollment form through our website or contact us directly. Visit the Programs page to learn more about each program and fill out the enrollment form.",
  },
  {
    id: "3",
    question: "What is the cost of programs?",
    answer: "Program costs vary. Some programs are free, while others have a nominal fee. Please contact us for specific pricing information about the program you're interested in.",
  },
  {
    id: "4",
    question: "Can I submit my story?",
    answer: "Yes! We welcome student and community stories. Visit our Stories page and use the admin key provided to submit your story. Your submission will be reviewed before publication.",
  },
  {
    id: "5",
    question: "How do I contact the organization?",
    answer: "You can reach us through the contact form on our website, or email us directly. We typically respond within 24-48 hours.",
  },
  {
    id: "6",
    question: "Are there volunteer opportunities?",
    answer: "Yes! We're always looking for volunteers to support our programs. Please contact us to learn about current volunteer opportunities.",
  },
];

export default function FAQSection() {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleFAQ = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-4" style={{ color: "#95ba12" }}>
          Frequently Asked Questions
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-12">
          Find answers to common questions about our programs and services
        </p>

        <div className="space-y-3">
          {faqItems.map((item) => (
            <div
              key={item.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <button
                onClick={() => toggleFAQ(item.id)}
                className="w-full px-6 py-4 flex justify-between items-center bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <span className="font-semibold text-left text-gray-900 dark:text-gray-100">
                  {item.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 transition-transform ${
                    openId === item.id ? "rotate-180" : ""
                  }`}
                  style={{ color: "#e07f10" }}
                />
              </button>

              {openId === item.id && (
                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
