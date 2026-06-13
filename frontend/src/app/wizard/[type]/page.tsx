import { notFound } from 'next/navigation'
import { WizardContainer } from '@/components/wizard/WizardContainer'
import type { WizardSchema, DocumentType, Country } from '@/lib/types'
import wizardSchemas from '@/lib/wizard_schemas.json'

interface PageProps {
  params: Promise<{ type: string }>
  searchParams: Promise<{ country?: string }>
}

const VALID_TYPES = ['cdi', 'cdd', 'nda', 'prestation', 'pacte_associes']
const VALID_COUNTRIES = ['CI', 'SN']

export default async function WizardPage({ params, searchParams }: PageProps) {
  const { type } = await params
  const { country } = await searchParams

  if (!VALID_TYPES.includes(type) || !VALID_COUNTRIES.includes(country ?? '')) {
    notFound()
  }

  const schema = (wizardSchemas as Record<string, WizardSchema>)[type]
  if (!schema) notFound()

  const countryLabel = country === 'CI' ? "Côte d'Ivoire 🇨🇮" : 'Sénégal 🇸🇳'

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-3">
          <a href="/" className="hover:text-blue-700 dark:hover:text-blue-400">Accueil</a>
          <span>›</span>
          <span>{countryLabel}</span>
          <span>›</span>
          <span className="text-slate-800 dark:text-slate-100 font-medium">{schema.title}</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{schema.title}</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">{schema.description}</p>
      </div>

      <WizardContainer
        schema={schema}
        documentType={type as DocumentType}
        country={country as Country}
      />
    </div>
  )
}
