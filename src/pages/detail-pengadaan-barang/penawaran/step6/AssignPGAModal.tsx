/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// ─── TYPES ──────────────────────────────────────────────────────────────────

type AssignPhase = "pembelian" | "pengantaran" | "instalasi";

interface AssignPGAModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  pgaStaffs: any[] | undefined;
  assignPhase: AssignPhase;
  activityPembelian?: any;
  activityPengantaran?: any;
  activityInstalasi?: any;
  selectedStaffs: string[];
  onSelectedStaffsChange: (staffs: string[]) => void;
  onSubmit: () => void;
  isPending: boolean;
}

// ─── COMPONENT ──────────────────────────────────────────────────────────────

export default function AssignPGAModal({
  isOpen,
  onOpenChange,
  pgaStaffs,
  assignPhase,
  activityPembelian,
  activityPengantaran,
  activityInstalasi,
  selectedStaffs,
  onSelectedStaffsChange,
  onSubmit,
  isPending,
}: AssignPGAModalProps) {
  let currentParent = activityPembelian;
  if (assignPhase === "pengantaran") currentParent = activityPengantaran;
  if (assignPhase === "instalasi") currentParent = activityInstalasi;

  function onToggleStaff(staffId: string, checked: boolean) {
    if (checked) {
      onSelectedStaffsChange([...selectedStaffs, staffId]);
    } else {
      onSelectedStaffsChange(selectedStaffs.filter((id) => id !== staffId));
    }
  }

  const availableStaffs =
    pgaStaffs && pgaStaffs.length > 0
      ? pgaStaffs.filter((p: any) => {
          const isAlreadyAssigned = currentParent?.children?.some(
            (child: any) => child.pegawaiId === p.id,
          );
          return p.role !== "SUPERVISI" && !isAlreadyAssigned;
        })
      : [];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-slate-800">
            Pilih Staff PGA
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <p className="text-sm text-gray-500 mb-4">
            Pilih staff PGA untuk ditugaskan mengecek barang. Mereka akan
            mendapatkan daily activity terpisah.
          </p>
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
            {availableStaffs.length > 0 &&
              availableStaffs.map((staff: any) => {
                return (
                  <label
                    key={staff.id}
                    className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-cyan-500 border-gray-300 rounded focus:ring-cyan-500"
                      checked={selectedStaffs.includes(staff.id)}
                      onChange={(e) =>
                        onToggleStaff(staff.id, e.target.checked)
                      }
                    />
                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        {staff.nama}
                      </p>
                      <p className="text-xs text-gray-400">
                        Divisi {staff.divisi.replace("_", " ")}
                      </p>
                    </div>
                  </label>
                );
              })}
            {availableStaffs.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">
                Tidak ada staff PGA tersedia atau semua staff sudah ditugaskan.
              </p>
            )}
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="font-bold border-gray-200 text-gray-600"
            >
              Batal
            </Button>
            <Button
              onClick={onSubmit}
              disabled={selectedStaffs.length === 0 || isPending}
              className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold"
            >
              {isPending ? "Menyimpan..." : "Tugaskan Staff"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
