interface ProgressBarProps {
  current: number
  total: number
  steps: { title: string }[]
}

export function ProgressBar({ current, total, steps }: ProgressBarProps) {
  const pct = Math.round(((current + 1) / total) * 100)

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-slate-600">
          Étape {current + 1} sur {total}
        </span>
        <span className="text-sm text-slate-400">{pct}%</span>
      </div>
      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-600 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex gap-1 mt-3 overflow-x-auto pb-1">
        {steps.map((s, i) => (
          <div
            key={i}
            className={`flex-1 min-w-0 text-center text-xs px-1 py-1 rounded truncate transition-colors ${
              i === current
                ? 'bg-blue-100 text-blue-700 font-medium'
                : i < current
                ? 'text-emerald-600'
                : 'text-slate-400'
            }`}
          >
            {i < current ? '✓ ' : ''}{s.title}
          </div>
        ))}
      </div>
    </div>
  )
}
