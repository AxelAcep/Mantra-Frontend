import { Icons } from "@/assets"
import { useLogin } from "../../hooks/use-login";

export default function LoginPage() {
    const { email, setEmail, password, setPassword, error, loading, handleSubmit } = useLogin();

    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isPasswordValid = password.trim().length > 0;
    const isFormValid = isEmailValid && isPasswordValid;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
            
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8 mb-4">
                <img src={Icons.MantraBig} alt="Logo Mantra" className="mx-auto mb-2 w-12 h-12" />
                <h1 className="text-2xl font-bold text-center mb-1">Selamat Datang</h1>
                <h2 className="text-base font-thin text-center mb-6 text-gray-400">
                    Silakan pilih peran dan masukkan kredensial Anda untuk masuk
                </h2>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-300 text-red-600 text-sm rounded-md p-3 mb-4">
                        {error}
                    </div>
                )}

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Masukkan email Anda"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="text-sm font-medium text-gray-800 w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-600 mb-1">Kata Sandi</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Masukkan kata sandi Anda"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="text-sm font-medium text-gray-800 w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <p className="text-right text-sm text-gray-500">
                        <a href="#" className="text-[#06B6D4] hover:underline">Lupa Kata Sandi?</a>
                    </p>

                    <button
                        type="submit"
                        disabled={!isFormValid || loading}
                        className={`w-full text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200
                            ${isFormValid && !loading
                                ? "bg-[#06B6D4] hover:bg-[#0596B2] focus:ring-blue-500 cursor-pointer"
                                : "bg-gray-300 cursor-not-allowed"
                            }`}
                    >
                        {loading ? "Memuat..." : "Masuk"}
                    </button>
                </form>
            </div>

            <h2 className="text-xs font-bold text-center mb-6 text-gray-400">
                © 2026 CRM PT. Matur Nuwun Nusantara
            </h2>
        </div>
    );
}