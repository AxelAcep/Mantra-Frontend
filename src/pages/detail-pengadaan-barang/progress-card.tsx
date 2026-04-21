interface Step {
  n: number
  label: string
  status: "done" | "active" | "inactive"
}

interface ProgressCardProps {
  steps: Step[]
  onStepClick?: (step: number) => void
}

export default function ProgressCard({ steps, onStepClick }: ProgressCardProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-8 shadow-sm">
      <div className="flex justify-between relative">

        {/* Line */}
        <div className="flex-1 absolute top-4 left-0 w-full h-[2px] bg-gray-100 z-0" />

        {steps.map((step, i) => (
          <div
            key={i}
            className={`flex flex-col items-center gap-3 relative z-[1] bg-white px-2 ${onStepClick ? 'cursor-pointer' : ''}`}
            onClick={() => onStepClick && onStepClick(step.n)}
          >

            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-4
              ${step.status === "active"
                  ? "bg-white border-cyan-500 text-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.3)]"
                  : step.status === "done"
                    ? "bg-cyan-500 border-cyan-500 text-white"
                    : "bg-white border-gray-200 text-gray-300"
                }`}
            >
              {step.status === "active" ? (
                <div className="w-2 h-2 bg-cyan-500 rounded-full" />
              ) : step.status === "done" ? (
                "✓"
              ) : (
                step.n
              )}
            </div>

            <span
              className={`text-[10px] font-bold text-center max-w-[80px]
              ${step.status === "active"
                  ? "text-cyan-600"
                  : step.status === "done"
                    ? "text-cyan-500"
                    : "text-gray-300"
                }`}
            >
              {step.label}
            </span>

          </div>
        ))}
      </div>
    </div>
  )
}