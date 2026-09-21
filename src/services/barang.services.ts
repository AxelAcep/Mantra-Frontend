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

export type Barang = {
    id: string
    noBarang: string
    deskripsi: string
    satuan: string
    createdAt?: string
    updatedAt?: string
}

export type BarangListResponse = {
    data: Barang[]
    meta: {
        page: number
        limit: number
        total: number
        totalPages: number
    }
}

export async function getBarangList(
    page: number,
    limit: number,
    search: string,
    sortBy: string,
    sortDir: string
): Promise<BarangListResponse> {
    const params = new URLSearchParams()
    params.set("page", String(page))
    params.set("limit", String(limit))
    if (search) params.set("search", search)
    if (sortBy) params.set("sortBy", sortBy)
    if (sortDir) params.set("sortDir", sortDir)

    const res = await fetchClient(`/barang?${params.toString()}`, { headers: authHeaders() })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error ?? "Gagal mengambil data barang.")
    return data
}

export async function createBarang(barang: { noBarang: string; deskripsi: string; satuan: string }): Promise<Barang> {
    const res = await fetchClient(`/barang`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(barang),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error ?? "Gagal membuat barang baru.")
    return data
}

export async function updateBarang(id: string, barang: { noBarang: string; deskripsi: string; satuan: string }): Promise<Barang> {
    const res = await fetchClient(`/barang/${id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(barang),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error ?? "Gagal memperbarui data barang.")
    return data
}

export async function deleteBarang(id: string): Promise<{ message: string }> {
    const res = await fetchClient(`/barang/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error ?? "Gagal menghapus data barang.")
    return data
}
