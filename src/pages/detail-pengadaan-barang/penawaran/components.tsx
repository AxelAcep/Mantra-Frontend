import React from 'react';
import { User, FileText, Download, CheckCircle2 } from 'lucide-react';

export interface LogEntry {
  id: number;
  user: string;
  action: string;
  time: string;
  date: 'HARI INI' | 'KEMARIN';
  type: 'comment' | 'system' | 'success';
}

export function InfoCard({ title, name, sub, initials, icon }: any) {
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-3 h-full">
      <p className="text-[12px] font-bold flex items-center gap-1">
        <span className="text-cyan-600">{icon}</span>
        <span className="text-slate-800">{title}</span>
      </p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 font-bold text-xs shrink-0">
          {initials}
        </div>
        <div className="flex flex-col">
          <p className="text-sm font-bold text-slate-800 leading-none">{name}</p>
          <p className="text-[11px] text-gray-400">{sub}</p>
        </div>
      </div>
    </div>
  );
}

export function InfoCard2({ title, icon }: any) {
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-3 h-full">
      <p className="text-[12px] font-bold flex items-center gap-2">
        <span className="text-cyan-600">{icon}</span>
        <span className="text-slate-800">{title}</span>
      </p>
      <div className="flex items-center gap-3">
        <select className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500">
          <option>Pilih Pre-Sales</option>
          <option>Andi Pratama</option>
          <option>Budi Santoso</option>
        </select>
        <button className="bg-cyan-600 hover:bg-cyan-700 text-white text-sm px-4 py-2 rounded-lg font-medium">
          Simpan
        </button>
      </div>
    </div>
  );
}

export function DetailItem({ label, value, bold, isBadge }: any) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{label}</p>
      {isBadge ? (
        <span className="inline-block px-3 py-1 bg-cyan-50 text-cyan-600 text-[10px] font-bold rounded">{value}</span>
      ) : (
        <p className={`text-xs ${bold ? "font-bold text-slate-800" : "text-slate-600 font-semibold"}`}>{value}</p>
      )}
    </div>
  );
}

export function DocumentItem({ name, size, tag, path, allowDelete }: any) {
  return (
    <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg group transition-colors">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-cyan-50 rounded-lg text-cyan-500">
          <FileText size={18} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="text-xs font-bold text-slate-700">{name}</p>
            {tag && <span className="bg-green-100 text-green-600 text-[8px] font-bold px-1.5 py-0.5 rounded">{tag}</span>}
          </div>
          <p className="text-[10px] text-gray-400">
            {typeof size === 'string' && size.includes("Diunggah") ? size : `Diunggah oleh ${size}`}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {allowDelete && (
          <button className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
          </button>
        )}
        <a href={path} download className="p-2 text-cyan-500 hover:text-cyan-600 hover:bg-cyan-50 rounded transition-colors">
          <Download size={18} />
        </a>
      </div>
    </div>
  );
}

export function LogSection({ title, items }: { title: string, items: LogEntry[] }) {
  if (items.length === 0) return null;
  return (
    <div className="space-y-4">
      <p className="text-[10px] font-bold text-gray-300 tracking-[2px]">{title}</p>
      <div className="relative space-y-6 pl-4 border-l border-gray-100">
        {items.map((log) => (
          <div key={log.id} className="relative">
            <div className={`absolute -left-[21px] top-0 w-[14px] h-[14px] rounded-full border-2 border-white flex items-center justify-center ${log.type === 'success' ? "bg-green-400" : log.type === 'system' ? "bg-slate-400" : "bg-blue-400"
              }`}>
              {log.type === 'success' && <CheckCircle2 size={8} className="text-white" />}
            </div>
            <div className="flex justify-between items-start gap-2">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-800">{log.user} <span className="text-red-500">{log.type === 'comment' ? '●' : ''}</span></p>
                <p className="text-[10px] text-gray-500 leading-relaxed">{log.action}</p>
              </div>
              <span className="text-[9px] text-gray-300 font-medium shrink-0">{log.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
