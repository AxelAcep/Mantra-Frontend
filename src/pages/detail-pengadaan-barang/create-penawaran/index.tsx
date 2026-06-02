import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useCreateTrackingPenawaran } from "@/hooks/use-create-penawaran";
import { usePerusahaan } from "@/hooks/use-perusahaan";
import {
  ArrowLeft,
  FileText,
  User,
  MapPin,
  Phone,
  Mail,
  Building2,
  Hash,
} from "lucide-react";

type JenisPenawaran =
  | "PAC Montair"
  | "Generator FirePro"
  | "Conventional Sys"
  | "Addressable Sys"
  | "Stand Alone / BTA"
  | "Battery"
  | "Chiller"
  | "UPS"
  | "AC Split / Standing";

const JENIS_PENAWARAN_OPTIONS: JenisPenawaran[] = [
  "PAC Montair",
  "Generator FirePro",
  "Conventional Sys",
  "Addressable Sys",
  "Stand Alone / BTA",
  "Battery",
  "Chiller",
  "UPS",
  "AC Split / Standing",
];

interface CreatePenawaranForm {
  nomorPenawaran: string;
  perusahaanId: string;
  lokasiProyek: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  jenisPenawaran: JenisPenawaran[];
}

function SectionHeading({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-4">
      <h2 className="font-bold text-xl text-slate-800 whitespace-nowrap">
        {title}
      </h2>
      <div className="h-px bg-slate-200 flex-1" />
    </div>
  );
}

function FormField({
  label,
  required,
  children,
  className = "",
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-tight">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all placeholder:text-gray-300";

export default function BuatPenawaran() {
  const navigate = useNavigate();

  const [form, setForm] = useState<CreatePenawaranForm>({
    nomorPenawaran: "",
    perusahaanId: "",
    lokasiProyek: "",
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    jenisPenawaran: [],
  });

  const { data: perusahaanList, isLoading: loadingPerusahaan } =
    usePerusahaan();
  const [perusahaanQuery, setPerusahaanQuery] = useState("");
  const [perusahaanOpen, setPerusahaanOpen] = useState(false);

  const filteredPerusahaan = perusahaanList?.filter((p) =>
    p.nama.toLowerCase().includes(perusahaanQuery.toLowerCase()),
  );

  const selectedPerusahaan = perusahaanList?.find(
    (p) => p.id === form.perusahaanId,
  );

  const set = (key: keyof CreatePenawaranForm, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const toggleJenis = (jenis: JenisPenawaran) => {
    setForm((prev) => ({
      ...prev,
      jenisPenawaran: prev.jenisPenawaran.includes(jenis)
        ? prev.jenisPenawaran.filter((j) => j !== jenis)
        : [...prev.jenisPenawaran, jenis],
    }));
  };

  const isValid =
    form.nomorPenawaran.trim() &&
    form.perusahaanId.trim() &&
    form.lokasiProyek.trim() &&
    form.customerName.trim() &&
    form.customerPhone.trim() &&
    form.customerEmail.trim() &&
    form.jenisPenawaran.length > 0;

  const { loading, error, success, submit } = useCreateTrackingPenawaran();

  useEffect(() => {
    if (!success) return;
    toast.success("Penawaran berhasil dibuat!");
    navigate(-1);
  }, [success]);

  const handleSubmit = () => {
    if (!isValid) return;
    submit(form);
  };

  return (
    <div className="bg-gray-50 p-6 font-sans min-h-screen">
      <div className="mx-auto w-full">
        {/* Header */}
        <div className="flex items-center gap-4 mb-2">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white border border-gray-200 rounded-full hover:bg-gray-50 shadow-sm"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-2xl font-bold text-slate-800">
            Buat Penawaran Baru
          </h1>
        </div>
        <p className="text-sm text-gray-500 mb-8 ml-12">
          Isi data permintaan penawaran untuk diteruskan ke tim pre-sales.
        </p>

        <div className="grid grid-cols-12 gap-6">
          {/* Left — Form */}
          <div className="col-span-12 space-y-6">
            <SectionHeading title="Informasi Penawaran" />

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100/80 flex items-center gap-2 font-bold text-slate-800 text-sm">
                <FileText size={16} className="text-cyan-500" />
                Data Penawaran
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField label="Nomor Penawaran" required>
                  <div className="relative">
                    <Hash
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300"
                    />
                    <input
                      type="text"
                      placeholder="cth. PNW-2025-0142"
                      value={form.nomorPenawaran}
                      onChange={(e) => set("nomorPenawaran", e.target.value)}
                      className={`${inputClass} pl-8`}
                    />
                  </div>
                </FormField>

                <FormField label="Perusahaan" required>
                  <div className="relative">
                    <Building2
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 z-10"
                    />
                    <input
                      type="text"
                      placeholder="Cari perusahaan..."
                      value={
                        perusahaanOpen
                          ? perusahaanQuery
                          : (selectedPerusahaan?.nama ?? "")
                      }
                      onChange={(e) => {
                        setPerusahaanQuery(e.target.value);
                        setPerusahaanOpen(true);
                        if (!e.target.value) set("perusahaanId", "");
                      }}
                      onFocus={() => {
                        setPerusahaanOpen(true);
                        setPerusahaanQuery("");
                      }}
                      onBlur={() =>
                        setTimeout(() => setPerusahaanOpen(false), 150)
                      }
                      className={`${inputClass} pl-8`}
                      disabled={loadingPerusahaan}
                    />
                    {perusahaanOpen && (
                      <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                        {loadingPerusahaan ? (
                          <p className="px-4 py-3 text-sm text-gray-400">
                            Memuat...
                          </p>
                        ) : filteredPerusahaan?.length === 0 ? (
                          <p className="px-4 py-3 text-sm text-gray-400">
                            Tidak ada hasil untuk "{perusahaanQuery}"
                          </p>
                        ) : (
                          filteredPerusahaan?.map((p) => (
                            <button
                              key={p.id}
                              type="button"
                              onMouseDown={() => {
                                set("perusahaanId", p.id);
                                setPerusahaanQuery("");
                                setPerusahaanOpen(false);
                              }}
                              className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-cyan-50 hover:text-cyan-700 ${
                                form.perusahaanId === p.id
                                  ? "bg-cyan-50 text-cyan-700 font-semibold"
                                  : "text-slate-700"
                              }`}
                            >
                              {p.nama}
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </FormField>

                <FormField
                  label="Lokasi Proyek"
                  required
                  className="md:col-span-2"
                >
                  <div className="relative">
                    <MapPin
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300"
                    />
                    <input
                      type="text"
                      placeholder="cth. Gedung Pusat Lt. 5, Jakarta Selatan"
                      value={form.lokasiProyek}
                      onChange={(e) => set("lokasiProyek", e.target.value)}
                      className={`${inputClass} pl-8`}
                    />
                  </div>
                </FormField>
              </div>

              {/* Jenis Penawaran */}
              <div className="px-6 pb-6">
                <div className="border-t border-gray-100 pt-5">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-tight mb-1">
                    Jenis Penawaran <span className="text-red-400">*</span>
                  </p>
                  <p className="text-xs text-gray-400 mb-3">
                    Pilih minimal satu jenis penawaran
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {JENIS_PENAWARAN_OPTIONS.map((jenis) => {
                      const active = form.jenisPenawaran.includes(jenis);
                      return (
                        <button
                          key={jenis}
                          onClick={() => toggleJenis(jenis)}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                            active
                              ? "bg-cyan-50 border-cyan-300 text-cyan-600"
                              : "bg-white border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-600"
                          }`}
                        >
                          {jenis}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <SectionHeading title="Data Customer" />

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100/80 flex items-center gap-2 font-bold text-slate-800 text-sm">
                <User size={16} className="text-cyan-500" />
                Kontak Customer
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField
                  label="Nama Customer"
                  required
                  className="md:col-span-2"
                >
                  <div className="relative">
                    <User
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300"
                    />
                    <input
                      type="text"
                      placeholder="Nama lengkap"
                      value={form.customerName}
                      onChange={(e) => set("customerName", e.target.value)}
                      className={`${inputClass} pl-8`}
                    />
                  </div>
                </FormField>

                <FormField label="Nomor Telepon" required>
                  <div className="relative">
                    <Phone
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300"
                    />
                    <input
                      type="tel"
                      placeholder="08xxxxxxxxxx"
                      value={form.customerPhone}
                      onChange={(e) => set("customerPhone", e.target.value)}
                      className={`${inputClass} pl-8`}
                    />
                  </div>
                </FormField>

                <FormField label="Email" required>
                  <div className="relative">
                    <Mail
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300"
                    />
                    <input
                      type="email"
                      placeholder="email@perusahaan.com"
                      value={form.customerEmail}
                      onChange={(e) => set("customerEmail", e.target.value)}
                      className={`${inputClass} pl-8`}
                    />
                  </div>
                </FormField>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Button */}
        <div className="flex justify-end items-center gap-4 mt-6">
          {error && (
            <p className="text-xs text-red-500 font-semibold">{error}</p>
          )}
          <button
            onClick={handleSubmit}
            disabled={!isValid || loading}
            className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 ${
              isValid && !loading
                ? "bg-cyan-500 text-white hover:bg-cyan-600 shadow-sm shadow-cyan-100"
                : "bg-gray-100 text-gray-300 cursor-not-allowed"
            }`}
          >
            {loading ? "Mengirim..." : "Buat Penawaran"}
          </button>
        </div>
      </div>
    </div>
  );
}
