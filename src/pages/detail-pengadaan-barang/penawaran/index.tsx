import React, { useState } from 'react';
import ProgressCard from '../progress-card';
import TrackingHeader from '../header-card';
import Step1 from './step1';
import Step2 from './step2';
import Step3 from './step3';
import Step4 from './step4';
import Step5 from './step5';

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
    { n: 8, label: "BAST" },
    { n: 9, label: "Pembayaran" },
    { n: 10, label: "Garansi" },
  ];

  const steps: Step[] = stepsBase.map(s => ({
    ...s,
    status: s.n === activeStep ? "active" : (s.n < activeStep ? "done" : "inactive")
  }));

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 font-sans">
      <div className="max-w-[1440px] mx-auto space-y-6">
        <TrackingHeader
          title="Tracking Penawaran"
          project="PAC Montair"
          code="#PNW-2025-0142"
          company="PT ABC Indonesia"
          status="Dalam Proses"
        />
        <ProgressCard steps={steps} onStepClick={handleStepClick} />

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
          </>
        )}

        {/* Bottom Action Bar */}
        <div className="flex justify-end gap-3 pt-4">
          {(activeStep === 3 || activeStep === 4) ? (
            <>
              <button className="px-6 py-2 bg-red-50 text-red-500 text-sm font-bold rounded-lg border border-red-200 hover:bg-red-100 transition-colors">
                Tolak
              </button>
              <button 
                onClick={() => setActiveStep(prev => Math.max(1, prev - 1))}
                className="px-6 py-2 bg-white border border-cyan-500 text-cyan-500 text-sm font-bold rounded-lg hover:bg-cyan-50 transition-colors"
                >
                Sebelumnya
              </button>
              <button className="px-6 py-2 bg-gray-100 text-gray-400 text-sm font-bold rounded-lg border border-gray-200 cursor-not-allowed">
                Selanjutnya
              </button>
            </>
          ) : (
            <>
              {mode === "sales" && (
                <button className="px-6 py-2 bg-green-500 text-white text-sm font-bold rounded-lg hover:bg-green-600 transition-colors shadow-lg shadow-green-200">
                  Unggah
                </button>
              )}

              {mode !== "sales" && (
                <button className="px-6 py-2 bg-yellow-400 text-white text-sm font-bold rounded-lg hover:bg-yellow-500 transition-colors shadow-lg shadow-yellow-200">
                  Revisi
                </button>
              )}

              <button 
                onClick={() => setActiveStep(prev => Math.max(1, prev - 1))}
                disabled={activeStep === 1}
                className="px-6 py-2 bg-white border border-gray-200 text-cyan-600 text-sm font-bold rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                Sebelumnya
              </button>

              <button 
                onClick={() => setActiveStep(prev => Math.min(10, prev + 1))}
                className="px-6 py-2 bg-cyan-500 text-white text-sm font-bold rounded-lg hover:bg-cyan-600 transition-colors shadow-lg shadow-cyan-200"
                >
                Selanjutnya
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
