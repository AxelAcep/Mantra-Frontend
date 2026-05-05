const BASE_URL = import.meta.env.VITE_API_URL

function logout() {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    localStorage.removeItem("login_at")
    window.location.href = "/"
}

function getToken(): string {
    return localStorage.getItem("token") ?? ""
}

function authHeaders() {
    const loginAt = localStorage.getItem("login_at")
    const TWENTY_HOURS = 20 * 60 * 60 * 1000
    if (!loginAt || Date.now() - parseInt(loginAt) > TWENTY_HOURS) {
        logout()
        throw new Error("Sesi habis.")
    }
    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
    }
}

async function fetchClient(input: string, init?: RequestInit): Promise<Response> {
    const res = await fetch(`${BASE_URL}${input}`, init)
    if (res.status === 401) {
        logout()
        throw new Error("Sesi habis.")
    }
    return res
}

// ─── Types ────────────────────────────────────────────────────────────────────

export type ActivityPegawai = {
    id: string
    nama: string
    divisi: string
}

export type Activity = {
    id: string
    judul: string
    kategori: string
    status: string
    targetSelesai: string
    pegawai: ActivityPegawai
    pegawaiId: string
}

export type PaginatedActivity = {
    data: {
        activity: any
        perusahaan: string
        waktuSubmit: string
        id: string
        pegawaiId: string
        pegawai: { nama: string; divisi: string; pegawaiId: string }
        judul: string
        kategori: string
        targetSelesai: string
        status: string
    }[]
    total: number
    totalPages: number
}

export type MasterRescheduleItem = {
    id: string
    activityId: string
    targetSelesaiBaru: string
    alasan: string
    status: "PENDING" | "DITERIMA" | "DITOLAK" | "KONFIRMASI_SELESAI"
    createdAt: string
    alasanPenolakan?: string
    activity: {
        isSupervised: any
        perusahaan: string
        id: string
        judul: string
        targetSelesai: string
        pegawai: ActivityPegawai
    }
}

export type PaginatedMasterReschedule = {
    data: MasterRescheduleItem[]
    page: number
    pageSize: number
    total: number
    totalPages: number
}

export interface PaginatedMasterSelesai {
  data: any[]
  total: number
  totalPages: number
}
export type KonfirmasiPayload = {
    status: "DITERIMA" | "DITOLAK"
    alasan?: string
    nilaiKPI?: string
}

// ─── Services ─────────────────────────────────────────────────────────────────

export async function getMasterReschedule(page = 1, limit = 10, search = ""): Promise<PaginatedMasterReschedule> {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) })
    if (search) params.set("search", search)

    const res = await fetchClient(`/activity/master/reschedule?${params}`, { headers: authHeaders() })
    const json = await res.json()
    if (!res.ok) throw new Error(json.error ?? "Gagal mengambil data reschedule.")
    return json
}

export async function getMasterSelesai(
    page = 1,
    limit = 10,
    search = "",
    sortBy = "",
    sortDir = ""
): Promise<PaginatedMasterSelesai> {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) })
    if (search) params.set("search", search)
    if (sortBy) params.set("sortBy", sortBy)
    if (sortDir) params.set("sortDir", sortDir)
    const res = await fetchClient(`/activity/master/selesai?${params}`, {
        headers: authHeaders(),
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json.error ?? "Gagal mengambil data konfirmasi selesai.")
    return json
}

export async function getMasterAktif(
    page = 1,
    limit = 10,
    search = "",
    sortBy = "",
    sortDir = "",
    karyawan = "",
    kategori = "",
    status = "",
): Promise<PaginatedActivity> {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) })
    if (search)   params.set("search", search)
    if (sortBy)   params.set("sortBy", sortBy)
    if (sortDir)  params.set("sortDir", sortDir)
    if (karyawan) params.set("karyawan", karyawan)
    if (kategori) params.set("kategori", kategori)
    if (status)   params.set("status", status)
    const res = await fetchClient(`/activity/master/aktif?${params}`, { headers: authHeaders() })
    const json = await res.json()
    if (!res.ok) throw new Error(json.error ?? "Gagal mengambil data aktif.")
    return json
}

    export async function getMasterRiwayat(
        page = 1,
        limit = 10,
        search = "",
        sortBy = "",
        sortDir = "",
        karyawan = "",
        kategori = "",
        status = "",
    ): Promise<PaginatedActivity> {
        const params = new URLSearchParams({ page: String(page), limit: String(limit) })
        if (search)   params.set("search", search)
        if (sortBy)   params.set("sortBy", sortBy)
        if (sortDir)  params.set("sortDir", sortDir)
        if (karyawan) params.set("karyawan", karyawan)
        if (kategori) params.set("kategori", kategori)
        if (status)   params.set("status", status)
        const res = await fetchClient(`/activity/master/riwayat2?${params}`, { headers: authHeaders() })
        const json = await res.json()
        if (!res.ok) throw new Error(json.error ?? "Gagal mengambil data aktif.")
        return json
    }

export async function masterKonfirmasiReschedule(rescheduleId: string, payload: KonfirmasiPayload): Promise<void> {
    const res = await fetchClient(`/activity/reschedule/${rescheduleId}/konfirmasi`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify(payload),
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json.error ?? "Gagal konfirmasi reschedule.")
}

export async function masterKonfirmasiSelesai(activityId: string, payload: KonfirmasiPayload): Promise<void> {
    const res = await fetchClient(`/activity/${activityId}/konfirmasi-selesai`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify(payload),
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json.error ?? "Gagal konfirmasi selesai.")
}

// ─── Types ────────────────────────────────────────────────────────────────────

export type ActivityKolaborator = {
    id: string
    pegawaiId: string
    pegawai: { id: string; nama: string; divisi: string }
    judul: string
    status: string
    childActivityId?: string
}

export type ActivityDokumen = {
    id: string
    namaFile: string
    path: string
    uploadedBy: string
    pegawai: { id: string; nama: string; divisi: string }
    createdAt: string
}

export type ActivityReschedule = {
    id: string
    activityId: string
    targetSelesaiBaru: string
    alasan: string
    status: string
    alasanPenolakan?: string
    createdAt: string
}

export type ActivityDetail = {
    isSupervised: boolean | undefined
    id: string
    pegawaiId: string
    pegawai: { id: string; nama: string; divisi: string }
    kategori: string
    judul: string
    deskripsi: string
    waktuMulai: string
    waktuSubmit?: string
    targetSelesai: string
    terkaitPO?: string
    status: string
    isKonfirmasiKolaborasi: boolean
    kolaborator: ActivityKolaborator[]
    dokumen: ActivityDokumen[]
    reschedule: ActivityReschedule[]
    parent?: { id: string; judul: string; pegawai: { nama: string } }
    perusahaan?: string
    nilaiKPI?: string
    alasanPenolakan?: string
    updatedAt?: string
}

export type ActivityDetailResult = {
    data: ActivityDetail
    isOverdue: boolean
}

// ─── Service ──────────────────────────────────────────────────────────────────

export async function getMasterActivityDetail(id: string): Promise<ActivityDetailResult> {
    const res = await fetchClient(`/activity/master/${id}`, { headers: authHeaders() })
    const json = await res.json()
    if (!res.ok) throw new Error(json.error ?? "Gagal mengambil detail activity.")
    return json
}

export async function updateActivityKPI(id: string, nilai: string): Promise<void> {
    const res = await fetchClient(`/activity/${id}/kpi`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({ nilai }),
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json.error ?? "Gagal update KPI.")
}

export type StatusActivity =
    | "ON_PROGRESS"
    | "PENDING"
    | "PENDING_PEGAWAI"
    | "DITERIMA"
    | "DITOLAK"
    | "DIBATALKAN"
    | "KONFIRMASI_SELESAI"

export type KaryawanItem = {
    id: string
    nama: string
    divisi: string
    baik: number
    cukup: number
    buruk: number
    aktivitasBerjalan: number
    overdueCount: number
    completedCount: number
    totalAktivitas: number
}

export type KaryawanListResult = {
    data: KaryawanItem[]
    total: number
    page: number
    totalPages: number
}

export async function getMasterKaryawan(
    page:   number,
    search: string,
    mode:   "bulan" | "tahun",
    bulan:  number,
    tahun:  number,
    sortBy: string = "",
    sortDir: string = "",
): Promise<KaryawanListResult> {
    const params = new URLSearchParams({
        page:   String(page),
        limit:  "10",
        search,
        mode,
        bulan:  String(bulan),
        tahun:  String(tahun),
    })
    if (sortBy)  params.set("sortBy", sortBy)
    if (sortDir) params.set("sortDir", sortDir)
    const res = await fetchClient(`/activity/master/karyawan?${params}`, { headers: authHeaders() })
    const json = await res.json()
    if (!res.ok) throw new Error(json.error ?? "Gagal mengambil data karyawan.")
    return json
}

export type KPISummary = {
    baik: number
    cukup: number
    buruk: number
}

export type KPIWeekly = {
    minggu: number
    baik: number
    cukup: number
    buruk: number
}

export type DetailKPIResponse = {
    pegawai: {
        id: string
        nama: string
        divisi: string
    }
    summary: KPISummary
    weekly: KPIWeekly[]
}

export async function getDetailKPI(
    pegawaiId: string,
    mode: "bulan" | "tahun",
    bulan: number,
    tahun: number,
): Promise<DetailKPIResponse> {
    const params = new URLSearchParams({
        mode,
        bulan: String(bulan),
        tahun: String(tahun),
    })
    const res = await fetchClient(`/activity/master/kpi/${pegawaiId}?${params}`, { headers: authHeaders() })
    const json = await res.json()
    if (!res.ok) throw new Error(json.error ?? "Gagal mengambil detail KPI.")
    return json
}

export type ActivityRiwayatItem = {
    id: string
    pegawai: { id: string; nama: string; divisi: string }
    judul: string
    kategori: string
    targetSelesai: string
    status: string
}

export type ActivityRiwayatResult = {
    data: ActivityRiwayatItem[]
    total: number
    page: number
    totalPages: number
}

export async function getAllActivityRiwayat(page = 1, limit = 10, search = ""): Promise<PaginatedActivity> {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) })
    if (search) params.append("search", search)
    const res = await fetchClient(`/activity/master/riwayat2?${params}`, { headers: authHeaders() })
    const json = await res.json()
    if (!res.ok) throw new Error(json.error ?? "Gagal mengambil riwayat aktivitas.")
    return json
}

export type PaginatedActivity2 = {
    data: {
        id: string
        pegawai: { nama: string; divisi: string }
        judul: string
        kategori: string
        targetSelesai: string
        status: string
    }[]
    total: number
    totalPages: number
}