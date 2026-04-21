// components/pegawai-select.tsx
import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type Pegawai = {
  id: string
  nama: string
  divisi: string
}

interface PegawaiSelectProps {
  value: string
  onChange: (value: string) => void
  pegawai: Pegawai[]
  loading?: boolean
  className?: string
}

export function PegawaiSelect({
  value,
  onChange,
  pegawai,
  loading = false,
  className,
}: PegawaiSelectProps) {
  const [open, setOpen] = React.useState(false)
  const selectedPegawai = pegawai.find(p => p.id === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn("w-full justify-between text-sm bg-white border-gray-200", className)}
          disabled={loading}
        >
          {selectedPegawai ? (
            <>
              {selectedPegawai.nama}
              <span className="ml-2 text-xs text-gray-500">({selectedPegawai.divisi})</span>
            </>
          ) : (
            "Pilih pegawai..."
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0 bg-white border-gray-200">
        <Command>
          <CommandList>
            <CommandInput placeholder="Cari nama pegawai..." className="h-9" />
            <CommandEmpty>Tidak ada pegawai ditemukan.</CommandEmpty>
            <CommandGroup className="max-h-[300px] overflow-y-auto">
              {pegawai.map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.nama}
                  onSelect={() => {
                    onChange(item.id)
                    setOpen(false)
                  }}
                  className="cursor-pointer"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === item.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{item.nama}</span>
                    <span className="text-xs text-gray-500">{item.divisi}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}