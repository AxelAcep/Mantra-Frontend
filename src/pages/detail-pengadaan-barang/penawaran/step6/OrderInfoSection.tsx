import React from "react";
import { ShoppingCart, FileText, Clock } from "lucide-react";
import OrderCard from "./OrderCard";

// ─── TYPES ──────────────────────────────────────────────────────────────────

export interface OrderInfo {
  noPO: string;
  tanggalPO: string;
  noWO: string;
  tanggalWO: string;
  noDO: string;
  tanggalDO: string;
  waktuPengerjaan: string;
}

interface OrderInfoSectionProps {
  orderInfo: OrderInfo;
  canEditPOAndWaktu: boolean;
  canEditWO: boolean;
  editingField: string | null;
  editNoValue: string;
  onEditField: (noField: string, tanggalField: string) => void;
  onEditValueChange: (v: string) => void;
  onSaveField: (noField: string, tanggalField: string) => void;
  onCancelEdit: () => void;
}

// ─── COMPONENT ──────────────────────────────────────────────────────────────

export default function OrderInfoSection({
  orderInfo,
  canEditPOAndWaktu,
  canEditWO,
  editingField,
  editNoValue,
  onEditField,
  onEditValueChange,
  onSaveField,
  onCancelEdit,
}: OrderInfoSectionProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Purchase Order */}
      <OrderCard
        icon={<ShoppingCart size={16} strokeWidth={2.5} />}
        label="No. Purchase Order"
        value={orderInfo.noPO}
        tanggal={
          orderInfo.tanggalPO
            ? `Terbit ${new Date(orderInfo.tanggalPO).toLocaleDateString(
                "id-ID",
                { day: "numeric", month: "short", year: "numeric" },
              )}`
            : undefined
        }
        canEdit={canEditPOAndWaktu}
        isEditing={editingField === "noPO"}
        editValue={editNoValue}
        onEditClick={() => onEditField("noPO", "tanggalPO")}
        onEditChange={onEditValueChange}
        onSave={() => onSaveField("noPO", "tanggalPO")}
        onCancel={onCancelEdit}
        emptyLabel="Belum tersedia"
      />

      {/* Work Order */}
      <OrderCard
        icon={<FileText size={16} strokeWidth={2.5} />}
        label="No. Work Order"
        value={orderInfo.noWO}
        tanggal={
          orderInfo.tanggalWO
            ? `Terbit ${new Date(orderInfo.tanggalWO).toLocaleDateString(
                "id-ID",
                { day: "numeric", month: "short", year: "numeric" },
              )}`
            : undefined
        }
        canEdit={canEditWO}
        isEditing={editingField === "noWO"}
        editValue={editNoValue}
        onEditClick={() => onEditField("noWO", "tanggalWO")}
        onEditChange={onEditValueChange}
        onSave={() => onSaveField("noWO", "tanggalWO")}
        onCancel={onCancelEdit}
        emptyLabel="Belum tersedia"
      />

      {/* Waktu Pengerjaan */}
      <OrderCard
        icon={<Clock size={16} strokeWidth={2.5} />}
        label="Waktu Pengerjaan"
        value={
          orderInfo.waktuPengerjaan
            ? new Date(orderInfo.waktuPengerjaan).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : ""
        }
        canEdit={canEditPOAndWaktu}
        isEditing={editingField === "waktuPengerjaan"}
        editValue={editNoValue}
        inputType="date"
        onEditClick={() => onEditField("waktuPengerjaan", "waktuPengerjaan")}
        onEditChange={onEditValueChange}
        onSave={() => onSaveField("waktuPengerjaan", "waktuPengerjaan")}
        onCancel={onCancelEdit}
        emptyLabel="Menunggu estimasi waktu"
      />
    </div>
  );
}
