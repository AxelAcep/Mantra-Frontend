type Props = {
    page: number
    totalPages: number
    total: number
    showing: number
    onPageChange: (p: number) => void
}

export function TablePagination({ page, totalPages, total, showing, onPageChange }: Props) {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
    const visiblePages = pages.length <= 5
        ? pages
        : [1, 2, 3, Math.max(page - 1, 3), page, Math.min(page + 1, totalPages - 1), totalPages - 1, totalPages]
            .filter((p, i, arr) => p >= 1 && p <= totalPages && arr.indexOf(p) === i)
            .sort((a, b) => a - b)
            .slice(0, 7)

    return (
        <div className="flex justify-between items-center text-sm text-muted-foreground pt-2">
            <span>
                Menampilkan <span className="font-medium text-gray-700">{showing}</span> dari{" "}
                <span className="font-medium text-gray-700">{total}</span> data
            </span>
            <div className="flex items-center gap-1">
                <button
                    onClick={() => onPageChange(page - 1)}
                    disabled={page === 1}
                    className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    ‹
                </button>
                {visiblePages.map((p, idx) => {
                    const prev = visiblePages[idx - 1]
                    const showEllipsis = prev !== undefined && p - prev > 1
                    return (
                        <span key={p} className="flex items-center gap-1">
                            {showEllipsis && <span className="px-1 text-gray-400">...</span>}
                            <button
                                onClick={() => onPageChange(p)}
                                className={`w-8 h-8 flex items-center justify-center rounded border text-sm transition-colors
                                    ${page === p
                                        ? "bg-cyan-500 text-white border-cyan-500"
                                        : "border-gray-200 hover:bg-gray-100"
                                    }`}
                            >
                                {p}
                            </button>
                        </span>
                    )
                })}
                <button
                    onClick={() => onPageChange(page + 1)}
                    disabled={page === totalPages}
                    className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    ›
                </button>
            </div>
        </div>
    )
}
