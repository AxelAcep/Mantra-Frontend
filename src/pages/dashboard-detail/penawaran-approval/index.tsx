import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Icons } from "@/assets";
import TabsTablePenawaranApproval from "./tabs-table-penawaran-approval";

export default function PenawaranApprovalPage() {
    const navigate = useNavigate();

    return (
        <div className="p-3">
            <div className="flex items-center gap-4">
                <Button 
                    variant="outline" 
                    size="icon" 
                    className="w-11 h-11 rounded-xl border-slate-200 shadow-sm shrink-0 hover:bg-slate-50"
                    onClick={() => navigate(-1)}
                >
                    <img src={Icons.LeftArrow} alt="Back" className="w-4 h-4" />
                </Button>

                <div className="flex flex-col">
                    <h1 className="text-2xl font-bold text-[#111827] tracking-tight">
                        Penawaran Approval
                    </h1>
                    <p className="text-[14px] text-slate-500 mt-0.5 font-medium">
                        Tinjau dan setujui penawaran pengadaan barang yang masuk untuk diproses lebih lanjut.
                    </p>
                </div>
            </div>

            <div className="mt-6">
                <TabsTablePenawaranApproval />
            </div>
        </div>
    );
}