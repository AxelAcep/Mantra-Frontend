import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Icons } from "@/assets";
import CardCompanyProfileDetail from "./card-company-profile";
import TabsTableCompanyDetail from "./tabs-table-company-detail";

export default function DetailPerusahaanPage() {
    const navigate = useNavigate();

    return (
        <div className="m-6">
            <div className="flex items-center gap-4 mb-6">
                <Button
                    variant="outline"
                    size="icon"
                    className="w-11 h-11 rounded-xl border-slate-200 shadow-sm shrink-0 hover:bg-slate-50"
                    onClick={() => navigate(-1)}
                >
                    <img src={Icons.LeftArrow} alt="Back" className="w-4 h-4" />
                </Button>
                <h1 className="text-2xl font-bold text-[#111827] tracking-tight">Detail Perusahaan</h1>
            </div>

            <div>
                <CardCompanyProfileDetail />
            </div>

            <div className="mt-6">
                <TabsTableCompanyDetail />
            </div>
        </div>
    );
}