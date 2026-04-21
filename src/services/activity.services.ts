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

export type Activity = {
    id: string
    pegawaiId: string
    pegawai: { id: string; nama: string; divisi: string }
    parentId?: string
    parent?: {
        id: string
        judul: string
        pegawai: { id: string; nama: string; divisi: string }
    }
    terkaitPO?: string
    perusahaan?: string
    kategori: string
    judul: string
    deskripsi: string
    waktuMulai: string
    targetSelesai: string
    isKonfirmasiKolaborasi: boolean
    waktuSubmit?: string
    status: "ON_PROGRESS" | "PENDING" | "DITERIMA" | "DITOLAK" | "PENDING_PEGAWAI" | "KONFIRMASI_SELESAI"
    createdAt: string
    updatedAt: string
    alasanPenolakan: string
    nilaiKPI?: string
    isSupervised: boolean
}

export type PaginatedActivity = {
    data: Activity[]
    meta: {
        page: number
        limit: number
        total: number
        totalPages: number
    }
}

export type ActivityCount = {
    aktif: number
    deadlineHariIni: number
    approval: number
    overdue: number
}

export type KolaboratorPayload = {
    pegawaiId: string
    judul: string
    deskripsi: string
    kategori: string
}

export type UpdateActivityPayload = {
    terkaitPO?: string
    perusahaan?: string
    kategori: string
    judul: string
    deskripsi: string
}

export type CreateActivityPayload = {
    terkaitPO?: string
    perusahaan?: string
    kategori: string
    judul: string
    deskripsi: string
    waktuMulai: string
    targetSelesai: string
    kolaborator: KolaboratorPayload[]
}

async function fetchActivity(endpoint: string, page = 1, limit = 10): Promise<PaginatedActivity> {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) })
    const res = await fetchClient(`/activity/${endpoint}?${params}`, { headers: authHeaders() })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error ?? "Gagal mengambil data.")
    return data
}

export async function readAllChat(): Promise<void> {
    const res = await fetchClient(`/activity/chat/read-all`, {
        method: "PATCH",
        headers: authHeaders(),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error ?? "Gagal menandai semua chat.")
}

export const getAllActivityBerjalan = (page?: number, limit?: number) => fetchActivity("berjalan", page, limit)
export const getAllActivityAktif = (page?: number, limit?: number) => fetchActivity("aktif", page, limit)
export const getAllActivityPending = (page?: number, limit?: number) => fetchActivity("pending", page, limit)
export const getAllActivityPerluTindakan = (page?: number, limit?: number) => fetchActivity("perlu-tindakan", page, limit)
export const getAllActivityRiwayat = (page?: number, limit?: number) => fetchActivity("riwayat", page, limit)

export async function getActivityCount(): Promise<ActivityCount> {
    const res = await fetchClient(`/activity/count`, { headers: authHeaders() })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error ?? "Gagal mengambil count.")
    return data.data
}

export async function createActivity(payload: CreateActivityPayload): Promise<void> {
    const res = await fetchClient(`/activity`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(payload),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error ?? "Gagal membuat activity.")
}

export async function updateActivity(id: string, payload: UpdateActivityPayload): Promise<void> {
    const res = await fetchClient(`/activity/${id}`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify(payload),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error ?? "Gagal memperbarui activity.")
}

export type ActivityDetail = Activity & {
    kolaborator: {
        id: string
        activityId: string
        pegawaiId: string
        pegawai: { id: string; nama: string; divisi: string }
        childActivityId?: string
        judul: string
        status: string
    }[]
    dokumen: {
        id: string
        namaFile: string
        path: string
        uploadedBy: string
        pegawai: { id: string; nama: string; divisi: string }
        createdAt: string
    }[]
    reschedule: {
        id: string
        targetSelesaiBaru: string
        alasan: string
        status: string
        createdAt: string
        alasanPenolakan?: string
    }[]
    chat: {
        id: string
        pegawaiId: string
        pegawai: { id: string; nama: string; divisi: string }
        pesan: string
        createdAt: string
    }[]
}

export async function getDetailActivity(id: string): Promise<{ data: ActivityDetail; isOverdue: boolean }> {
    const res = await fetchClient(`/activity/${id}`, { headers: authHeaders() })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error ?? "Gagal mengambil detail activity.")
    return { data: data.data, isOverdue: data.isOverdue }
}

export async function tambahKolaborator(activityId: string, payload: KolaboratorPayload): Promise<void> {
    const res = await fetchClient(`/activity/${activityId}/kolaborator`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(payload),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error ?? "Gagal menambah kolaborator.")
}

export async function pengajuanReschedule(activityId: string, payload: { alasan: string; targetSelesaiBaru: string }): Promise<void> {
    const res = await fetchClient(`/activity/${activityId}/reschedule`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(payload),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error ?? "Gagal mengajukan reschedule.")
}

export async function pengajuanSelesai(activityId: string): Promise<void> {
    const res = await fetchClient(`/activity/${activityId}/selesai`, {
        method: "POST",
        headers: authHeaders(),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error ?? "Gagal mengajukan selesai.")
}

export async function konfirmasiReschedule(rescheduleId: string, payload: { status: string; alasan?: string }): Promise<void> {
    const res = await fetchClient(`/activity/reschedule/${rescheduleId}/konfirmasi`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify(payload),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error ?? "Gagal konfirmasi reschedule.")
}

export async function konfirmasiSelesai(activityId: string, payload: { status: string; alasan?: string }): Promise<void> {
    const res = await fetchClient(`/activity/${activityId}/konfirmasi-selesai`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify(payload),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error ?? "Gagal konfirmasi selesai.")
}

export type Chat = {
    id: string
    activityId: string
    pegawaiId: string
    pegawai: { id: string; nama: string; divisi: string }
    pesan: string
    readBy: string[]
    createdAt: string
}

export type ChatThread = Activity & {
    lastMessage: Chat
    unreadCount: number
}

export async function getChatThreads(): Promise<ChatThread[]> {
    const res = await fetchClient(`/activity/chat/threads`, { headers: authHeaders() })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error ?? "Gagal mengambil daftar chat.")
    return data.data
}

export async function getChat(activityId: string): Promise<Chat[]> {
    const res = await fetchClient(`/activity/${activityId}/chat`, { headers: authHeaders() })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error ?? "Gagal mengambil chat.")
    return data.data
}

export async function kirimChat(activityId: string, pesan: string): Promise<Chat> {
    const res = await fetchClient(`/activity/${activityId}/chat`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ pesan }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error ?? "Gagal mengirim pesan.")
    return data.data
}

export async function updateChat(chatId: string, pesan: string): Promise<Chat> {
    const res = await fetchClient(`/activity/chat/${chatId}`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({ pesan }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error ?? "Gagal memperbarui pesan.")
    return data.data
}

export async function getUnreadChatCount(activityId: string): Promise<number> {
    const res = await fetchClient(`/activity/${activityId}/chat/unread`, { headers: authHeaders() })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error ?? "Gagal mengambil unread count.")
    return data.unreadCount ?? data.data?.unread ?? 0
}

export async function getTotalUnreadChatCount(): Promise<number> {
    const res = await fetchClient(`/activity/chat/unread-total`, { headers: authHeaders() })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error ?? "Gagal mengambil total unread chat.")
    return data.totalUnread ?? 0
}

export async function readChat(activityId: string): Promise<void> {
    const res = await fetchClient(`/activity/${activityId}/chat/read`, {
        method: "PATCH",
        headers: authHeaders(),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error ?? "Gagal menandai chat.")
}

export type ActivityKonfirmasiKolaborasi = {
    id: string
    judul: string
    deskripsi: string
    kategori: string
    waktuMulai: string
    targetSelesai: string
    pegawai: { id: string; nama: string; divisi: string }
    parent?: {
        id: string
        judul: string
        pegawai: { id: string; nama: string; divisi: string }
    }
    createdAt: string
}

export async function getActivityKonfirmasiKolaborasi(): Promise<ActivityKonfirmasiKolaborasi[]> {
    const res = await fetchClient(`/activity/konfirmasi-kolaborasi`, { headers: authHeaders() })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error ?? "Gagal mengambil data.")
    return data.data
}

export async function konfirmasiKolaborasi(
    activityId: string,
    payload: { status: string; deskripsi?: string; kategori?: string }
): Promise<void> {
    const res = await fetchClient(`/activity/${activityId}/konfirmasi-kolaborasi`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify(payload),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error ?? "Gagal konfirmasi kolaborasi.")
}
//test