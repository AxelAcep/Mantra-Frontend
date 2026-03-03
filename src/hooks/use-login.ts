// hooks/useLogin.ts
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginService } from "../services/auth.services";

export const useLogin = () => {
    const navigate  = useNavigate();

    const [email,    setEmail]    = useState("");
    const [password, setPassword] = useState("");
    const [error,    setError]    = useState<string | null>(null);
    const [loading,  setLoading]  = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const res = await loginService({ email, password });

            // Simpan token
            localStorage.setItem("token", res.token);
            localStorage.setItem("user",  JSON.stringify(res.user));

            navigate("/logbook");

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return { email, setEmail, password, setPassword, error, loading, handleSubmit };
};