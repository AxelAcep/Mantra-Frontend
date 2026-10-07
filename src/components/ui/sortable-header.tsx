import { ChevronsUpDown, ChevronUp, ChevronDown } from "lucide-react"
import { TableHead } from "@/components/ui/table"
import type { SortDir } from "@/hooks/use-list-params"

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
    if (!active) return <ChevronsUpDown className="w-3.5 h-3.5 text-gray-400" />
    return dir === "asc"
        ? <ChevronUp className="w-3.5 h-3.5 text-cyan-600" />
        : <ChevronDown className="w-3.5 h-3.5 text-cyan-600" />
}

type SortableHeaderProps = {
    label: string
    /** Key kolom yang dikirim ke server sebagai `sortBy`. */
    column: string
    sortBy: string
    sortDir: SortDir
    onSort: (column: string) => void
    className?: string
    align?: "left" | "center" | "right"
}

/**
 * Header kolom tabel yang bisa diklik untuk sorting. Sorting-nya server-side,
 * jadi komponen ini cuma melaporkan kolom yang diklik lewat `onSort`.
 */
export function SortableHeader({
    label,
    column,
    sortBy,
    sortDir,
    onSort,
    className = "",
    align = "left",
}: SortableHeaderProps) {
    const active = sortBy === column
    const justify =
        align === "center" ? "justify-center" : align === "right" ? "justify-end" : ""

    return (
        <TableHead
            className={`cursor-pointer select-none group text-[#000000] text-xs font-semibold ${className}`}
            onClick={() => onSort(column)}
        >
            <div className={`flex items-center gap-1 ${justify}`}>
                <span className="uppercase font-semibold">{label}</span>
                <SortIcon active={active} dir={sortDir} />
            </div>
        </TableHead>
    )
}

export default SortableHeader
