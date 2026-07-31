/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import ActivityLogSection from "./ActivityLogSection";
import type { LogEntry } from "./ActivityLogSection";
import SectionHeading from "./SectionHeading";
import OrderInfoSection, { type OrderInfo } from "./OrderInfoSection";
import ImplementasiTabs from "./ImplementasiTabs";
import DokumenSection, { type DokumenItem } from "./DokumenSection";
import AssignPGAModal from "./AssignPGAModal";
import type { Tab } from "./TabButton";
import {
  useDetailImplementasi,
  useUpdateDetailImplementasi,
  useAssignPGAStaff,
} from "@/hooks/use-implementasi";
import { useUnreadChatCount, useDetailActivity } from "@/hooks/use-activity";
import { usePegawaiByDivisi } from "@/hooks/use-penawaran";

// ─── HELPERS ────────────────────────────────────────────────────────────────

function getUserInfo() {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return {
      divisi: user.pegawai?.divisi ?? "",
      role: user.role ?? "",
      nama: user.pegawai?.nama ?? "",
    };
  } catch {
    return { divisi: "", role: "", nama: "" };
  }
}

function formatDateTime(isoString: string) {
  if (!isoString) return "-";
  const date = new Date(isoString);
  const dateStr = date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const timeStr =
    date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    }) + " WIB";
  return `${dateStr} pukul ${timeStr}`;
}

// ─── TYPES ──────────────────────────────────────────────────────────────────

interface Step6Props {
  trackingId?: string;
  onChatClick: (activityId: string, activityJudul: string) => void;
}

// ─── COMPONENT ──────────────────────────────────────────────────────────────

export default function Step6({ trackingId, onChatClick }: Step6Props) {
  const userInfo = getUserInfo();
  const isMasterOrManager =
    userInfo.role === "MASTER" || userInfo.divisi === "MANAGER_OPERASIONAL";
  const isAdminProyek =
    userInfo.divisi === "MAINTENANCE_PAC" ||
    userInfo.divisi === "MAINTENANCE_FIRE";
  const isKepalaPGA =
    userInfo.divisi === "PROCUREMENT_GA" && userInfo.role === "SUPERVISI";

  const canEditPOAndWaktu = isMasterOrManager || isAdminProyek;
  const canEditWO = isMasterOrManager || isKepalaPGA;
  const canAssignPGA = isKepalaPGA;

  // ── States ──
  const [activeTab, setActiveTab] = useState<Tab>("pembelian");
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedStaffs, setSelectedStaffs] = useState<string[]>([]);
  const [assignPhase, setAssignPhase] = useState<
    "pembelian" | "pengantaran" | "instalasi"
  >("pembelian");
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editNoValue, setEditNoValue] = useState("");
  const [editTanggalValue, setEditTanggalValue] = useState("");

  // ── Queries & Mutations ──
  const { data: implData, loading: implLoading } =
    useDetailImplementasi(trackingId);
  const updateDetailMut = useUpdateDetailImplementasi(trackingId ?? "");
  const { data: pgaStaffs } = usePegawaiByDivisi("PROCUREMENT_GA");
  const assignPgaMut = useAssignPGAStaff(trackingId ?? "");

  const { data: pembelianDetail } = useDetailActivity(
    implData?.activityPembelian?.id ?? "",
  );
  const { data: pengantaranDetail } = useDetailActivity(
    implData?.activityPengantaran?.id ?? "",
  );
  const { data: instalasiDetail } = useDetailActivity(
    implData?.activityInstalasi?.id ?? "",
  );

  // ── Functions ──

  function onAssignSubmit() {
    if (selectedStaffs.length === 0) return;
    assignPgaMut.mutate(
      { staffIds: selectedStaffs, phase: assignPhase },
      {
        onSuccess: () => {
          setIsAssignModalOpen(false);
          setSelectedStaffs([]);
          setAssignPhase("pembelian");
        },
      },
    );
  }

  function onOpenAssignModal(phase: "pembelian" | "pengantaran" | "instalasi") {
    setAssignPhase(phase);
    setIsAssignModalOpen(true);
  }

  function onEditField(noField: string, tanggalField: string) {
    setEditingField(noField);
    setEditNoValue(orderInfo[noField as keyof typeof orderInfo]);
    setEditTanggalValue(orderInfo[tanggalField as keyof typeof orderInfo]);
  }

  function onSaveField(noField: string, tanggalField: string) {
    const defaultDate =
      orderInfo[tanggalField as keyof typeof orderInfo] ||
      new Date().toISOString().slice(0, 10);
    const newOrderInfo = {
      ...orderInfo,
      [noField]: editNoValue,
      [tanggalField]: noField === "waktuPengerjaan" ? editNoValue : defaultDate,
    };

    updateDetailMut.mutate({
      noPO: newOrderInfo.noPO,
      tanggalPO: newOrderInfo.tanggalPO || undefined,
      noWO: newOrderInfo.noWO,
      tanggalWO: newOrderInfo.tanggalWO || undefined,
      noDO: newOrderInfo.noDO,
      tanggalDO: newOrderInfo.tanggalDO || undefined,
      waktuPengerjaan: newOrderInfo.waktuPengerjaan || undefined,
    });
    setEditingField(null);
  }

  function onCancelEdit() {
    setEditingField(null);
  }

  // ── Derived data ──

  const orderInfo: OrderInfo = !implData
    ? {
        noPO: "",
        tanggalPO: "",
        noWO: "",
        tanggalWO: "",
        noDO: "",
        tanggalDO: "",
        waktuPengerjaan: "",
      }
    : {
        noPO: implData.noPO ?? "",
        tanggalPO: implData.tanggalPO
          ? new Date(implData.tanggalPO).toISOString().slice(0, 10)
          : "",
        noWO: implData.noWO ?? "",
        tanggalWO: implData.tanggalWO
          ? new Date(implData.tanggalWO).toISOString().slice(0, 10)
          : "",
        noDO: implData.noDO ?? "",
        tanggalDO: implData.tanggalDO
          ? new Date(implData.tanggalDO).toISOString().slice(0, 10)
          : "",
        waktuPengerjaan: (implData as any).waktuPengerjaan
          ? new Date((implData as any).waktuPengerjaan)
              .toISOString()
              .slice(0, 10)
          : "",
      };

  const logs: LogEntry[] =
    implData?.logs && implData.logs.length > 0
      ? implData.logs.map((log, i) => {
          const d = log.createdAt ? new Date(log.createdAt) : new Date();
          return {
            id: i + 1,
            user: log.namaPegawai || "System",
            action: log.keterangan
              ? `${log.aksi}: ${log.keterangan}`
              : log.aksi || "-",
            time: d.toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            date: d.toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }),
            type: "system" as const,
          };
        })
      : [];

  const combinedDokumen: DokumenItem[] = React.useMemo(() => {
    const docs: DokumenItem[] = [];

    pembelianDetail?.data?.dokumen?.forEach((doc: any) => {
      docs.push({
        name: doc.namaFile,
        uploader: `${doc.pegawai?.nama || doc.uploadedBy || "Karyawan"} pada ${formatDateTime(doc.createdAt)} - ${implData?.activityPembelian?.judul || "Pembelian Barang"}`,
        path: doc.path,
      });
    });

    pengantaranDetail?.data?.dokumen?.forEach((doc: any) => {
      docs.push({
        name: doc.namaFile,
        uploader: `${doc.pegawai?.nama || doc.uploadedBy || "Karyawan"} pada ${formatDateTime(doc.createdAt)} - ${implData?.activityPengantaran?.judul || "Pengantaran"}`,
        path: doc.path,
      });
    });

    instalasiDetail?.data?.dokumen?.forEach((doc: any) => {
      docs.push({
        name: doc.namaFile,
        uploader: `${doc.pegawai?.nama || doc.uploadedBy || "Karyawan"} pada ${formatDateTime(doc.createdAt)} - ${implData?.activityInstalasi?.judul || "Instalasi"}`,
        path: doc.path,
      });
    });

    // Deduplicate by path
    const seenPaths = new Set<string>();
    const result: DokumenItem[] = [];
    docs.forEach((d) => {
      if (!seenPaths.has(d.path)) {
        seenPaths.add(d.path);
        result.push(d);
      }
    });

    return result;
  }, [
    pembelianDetail,
    pengantaranDetail,
    instalasiDetail,
    implData?.activityPembelian?.judul,
    implData?.activityPengantaran?.judul,
    implData?.activityInstalasi?.judul,
  ]);

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* ── Left Column ── */}
      <div className="col-span-12 lg:col-span-9 space-y-6">
        <SectionHeading title="Detail" />

        <OrderInfoSection
          orderInfo={orderInfo}
          canEditPOAndWaktu={canEditPOAndWaktu}
          canEditWO={canEditWO}
          editingField={editingField}
          editNoValue={editNoValue}
          onEditField={onEditField}
          onEditValueChange={setEditNoValue}
          onSaveField={onSaveField}
          onCancelEdit={onCancelEdit}
        />

        <ImplementasiTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          trackingId={trackingId}
          activityPembelian={implData?.activityPembelian}
          activityPengantaran={implData?.activityPengantaran}
          activityInstalasi={implData?.activityInstalasi}
          onChatClick={onChatClick}
          canAssignPGA={canAssignPGA}
          onAssignPGA={onOpenAssignModal}
        />

        <DokumenSection dokumen={combinedDokumen} />
      </div>

      {/* ── Right Column: Log Aktivitas ── */}
      <div className="col-span-12 lg:col-span-3">
        <ActivityLogSection logs={logs} />
      </div>

      {/* ── Modal Pilih Staff PGA ── */}
      <AssignPGAModal
        isOpen={isAssignModalOpen}
        onOpenChange={setIsAssignModalOpen}
        pgaStaffs={pgaStaffs}
        assignPhase={assignPhase}
        activityPembelian={implData?.activityPembelian}
        activityPengantaran={implData?.activityPengantaran}
        activityInstalasi={implData?.activityInstalasi}
        selectedStaffs={selectedStaffs}
        onSelectedStaffsChange={setSelectedStaffs}
        onSubmit={onAssignSubmit}
        isPending={assignPgaMut.isPending}
      />
    </div>
  );
}
