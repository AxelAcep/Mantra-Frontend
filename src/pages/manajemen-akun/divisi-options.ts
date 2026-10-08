export const DIVISI_OPTIONS = [
    { value: "KOMISARIS", label: "Komisaris" },
    { value: "DIREKTUR", label: "Direktur" },
    { value: "ADMIN_SEKERTARIAT", label: "Admin Sekertariat" },
    // Alur pengadaan barang mengecek ADMIN_SEKERTARIS, jadi hanya nilai ini
    // yang boleh dipilih — labelnya saja yang disebut "Sekertaris".
    { value: "ADMIN_SEKERTARIS", label: "Sekertaris" },
    { value: "MANAGER_OPERASIONAL", label: "Manager Operasional" },
    { value: "MONITORING_CONTROL_ADVISOR", label: "Monitoring Control Advisor" },
    { value: "PROCUREMENT_GA", label: "Procurement & GA" },
    { value: "FINANCE_ACCOUNTING", label: "Finance & Accounting" },
    { value: "IT", label: "IT" },
    { value: "SALES", label: "Sales" },
    { value: "PRESALES", label: "Pre-Sales" },
    { value: "SEKERTARIAT", label: "Sekertariat" },
    { value: "TECHNICAL_SUPPORT", label: "Technical Support" },
    { value: "MAINTENANCE_FIRE", label: "Maintenance Fire" },
    { value: "MAINTENANCE_PAC", label: "Maintenance PAC" },
    { value: "CUSTOMER_CARE", label: "Customer Care" },
    { value: "TECHNICIAN", label: "Technician" },
]

export const ROLE_OPTIONS = [
    { value: "MASTER", label: "Master" },
    { value: "SUPERVISI", label: "Supervisi" },
    { value: "PROJEK", label: "Projek" },
    { value: "KARYAWAN", label: "Karyawan" },
]