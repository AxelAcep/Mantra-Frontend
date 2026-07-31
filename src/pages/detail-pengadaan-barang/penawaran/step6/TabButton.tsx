import React from "react";

// ─── TYPES ──────────────────────────────────────────────────────────────────

export type Tab = "pembelian" | "pengantaran" | "instalasi";

interface TabButtonProps {
  value: Tab;
  label: string;
  activeTab: Tab;
  onClick: (tab: Tab) => void;
}

// ─── COMPONENT ──────────────────────────────────────────────────────────────

export default function TabButton({
  value,
  label,
  activeTab,
  onClick,
}: TabButtonProps) {
  const isActive = activeTab === value;
  return (
    <button
      onClick={() => onClick(value)}
      className={`py-4 text-sm whitespace-nowrap border-b-2 transition-all font-medium ${
        isActive
          ? "border-cyan-500 text-cyan-500 font-bold"
          : "border-transparent text-gray-400 hover:text-gray-600"
      }`}
    >
      {label}
    </button>
  );
}
