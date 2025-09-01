"use client";

import { useState, ReactNode } from "react";

type Props = {
  sections: { label: string; content: ReactNode }[];
};

export default function AdminSectionSwitcher({ sections }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div>
      {/* Tabs */}
      <div className="flex border-b border-gray-300 mb-4">
        {sections.map((section, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`px-4 py-2 font-medium ${
              idx === activeIndex ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"
            }`}
          >
            {section.label}
          </button>
        ))}
      </div>

      {/* Active section content */}
      <div>{sections[activeIndex].content}</div>
    </div>
  );
}
