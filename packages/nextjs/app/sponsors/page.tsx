"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "What is BUILD?",
    answer:
      "BUILD is a platform that empowers onchain builders through daily challenges, fostering a community of blockchain developers and enthusiasts."
  },
  {
    question: "How do I participate in daily challenges?",
    answer:
      "To participate in daily challenges, log in to your BUILD account and navigate to the Calendar page. Click on the current day's challenge to view and submit your solution."
  },
  {
    question: "Are the challenges suitable for beginners?",
    answer:
      "BUILD offers challenges for various skill levels, from beginner to advanced. Each challenge is labeled with its difficulty level, allowing you to choose tasks that match your expertise."
  },
  {
    question: "How are solutions evaluated?",
    answer:
      "Solutions are evaluated through a combination of automated testing and peer review. The exact criteria depend on the specific challenge but generally include correctness, efficiency, and code quality."
  },
  {
    question: "What rewards can I earn through BUILD?",
    answer:
      "By completing challenges and contributing to the community, you can earn BUILD tokens, NFT badges, and recognition on our leaderboard. These can enhance your profile and open up opportunities in the blockchain ecosystem."
  },
  {
    question: "How can I become a sponsor for BUILD?",
    answer:
      "If you're interested in sponsoring BUILD, please reach out to our partnerships team at sponsors@build.example.com. We offer various sponsorship packages that can help you connect with our community of talented blockchain developers."
  }
];

export default function Page() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => (prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]));
  };

  return (
    <div className="bg-blue-700 text-white p-4 font-sans">
      <div className="space-y-4">
        {faqData.map((item, index) => (
          <div key={index} className="card bg-blue-800 shadow-xl">
            <div className="card-body p-4">
              <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleItem(index)}>
                <h2 className="card-title text-lg">{item.question}</h2>
                {openItems.includes(index) ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </div>
              {openItems.includes(index) && <p className="mt-2 text-blue-200">{item.answer}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
