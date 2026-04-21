import { useState } from "react";
import { Icons } from "@/assets";
import { useForgotPassword } from "../../../hooks/use-user"

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const { handleRequestToken, isLoading } = useForgotPassword();

    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isFormValid = isEmailValid && !isLoading;

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await handleRequestToken(email);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8 mb-4">
                <img src={Icons.MantraBig} alt="Logo Mantra" className="mx-auto mb-2 w-12 h-12" />
                <h1 className="text-2xl font-bold text-center mb-1">Lupa Kata Sandi</h1>
                <p className="text-sm text-center mb-6 text-gray-400">
                    Masukkan email Anda untuk menerima instruksi pengaturan ulang kata sandi. 
                    <span className="block font-normal text-cyan-600">Khusus Akun Master</span>
                </p>

                <form className="space-y-4" onSubmit={onSubmit}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1">Alamat Email</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Masukkan email Anda"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="text-sm font-medium text-gray-800 w-full border border-gray-300 rounded-md p-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={!isFormValid}
                        className={`w-full text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200
                            ${isFormValid 
                                ? "bg-[#06B6D4] hover:bg-[#0596B2] focus:ring-cyan-500 cursor-pointer"
                                : "bg-gray-300 cursor-not-allowed"
                            }`}
                    >
                        {isLoading ? "Mengirim..." : "Kirim Instruksi"}
                    </button>
                </form>

                <a href="/login" className="mt-5 flex items-center justify-center gap-2 text-sm font-normal text-gray-600 hover:text-cyan-600 transition-all">
                    <span>&larr;</span> Kembali ke Login
                </a>
            </div>

            <h2 className="text-xs font-bold text-center mb-6 text-gray-400">
                © 2026 CRM PT. Matur Nuwun Nusantara
            </h2>
        </div>  
    );
}