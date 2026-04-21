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

export type Dokumen = {
    id: string
    activityId: string
    namaFile: string
    path: string
    uploadedBy: string
    pegawai: { id: string; nama: string; divisi: string }
    createdAt: string
}

export async function uploadDokumen(activityId: string, file: File): Promise<Dokumen> {
    const formData = new FormData()
    formData.append("file", file)
    const res = await fetchClient(`/activity/${activityId}/dokumen`, {
        method: "POST",
        headers: authHeaders(), // TIDAK include Content-Type, biar browser set boundary sendiri
        body: formData,
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message ?? "Gagal mengunggah file.")
    return data.data
}

export async function deleteDokumen(activityId: string, dokumenId: string): Promise<void> {
    const res = await fetchClient(`/activity/${activityId}/dokumen/${dokumenId}`, {
        method: "DELETE",
        headers: authHeaders(),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message ?? "Gagal menghapus dokumen.")
}