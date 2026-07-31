import React from "react";

// ─── TYPES ──────────────────────────────────────────────────────────────────

interface SectionHeadingProps {
  title: string;
}

// ─── COMPONENT ──────────────────────────────────────────────────────────────

export default function SectionHeading({ title }: SectionHeadingProps) {
  return (
    <div className="flex items-center gap-4">
      <h1 className="font-bold text-xl text-slate-800">{title}</h1>
      <div className="h-px bg-slate-200 flex-1" />
    </div>
  );
}
