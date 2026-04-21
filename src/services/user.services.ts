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

export type User = {
    id: string
    email: string
    role: string
    lastLogin?: string
    pegawai: {
        id: string
        nama: string
        divisi: string
    }
}

export type CreateUserPayload = {
    nama: string
    email: string
    password: string
    role: string
    divisi: string
}

export type EditUserPayload = {
    nama?: string
    email?: string
    role?: string
    divisi?: string
    password?: string
}

export type PaginatedUsers = {
    data: User[]
    meta: {
        page: number
        limit: number
        total: number
        totalPages: number
    }
}

export async function getAllUsers(page = 1, limit = 10, search = ""): Promise<PaginatedUsers> {
    const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        ...(search ? { search } : {}),
    })
    const res = await fetchClient(`/user?${params}`, { headers: authHeaders() })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error ?? "Gagal mengambil data user.")
    return data
}

export async function createUser(payload: CreateUserPayload): Promise<void> {
    const res = await fetchClient(`/user/register`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(payload),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error ?? "Gagal membuat akun.")
}

export async function editUser(id: string, payload: EditUserPayload): Promise<void> {
    const res = await fetchClient(`/user/${id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(payload),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error ?? "Gagal memperbarui data.")
}

export async function deleteUser(id: string): Promise<void> {
    const res = await fetchClient(`/user/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error ?? "Gagal menghapus user.")
}

export async function getMe(): Promise<{ user: User }> {
    const res = await fetchClient(`/user/me`, {
        method: "GET",
        headers: authHeaders(),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error ?? "Gagal mengambil profil.")
    return data
}

export async function getAllPegawai(): Promise<{ data: any[] }> {
    const res = await fetchClient(`/user/all`, {
        method: "GET",
        headers: authHeaders(),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error ?? "Gagal mengambil data pegawai.")
    return data
}

// Tahap 1: Kirim email untuk minta token — tidak pakai authHeaders (belum login)
export async function requestForgotPassword(email: string): Promise<{ message: string }> {
    const res = await fetch(`${BASE_URL}/user/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error ?? "Gagal mengirim permintaan reset password.")
    return data
}

// Tahap 2: Kirim password baru menggunakan token dari URL
export async function resetPassword(payload: {
    token: string
    password_baru: string
    konfirmasi_password: string
}): Promise<{ message: string }> {
    const res = await fetch(`${BASE_URL}/user/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error ?? "Gagal memperbarui password.")
    return data
}