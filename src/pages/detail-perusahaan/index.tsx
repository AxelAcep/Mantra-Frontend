import CardCompanyProfileDetail from "./card-company-profile";
import TabsTableCompanyDetail from "./tabs-table-company-detail";

export default function DetailPerusahaanPage() {
    return (
        <div className="p-3">
            <div>
                <CardCompanyProfileDetail />
            </div>

            <div className="mt-6">
                <TabsTableCompanyDetail />
            </div>
        </div>
    );
}