import React from 'react';
import { Check } from 'lucide-react';

interface Step {
  n: number;
  label: string;
  status: "done" | "active" | "inactive";
}

interface ProgressCardProps {
  steps: Step[];
  onStepClick?: (step: number) => void;
}

export default function ProgressCard({ steps, onStepClick }: ProgressCardProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-4 lg:p-10 shadow-sm overflow-x-auto">
      <div className="flex items-start justify-between min-w-[800px]">
        {steps.map((step, i) => {
          const isLast = i === steps.length - 1;
          const nextStep = steps[i + 1];
          const isLineActive = nextStep && (nextStep.status === 'done' || nextStep.status === 'active');

          return (
            <React.Fragment key={i}>
              {/* Step Item */}
              <div
                className={`flex flex-col items-center group ${onStepClick ? 'cursor-pointer' : ''}`}
                onClick={() => onStepClick && onStepClick(step.n)}
              >
                {/* Icon Container */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 relative z-10
                  ${step.status === "active"
                      ? "bg-white border-2 border-cyan-500 ring-4 ring-cyan-50"
                      : step.status === "done"
                        ? "bg-cyan-500 border-2 border-cyan-500 text-white shadow-lg shadow-cyan-100"
                        : "bg-white border-2 border-gray-100 text-gray-300"
                    }`}
                >
                  {step.status === "active" ? (
                    <div className="w-2.5 h-2.5 bg-cyan-500 rounded-full animate-pulse" />
                  ) : step.status === "done" ? (
                    <Check className="w-5 h-5 stroke-[3px]" />
                  ) : (
                    <span className="font-sans">{step.n}</span>
                  )}
                </div>

                {/* Label */}
                <span
                  className={`mt-4 text-[11px] font-bold text-center w-24 leading-tight transition-colors duration-300
                  ${step.status === "active" || step.status === "done"
                      ? "text-cyan-700"
                      : "text-gray-400 group-hover:text-gray-500"
                    }`}
                >
                  {step.label}
                </span>
              </div>

              {/* Connecting Line */}
              {!isLast && (
                <div className="flex-1 mt-5 px-2">
                  <div
                    className={`h-[2px] w-full transition-all duration-500
                    ${isLineActive
                        ? "bg-cyan-500"
                        : "border-t-2 border-dashed border-gray-100"
                      }`}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}