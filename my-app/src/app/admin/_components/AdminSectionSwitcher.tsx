"use client";

import { useState, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AdminSectionSwitcherProps } from "@/lib/type";



export default function AdminSectionSwitcher({ sections }: AdminSectionSwitcherProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-2 mb-4 bg-muted/40 p-2 rounded-lg shadow-sm">
        {sections.map((section, idx) => (
          <Button
            key={idx}
            variant={idx === activeIndex ? "default" : "ghost"}
            onClick={() => setActiveIndex(idx)}
            className={`rounded-full px-6 py-2 font-semibold transition-all duration-150 ${idx === activeIndex ? "shadow bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"}`}
          >
            {section.label}
          </Button>
        ))}
      </div>

      {/* Active section content */}
      <div className="rounded-lg bg-background shadow p-4">{sections[activeIndex].content}</div>
    </div>
  );
}
