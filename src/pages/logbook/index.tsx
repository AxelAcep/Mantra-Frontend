import { useEffect } from "react";
import { useHeaderTitle } from "../../components/layout/layout"; 

export default function LogBookPage() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const { setTitle } = useHeaderTitle();
    useEffect(() => {
        setTitle("Logbook Monitoring");
    }, [setTitle]);

    return (
        <div className="flex flex-col items-center justify-center bg-gray-100 p-4 min-h-[calc(100vh-64px)]">
            <h1>Ini Data User Login</h1>    
            <p>User: {user.nama}</p>
            <p>Role: {user.role}</p>
            <p>Divisi: {user.pegawai?.divisi}</p>
        </div>
    );
}