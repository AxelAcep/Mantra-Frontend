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

export type KPIItem = {
    pegawaiId: string
    nama: string
    divisi: string
    baik: number
    cukup: number
    buruk: number
}

export type KPIBulanResult = { bulan: number; tahun: number; data: KPIItem[] }
export type KPIYearlyResult = { tahun: number; bulanAwal: number; bulanAkhir: number; data: KPIItem[] }
export type KPIDistribusi = { bulan: number; tahun: number; data: { baik: number; cukup: number; buruk: number } }
export type MasterStats = { totalAktivitas: number; perluKonfirmasiSelesai: number; pengajuanReschedule: number; overdue: number; totalKaryawan: number; karyawanOverdue: number }

export async function getKPIBulan(bulan: number, tahun: number): Promise<KPIBulanResult> {
    const params = new URLSearchParams({ bulan: String(bulan), tahun: String(tahun) })
    const res = await fetchClient(`/kpi?${params}`, { headers: authHeaders() })
    const json = await res.json()
    if (!res.ok) throw new Error(json.error ?? "Gagal mengambil data KPI.")
    return json
}

export async function getKPIYearly(tahun: number, bulanAwal = 1, bulanAkhir = 12): Promise<KPIYearlyResult> {
    const params = new URLSearchParams({ tahun: String(tahun), bulanAwal: String(bulanAwal), bulanAkhir: String(bulanAkhir) })
    const res = await fetchClient(`/kpi/yearly?${params}`, { headers: authHeaders() })
    const json = await res.json()
    if (!res.ok) throw new Error(json.error ?? "Gagal mengambil data KPI tahunan.")
    return json
}

export async function getDistribusiKPI(bulan: number, tahun: number): Promise<KPIDistribusi> {
    const params = new URLSearchParams({ bulan: String(bulan), tahun: String(tahun) })
    const res = await fetchClient(`/kpi/distribusi?${params}`, { headers: authHeaders() })
    const json = await res.json()
    if (!res.ok) throw new Error(json.error ?? "Gagal mengambil distribusi KPI.")
    return json
}

export async function getMasterStats(): Promise<MasterStats> {
    const res = await fetchClient(`/activity/master/stats`, { headers: authHeaders() })
    const json = await res.json()
    if (!res.ok) throw new Error(json.error ?? "Gagal mengambil statistik.")
    return json
}

export type NilaiKPI = "BAIK" | "CUKUP" | "BURUK"

export type AddKPIPayload = {
    nilai: NilaiKPI
    bulan?: number
    tahun?: number
    minggu?: number
}

export async function addKPI(pegawaiId: string, payload: AddKPIPayload): Promise<void> {
    const res = await fetchClient(`/kpi/${pegawaiId}`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(payload),
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json.error ?? "Gagal menambahkan KPI.")
}

export type KPISummary = {
    baik: number
    cukup: number
    buruk: number
}

export type WeeklyTrend = {
    minggu: number
    baik: number
    cukup: number
    buruk: number
}

export type Activity = {
    id: string
    judul: string
    deskripsi: string
    kategori: string
    waktuMulai: string
    targetSelesai: string
    waktuSubmit?: string
    status: string
    perusahaan?: string
    terkaitPO?: string
    nilaiKPI?: NilaiKPI
    pegawai: { nama: string; divisi: string }
}

export type KPIOverviewResponse = {
    pegawai: {
        id: string
        nama: string
        divisi: string
    }
    kpiSummary: KPISummary
    weeklyTrends: WeeklyTrend[] | null
    activities: {
        data: Activity[]
        total: number
        page: number
        totalPages: number
    }
}

export async function getKPIOverview(
    pegawaiId: string,
    page: number,
    bulan: number,
    tahun: number,
    tab: string
): Promise<KPIOverviewResponse> {
    const params = new URLSearchParams({
        page: String(page),
        bulan: String(bulan),
        tahun: String(tahun),
        tab: tab,
    })
    const res = await fetchClient(`/kpi/overview/${pegawaiId}?${params}`, { headers: authHeaders() })
    const json = await res.json()
    if (!res.ok) throw new Error(json.error ?? "Gagal mengambil data KPI.")
    return json
}