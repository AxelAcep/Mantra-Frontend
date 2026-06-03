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

export type Perusahaan = {
    id: string
    nama: string
    alamat?: string
    nomor_telepon?: string
    createdAt?: string
    updatedAt?: string
}

export async function getPerusahaanList(): Promise<Perusahaan[]> {
    const res = await fetchClient(`/perusahaan`, { headers: authHeaders() })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error ?? "Gagal mengambil data perusahaan.")
    return data
}

export async function getPerusahaanDetail(id: string): Promise<Perusahaan> {
    const res = await fetchClient(`/perusahaan/${id}`, { headers: authHeaders() })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error ?? "Gagal mengambil detail perusahaan.")
    return data
}

export async function createPerusahaan(company: { nama: string; alamat: string; telepon: string }): Promise<Perusahaan> {
    const res = await fetchClient(`/perusahaan`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(company),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error ?? "Gagal membuat perusahaan baru.")
    return data
}

export async function updatePerusahaan(id: string, company: { nama: string; alamat: string; telepon: string }): Promise<Perusahaan> {
    const res = await fetchClient(`/perusahaan/${id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(company),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error ?? "Gagal memperbarui data perusahaan.")
    return data
}

export async function deletePerusahaan(id: string): Promise<{ message: string }> {
    const res = await fetchClient(`/perusahaan/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error ?? "Gagal menghapus data perusahaan.")
    return data
}