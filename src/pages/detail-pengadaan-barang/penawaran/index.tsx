import React, { useState } from 'react';
import ProgressCard from '../progress-card';
import TrackingHeader from '../header-card';
import Step1 from './step1';
import Step2 from './step2';
import Step3 from './step3';
import Step4 from './step4';
import Step5 from './step5';
import Step6 from './step6';
import StepRestricted from './step-restricted';
import { Button } from '@/components/ui/button';
import {
  ChevronLeft,
  ChevronRight,
  XCircle,
  CheckCircle,
  Upload,
  FileEdit
} from 'lucide-react';

interface Step {
  n: number;
  label: string;
  status: "active" | "inactive" | "done";
}

function getUserRole(): string {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return user.pegawai.divisi || "";
  } catch {
    return "";
  }
}

const ADMIN_ROLES = ["SEKERTARIAT", "DIREKTUR", "MANAGER_OPERASIONAL", "KOMISARIS"];

function detectMode(divisi: string): "sales" | "admin" | "forbidden" {
  if (divisi === "SALES") return "sales";
  if (ADMIN_ROLES.includes(divisi)) return "admin";
  return "forbidden";
}

export default function PenawaranPage() {
  const [divisiOverride, setDivisiOverride] = useState<string>(() => getUserRole() || "SALES");
  const mode = detectMode(divisiOverride);
  const [activeStep, setActiveStep] = useState(1);

  const handleStepClick = (stepNumber: number) => {
    setActiveStep(stepNumber);
  };

  const stepsBase = [
    { n: 1, label: "Permintaan Masuk" },
    { n: 2, label: "Penyusunan BoQ" },
    { n: 3, label: "Review Internal" },
    { n: 4, label: "Persetujuan Manajemen" },
    { n: 5, label: "Follow Up" },
    { n: 6, label: "Implementasi" },
    { n: 7, label: "BAST" },
    { n: 8, label: "Pembayaran" },
    { n: 9, label: "Garansi" },
  ];

  const steps: Step[] = stepsBase.map(s => ({
    ...s,
    status: s.n === activeStep ? "active" : (s.n < activeStep ? "done" : "inactive")
  }));

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 font-sans flex flex-col">
      <div className="max-w-[1440px] mx-auto w-full flex-1 flex flex-col space-y-6">
        <TrackingHeader
          title="Tracking Penawaran"
          project="PAC Montair"
          code="#PNW-2025-0142"
          company="PT ABC Indonesia"
          status="Dalam Proses"
        />
        <ProgressCard steps={steps} onStepClick={handleStepClick} />

        <div className="flex-1">
          {mode == "forbidden" && (
            <div className="flex flex-col h-full">
              <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 text-center flex-1 flex items-center justify-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Akses Ditolak</h2>
                  <p className="text-gray-600 mb-6">
                    Anda tidak memiliki izin untuk melihat detail penawaran ini.
                  </p>
                </div>
              </div>
            </div>
          )}

          {mode !== "forbidden" && (
            <>
              {activeStep === 1 && <Step1 mode={mode} />}
              {activeStep === 2 && <Step2 />}
              {activeStep === 3 && <Step3 />}
              {activeStep === 4 && <Step4 />}
              {activeStep === 5 && <Step5 />}
              {activeStep === 6 && <Step6 />}
            </>
          )}
        </div>

        {/* Bottom Action Bar — Sticky di bawah */}
        <div className="sticky bottom-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-t border-gray-200 p-4 px-6 flex justify-end items-center gap-3 mt-8 -mx-6 -mb-6">
          <Button
            variant="outline"
            className="bg-red-50 border-red-100 text-red-500 hover:bg-red-100 hover:text-red-600 font-bold px-6 h-10 rounded-lg"
          >
            Tolak
          </Button>

          {/* Hidden for now: Unggah & Revisi */}
          {/* 
          {mode === "sales" && (
            <Button className="bg-green-500 hover:bg-green-600 text-white font-bold shadow-lg shadow-green-100">
              <Upload className="w-4 h-4 mr-2" />
              Unggah
            </Button>
          )}

          {mode !== "sales" && (
            <Button className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold shadow-lg shadow-yellow-100">
              <FileEdit className="w-4 h-4 mr-2" />
              Revisi
            </Button>
          )} 
          */}

          <Button
            variant="outline"
            onClick={() => setActiveStep(prev => Math.max(1, prev - 1))}
            disabled={activeStep === 1}
            className="border-cyan-500 text-cyan-500 hover:bg-cyan-50 font-bold px-6 h-10 rounded-lg disabled:opacity-50"
          >
            Sebelumnya
          </Button>

          <Button
            onClick={() => setActiveStep(prev => Math.min(10, prev + 1))}
            disabled={activeStep === 10}
            className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold px-6 h-10 rounded-lg shadow-sm"
          >
            Selanjutnya
          </Button>
        </div>

      </div>
    </div>
  );
}
