/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import TabButton, { type Tab } from "./TabButton";
import LogbookCard from "./LogBookCard";
import BarangSection from "./BarangSection";

// ─── TYPES ──────────────────────────────────────────────────────────────────

interface ImplementasiTabsProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  trackingId?: string;
  activityPembelian?: any;
  activityPengantaran?: any;
  activityInstalasi?: any;
  onChatClick: (activityId: string, activityJudul: string) => void;
  canAssignPGA: boolean;
  onAssignPGA: (phase: "pembelian" | "pengantaran" | "instalasi") => void;
}

// ─── COMPONENT ──────────────────────────────────────────────────────────────

export default function ImplementasiTabs({
  activeTab,
  onTabChange,
  trackingId,
  activityPembelian,
  activityPengantaran,
  activityInstalasi,
  onChatClick,
  canAssignPGA,
  onAssignPGA,
}: ImplementasiTabsProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      {/* Tab Bar */}
      <div className="px-6 border-b border-gray-100 bg-white">
        <div className="flex gap-8">
          <TabButton
            value="pembelian"
            label="Pembelian Barang"
            activeTab={activeTab}
            onClick={onTabChange}
          />
          <TabButton
            value="pengantaran"
            label="Pengantaran"
            activeTab={activeTab}
            onClick={onTabChange}
          />
          <TabButton
            value="instalasi"
            label="Instalasi"
            activeTab={activeTab}
            onClick={onTabChange}
          />
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-slate-50/50 p-6 space-y-4">
        {activeTab === "pembelian" && (
          <BarangSection
            trackingId={trackingId}
            activityPembelian={activityPembelian}
            onChatClick={onChatClick}
            onAssignPGA={
              canAssignPGA && activityPembelian
                ? () => onAssignPGA("pembelian")
                : undefined
            }
          />
        )}

        {activeTab === "pengantaran" && (
          <LogbookCard
            title="Logbook Operasional Pengantaran"
            activity={activityPengantaran}
            onChatClick={onChatClick}
            onAssignPGA={
              canAssignPGA && activityPengantaran
                ? () => onAssignPGA("pengantaran")
                : undefined
            }
          />
        )}

        {activeTab === "instalasi" && (
          <LogbookCard
            title="Logbook Operasional Instalasi"
            activity={activityInstalasi}
            onChatClick={onChatClick}
            onAssignPGA={
              canAssignPGA && activityInstalasi
                ? () => onAssignPGA("instalasi")
                : undefined
            }
          />
        )}
      </div>
    </div>
  );
}
