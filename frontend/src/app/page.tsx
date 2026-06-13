'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/auth'
import type { DocumentType, Country } from '@/lib/types'

const DOCUMENTS = [
  {
    id: 'cdi' as DocumentType,
    title: 'Contrat de Travail CDI',
    description: 'Contrat à durée indéterminée conforme au Code du Travail local',
    icon: '📄',
    popular: true,
  },
  {
    id: 'cdd' as DocumentType,
    title: 'Contrat de Travail CDD',
    description: 'Contrat à durée déterminée avec date de fin obligatoire',
    icon: '📋',
  },
  {
    id: 'nda' as DocumentType,
    title: 'Accord de Confidentialité',
    description: 'Non-Disclosure Agreement B2B conforme au droit OHADA',
    icon: '🔒',
  },
  {
    id: 'prestation' as DocumentType,
    title: 'Contrat de Prestation',
    description: 'Contrat freelance / consultant avec livrables et paiement',
    icon: '🤝',
  },
  {
    id: 'pacte_associes' as DocumentType,
    title: "Pacte d'Associés",
    description: "Pacte d'associés SARL/SAS conforme à l'AUSCGIE OHADA",
    icon: '🏢',
  },
]

const COUNTRIES = [
  { id: 'CI' as Country, label: "Côte d'Ivoire", flag: '🇨🇮', law: 'Code du Travail ivoirien' },
  { id: 'SN' as Country, label: 'Sénégal', flag: '🇸🇳', law: 'Code du Travail sénégalais' },
]

export default function HomePage() {
  const [selectedDoc, setSelectedDoc] = useState<DocumentType | null>(null)
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const { user } = useAuthStore()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !user) {
      router.push('/auth/login')
    }
  }, [mounted, user, router])

  if (!mounted || !user) return null

  const handleStart = () => {
    if (!selectedDoc || !selectedCountry) return
    router.push(`/wizard/${selectedDoc}?country=${selectedCountry}`)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-sm px-4 py-1.5 rounded-full border border-blue-200 dark:border-blue-800 mb-6">
          <span>⚖️</span>
          <span>Conforme au droit OHADA — Côte d'Ivoire &amp; Sénégal</span>
        </div>
        <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-4 leading-tight">
          Vos documents juridiques<br />
          <span className="text-blue-700 dark:text-blue-400">en quelques minutes</span>
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
          Générez des contrats professionnels conformes à la législation locale, sans avocat, pour moins de 5 000 FCFA.
        </p>
      </div>

      <div className="mb-8">
        <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
          1. Quel document souhaitez-vous générer ?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {DOCUMENTS.map(doc => (
            <button
              key={doc.id}
              onClick={() => setSelectedDoc(doc.id)}
              className={`relative text-left p-4 rounded-xl border-2 transition-all ${
                selectedDoc === doc.id
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 shadow-sm'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-sm'
              }`}
            >
              {doc.popular && (
                <span className="absolute top-3 right-3 text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full font-medium">
                  Populaire
                </span>
              )}
              <div className="text-2xl mb-2">{doc.icon}</div>
              <div className="font-semibold text-slate-800 dark:text-slate-100 text-sm">{doc.title}</div>
              <div className="text-slate-500 dark:text-slate-400 text-xs mt-1 leading-relaxed">{doc.description}</div>
            </button>
          ))}
        </div>
      </div>

      {selectedDoc && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
            2. Quel droit s'applique ?
          </h2>
          <div className="grid grid-cols-2 gap-3 max-w-sm">
            {COUNTRIES.map(c => (
              <button
                key={c.id}
                onClick={() => setSelectedCountry(c.id)}
                className={`text-left p-4 rounded-xl border-2 transition-all ${
                  selectedCountry === c.id
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 shadow-sm'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-blue-300 dark:hover:border-blue-600'
                }`}
              >
                <div className="text-3xl mb-1">{c.flag}</div>
                <div className="font-semibold text-slate-800 dark:text-slate-100 text-sm">{c.label}</div>
                <div className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">{c.law}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedDoc && selectedCountry && (
        <div>
          <Button size="lg" onClick={handleStart} className="gap-2">
            Commencer le formulaire →
          </Button>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-3">
            Aperçu gratuit avec filigrane. Document final disponible après paiement.
          </p>
        </div>
      )}

      <div className="mt-16 flex flex-wrap gap-6 items-center justify-center text-sm text-slate-500 dark:text-slate-400">
        <span>✅ Conforme OHADA</span>
        <span>⚡ Généré en 2 minutes</span>
        <span>📥 Téléchargement .docx</span>
        <span>🔐 Données sécurisées</span>
      </div>
    </div>
  )
}
