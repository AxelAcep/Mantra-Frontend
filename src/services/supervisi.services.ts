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

export type PegawaiInfo = {
    id: string
    nama: string
    divisi: string
}

export type RescheduleItem = {
    id: string
    activityId: string
    targetSelesaiBaru: string
    alasan: string
    status: "PENDING" | "DITERIMA" | "DITOLAK"
    createdAt: string
}

export type SupervisiActivityItem = {
    id: string
    pegawaiId: string
    pegawai: PegawaiInfo
    kategori: string
    judul: string
    deskripsi: string
    terkaitPO?: string
    perusahaan?: string
    waktuMulai: string
    targetSelesai: string
    waktuSubmit?: string
    status: string
    isSupervised: boolean
    reschedule?: RescheduleItem[]
}

export type PaginatedResponse<T> = {
    data: T[]
    page: number
    pageSize: number
    total: number
    totalPages: number
}

export type SupervisiActivityParams = {
    page?: number
    search?: string
    sortBy?: string
    sortDir?: "asc" | "desc"
    kategori?: string
    status?: string
    isSupervised?: boolean | string
}

export interface DashboardStats {
    totalAktivitasBulanIni: number
    jumlahOverdue: number
    deadlineHariIni: number
}

function buildQuery(params?: Record<string, any>) {
    if (!params) return ""
    const query = new URLSearchParams()

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            query.append(key, String(value))
        }
    })

    return `?${query.toString()}`
}

async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
    const res = await fetchClient(url, {
        ...options,
        headers: {
            ...authHeaders(),
            ...(options?.headers || {}),
        },
    })

    if (!res.ok) {
        const text = await res.text()
        throw new Error(text || "Request gagal")
    }

    return res.json()
}

// ─── API Calls ────────────────────────────────────────────────────────────────

export const supervisiActivityService = {
    getAktif: async (
        params: SupervisiActivityParams = {}
    ): Promise<PaginatedResponse<SupervisiActivityItem>> => {
        return fetchJSON(
            `/activity/supervisi/aktif${buildQuery(params)}`
        )
    },

    getRiwayat: async (
        params: SupervisiActivityParams = {}
    ): Promise<PaginatedResponse<SupervisiActivityItem>> => {
        return fetchJSON(
            `/activity/supervisi/riwayat${buildQuery(params)}`
        )
    },

    markSupervised: async (activityId: string): Promise<void> => {
        await fetchClient(`/activity/supervisi/${activityId}/supervised`, {
            method: "PATCH",
            headers: authHeaders(),
        })
    },

    fetchSupervisiDashboardStats: async (): Promise<DashboardStats> => {
        return fetchJSON<DashboardStats>(`/activity/supervisi/dashboard`)
    },
}

