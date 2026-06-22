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

export interface NotifikasiItem {
    id: string;
    pegawaiId: string;
    activityId?: string;
    activity?: {
        id: string;
        judul: string;
        deskripsi: string;
        kategori: string;
        targetSelesai: string;
        status: string;
        pegawai?: {
            id: string;
            nama: string;
            divisi: string;
        };
        parent?: {
            id: string;
            judul: string;
            pegawai: {
                id: string;
                nama: string;
                divisi: string;
            };
        };
    };
    judul: string;
    pesan: string;
    isRead: boolean;
    createdAt: string;
}

export interface PaginatedNotifikasi {
    data: NotifikasiItem[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export async function getNotifikasiList(page = 1, limit = 10, filter?: string): Promise<PaginatedNotifikasi> {
    const url = `/activity/notifikasi?page=${page}&limit=${limit}${filter ? `&filter=${filter}` : ""}`;
    const res = await fetchClient(url, {
        headers: authHeaders(),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error ?? "Gagal mengambil notifikasi.")
    return data
}

export async function getUnreadNotifikasiCount(filter?: string): Promise<number> {
    const url = `/activity/notifikasi/unread-count${filter ? `?filter=${filter}` : ""}`;
    const res = await fetchClient(url, {
        headers: authHeaders(),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error ?? "Gagal mengambil unread count.")
    return data.unreadCount ?? 0;
}

export async function readNotifikasi(id: string): Promise<void> {
    const res = await fetchClient(`/activity/notifikasi/${id}/read`, {
        method: "PATCH",
        headers: authHeaders(),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error ?? "Gagal menandai notifikasi.")
}

export async function readAllNotifikasi(): Promise<void> {
    const res = await fetchClient(`/activity/notifikasi/read-all`, {
        method: "PATCH",
        headers: authHeaders(),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error ?? "Gagal menandai semua notifikasi.")
}
