// components/dashboard/stat-card.tsx
import { Card, CardContent } from "@/components/ui/card"

interface StatCardProps {
  label: string;
  value: number | string;
  icon: string;
  iconAlt: string;
  borderColor: string;
  sublabel?: string;
}

export function StatCard({ label, value, icon, iconAlt, borderColor, sublabel }: StatCardProps) {
  return (
    <Card className={`border-0 border-l-3 ${borderColor} shadow-sm bg-white h-[140px]`}>
      <CardContent className="flex flex-col justify-center h-full p-5 gap-2">

        {/* Baris Atas: Label + Icon sejajar */}
        <div className="flex flex-row items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground leading-tight">
            {label}
          </p>
          <img
            src={icon}
            alt={iconAlt}
            className="w-8 h-8 object-contain opacity-70"
          />
        </div>

        {/* Baris Bawah: Angka + optional sublabel */}
        <div>
          <p className="text-3xl font-bold tracking-tight text-slate-900">
            {value}
          </p>
          {sublabel && (
            <p className="text-xs text-muted-foreground mt-0.5">
              {sublabel}
            </p>
          )}
        </div>

      </CardContent>
    </Card>
  )
}