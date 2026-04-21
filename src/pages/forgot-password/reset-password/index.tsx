import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Icons } from "@/assets";
import { useForgotPassword } from "../../../hooks/use-user";

export default function ResetPasswordPage() {
    const [passwordBaru, setPasswordBaru] = useState("");
    const [konfirmasiPassword, setKonfirmasiPassword] = useState("");
    
    const { handleResetPassword, isLoading } = useForgotPassword();
    const navigate = useNavigate();
    const location = useLocation();

    // Ambil token dari URL query string (?token=...)
    const query = new URLSearchParams(location.search);
    const token = query.get("token");

    const isFormValid = passwordBaru.length >= 0 && passwordBaru === konfirmasiPassword && !isLoading && token;

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;

        const success = await handleResetPassword({
            token: token,
            password_baru: passwordBaru,
            konfirmasi_password: konfirmasiPassword
        });

        if (success) {
            setTimeout(() => navigate("/login"), 2000); // Redirect ke login setelah sukses
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8 mb-4">
                <img src={Icons.MantraBig} alt="Logo" className="mx-auto mb-2 w-12 h-12" />
                <h1 className="text-2xl font-bold text-center mb-1">Atur Ulang Kata Sandi</h1>
                <p className="text-sm text-center mb-6 text-gray-400">
                    Silakan masukkan kata sandi baru Anda di bawah ini.
                </p>

                {!token && (
                    <div className="bg-red-50 text-red-600 text-xs p-3 rounded-md mb-4 border border-red-200">
                        Token tidak ditemukan atau tidak valid. Silakan minta link baru.
                    </div>
                )}

                <form className="space-y-4" onSubmit={onSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Kata Sandi Baru</label>
                        <input
                            type="password"
                            placeholder="Masukan kata sandi baru"
                            value={passwordBaru}
                            onChange={(e) => setPasswordBaru(e.target.value)}
                            className="text-sm font-medium text-gray-800 w-full border border-gray-300 rounded-md p-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Konfirmasi Kata Sandi</label>
                        <input
                            type="password"
                            placeholder="Ulangi kata sandi baru"
                            value={konfirmasiPassword}
                            onChange={(e) => setKonfirmasiPassword(e.target.value)}
                            className="text-sm font-medium text-gray-800 w-full border border-gray-300 rounded-md p-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
                        />
                        {passwordBaru !== konfirmasiPassword && konfirmasiPassword !== "" && (
                            <span className="text-[10px] text-red-500 mt-1 italic">* Password tidak cocok</span>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={!isFormValid}
                        className={`w-full text-white py-2 px-4 rounded-md transition-all duration-200
                            ${isFormValid 
                                ? "bg-[#06B6D4] hover:bg-[#0596B2] cursor-pointer" 
                                : "bg-gray-300 cursor-not-allowed"
                            }`}
                    >
                        {isLoading ? "Memproses..." : "Simpan Kata Sandi"}
                    </button>
                </form>
            </div>

            <h2 className="text-xs font-bold text-center mb-6 text-gray-400">
                © 2026 CRM PT. Matur Nuwun Nusantara
            </h2>
        </div>
    );
}