'use client'
import { useState } from 'react'
import type { WizardField as WizardFieldType, Associate, Country } from '@/lib/types'

interface WizardFieldProps {
  field: WizardFieldType
  value: unknown
  country: Country
  onChange: (value: unknown) => void
}

export function WizardField({ field, value, country, onChange }: WizardFieldProps) {
  const inputClass = 'w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'

  const defaultVal = country === 'CI' ? field.default_CI : country === 'SN' ? field.default_SN : field.default
  const displayValue = value !== undefined && value !== '' ? value : (defaultVal ?? '')

  if (field.type === 'select') {
    return (
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          {field.label} {field.required && <span className="text-red-500">*</span>}
        </label>
        <select
          value={displayValue as string}
          onChange={e => onChange(e.target.value)}
          className={inputClass}
          required={field.required}
          lang="fr"
        >
          <option value="">Sélectionner...</option>
          {field.options?.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    )
  }

  if (field.type === 'textarea') {
    return (
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          {field.label} {field.required && <span className="text-red-500">*</span>}
        </label>
        <textarea
          value={displayValue as string}
          onChange={e => onChange(e.target.value)}
          placeholder={field.placeholder}
          required={field.required}
          rows={4}
          spellCheck={false}
          lang="fr"
          className={`${inputClass} resize-none`}
        />
      </div>
    )
  }

  if (field.type === 'boolean') {
    return (
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id={field.id}
          checked={displayValue as boolean ?? false}
          onChange={e => onChange(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor={field.id} className="text-sm text-slate-700 cursor-pointer">
          {field.label}
        </label>
      </div>
    )
  }

  if (field.type === 'associates_list') {
    return <AssociatesList value={value as Associate[] ?? []} onChange={onChange} />
  }

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        {field.label} {field.required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={field.type === 'number' ? 'number' : 'text'}
        value={displayValue as string | number}
        onChange={e => onChange(field.type === 'number' ? parseFloat(e.target.value) || '' : e.target.value)}
        placeholder={field.placeholder}
        required={field.required}
        min={field.min}
        max={field.max}
        spellCheck={false}
        lang="fr"
        className={inputClass}
      />
    </div>
  )
}

function AssociatesList({ value, onChange }: { value: Associate[]; onChange: (v: unknown) => void }) {
  const [associates, setAssociates] = useState<Associate[]>(value.length ? value : [{ name: '', percentage: 0 }])

  const update = (list: Associate[]) => {
    setAssociates(list)
    onChange(list)
  }

  const total = associates.reduce((s, a) => s + (a.percentage || 0), 0)

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">
        Liste des associés <span className="text-red-500">*</span>
      </label>
      <div className="space-y-2">
        {associates.map((a, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input
              type="text"
              value={a.name}
              placeholder={`Associé ${i + 1}`}
              onChange={e => {
                const list = [...associates]
                list[i] = { ...list[i], name: e.target.value }
                update(list)
              }}
              spellCheck={false}
              lang="fr"
              className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              value={a.percentage || ''}
              placeholder="%"
              min={0}
              max={100}
              onChange={e => {
                const list = [...associates]
                list[i] = { ...list[i], percentage: parseFloat(e.target.value) || 0 }
                update(list)
              }}
              className="w-20 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {associates.length > 1 && (
              <button
                type="button"
                onClick={() => update(associates.filter((_, j) => j !== i))}
                className="text-red-400 hover:text-red-600 text-lg leading-none"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between mt-2">
        <button
          type="button"
          onClick={() => update([...associates, { name: '', percentage: 0 }])}
          className="text-sm text-blue-600 hover:underline"
        >
          + Ajouter un associé
        </button>
        <span className={`text-sm font-medium ${total === 100 ? 'text-emerald-600' : 'text-orange-500'}`}>
          Total : {total}%{total !== 100 && ' (doit être 100%)'}
        </span>
      </div>
    </div>
  )
}
