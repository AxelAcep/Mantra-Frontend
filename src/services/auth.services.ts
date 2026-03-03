// services/auth.service.ts

const BASE_URL = import.meta.env.VITE_API_URL;

export interface LoginPayload {
    email:    string;
    password: string;
}

export interface LoginResponse {
    message: string;
    token:   string;
    user: {
        id:       string;
        email:    string;
        role:     string;
        isActive: boolean;
        pegawai: {
            id:     string;
            nama:   string;
            divisi: string;
        };
    };
}

export const loginService = async (payload: LoginPayload): Promise<LoginResponse> => {
    const res = await fetch(`${BASE_URL}/user/login`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.error || "Login gagal.");
    }

    return data;
};