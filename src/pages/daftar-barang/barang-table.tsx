import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react"
import { DialogEditBarang } from "./dialog-edit-barang"
import { DialogHapusBarang } from "./dialog-hapus-barang"
import type { Barang } from "../../services/barang.services"

type SortDir = "asc" | "desc" | ""

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
    if (!active || !dir) return <ChevronsUpDown className="w-3.5 h-3.5 text-gray-400" />
    return dir === "asc"
        ? <ChevronUp className="w-3.5 h-3.5 text-cyan-600" />
        : <ChevronDown className="w-3.5 h-3.5 text-cyan-600" />
}

function SortableHeader({ label, field, sortBy, sortDir, onSort }: {
    label: string; field: string; sortBy: string; sortDir: SortDir
    onSort: (field: string) => void
}) {
    const isActive = sortBy === field
    return (
        <TableHead
            className="cursor-pointer select-none group text-[#000000] text-xs font-semibold"
            onClick={() => onSort(field)}
        >
            <div className="flex items-center gap-1">
                <span className="uppercase font-semibold">{label}</span>
                <SortIcon active={isActive} dir={isActive ? sortDir : ""} />
            </div>
        </TableHead>
    )
}

export interface BarangTableProps {
    items: Barang[]
    sortBy: string
    sortDir: string
    onSort: (field: string) => void
}

export function BarangTable({ items, sortBy, sortDir, onSort }: BarangTableProps) {
    return (
        <Table>
            <TableHeader>
                <TableRow className="bg-slate-50 border-b border-slate-100">
                    <SortableHeader label="NO. BARANG" field="noBarang" sortBy={sortBy} sortDir={sortDir as SortDir} onSort={onSort} />
                    <SortableHeader label="DESKRIPSI" field="deskripsi" sortBy={sortBy} sortDir={sortDir as SortDir} onSort={onSort} />
                    <SortableHeader label="SATUAN" field="satuan" sortBy={sortBy} sortDir={sortDir as SortDir} onSort={onSort} />
                    <TableHead className="text-[#000000] text-xs font-semibold text-right">AKSI</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {items.map((item) => (
                    <TableRow key={item.id} className="hover:bg-slate-50/50 transition-colors">
                        <TableCell className="font-mono font-semibold text-gray-800">{item.noBarang}</TableCell>
                        <TableCell className="text-gray-800 max-w-[400px] truncate" title={item.deskripsi}>{item.deskripsi}</TableCell>
                        <TableCell className="text-gray-800">{item.satuan}</TableCell>
                        <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-3">
                                <DialogEditBarang item={item}>
                                    <button className="text-cyan-600 text-sm font-medium hover:underline">Edit</button>
                                </DialogEditBarang>
                                <DialogHapusBarang item={item}>
                                    <button className="text-rose-500 text-sm font-medium hover:underline">Hapus</button>
                                </DialogHapusBarang>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
