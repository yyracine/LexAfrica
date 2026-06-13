'use client'
import { useState } from 'react'
import { ProgressBar } from './ProgressBar'
import { WizardField } from './WizardField'
import { Button } from '@/components/ui/Button'
import { api, downloadBlob } from '@/lib/api'
import { useAuthStore } from '@/store/auth'
import type { WizardSchema, FormData, Country } from '@/lib/types'
import Link from 'next/link'

interface WizardContainerProps {
  schema: WizardSchema
  documentType: string
  country: Country
}

export function WizardContainer({ schema, documentType, country }: WizardContainerProps) {
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState<FormData>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const { token } = useAuthStore()

  const currentStep = schema.steps[step]
  const isLast = step === schema.steps.length - 1

  const updateField = (fieldId: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }))
  }

  const validateStep = (): boolean => {
    for (const field of currentStep.fields) {
      if (!field.required) continue
      const val = formData[field.id]
      if (val === undefined || val === '' || val === null) {
        setError(`Le champ "${field.label}" est requis`)
        return false
      }
    }
    setError('')
    return true
  }

  const handleNext = () => {
    if (!validateStep()) return
    setStep(s => s + 1)
  }

  const handleBack = () => {
    setError('')
    setStep(s => s - 1)
  }

  const handleSubmit = async () => {
    if (!validateStep()) return
    setLoading(true)
    setError('')
    try {
      const blob = await api.documents.generatePreview({
        document_type: documentType,
        country,
        form_data: formData,
      })
      downloadBlob(blob, `${documentType}_${country}_apercu.docx`)

      if (token) {
        await api.documents.generate({ document_type: documentType, country, form_data: formData }, token)
      }

      setDone(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la génération')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-6">🎉</div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3">Document téléchargé !</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-2">
          Votre aperçu <strong>{schema.title}</strong> a été téléchargé avec le filigrane APERÇU.
        </p>
        {!token && (
          <p className="text-sm text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg px-4 py-3 mb-6 max-w-md mx-auto">
            Créez un compte gratuit pour sauvegarder vos documents et obtenir la version finale sans filigrane.
          </p>
        )}
        <div className="flex gap-3 justify-center flex-wrap">
          <Button variant="outline" onClick={() => { setStep(0); setFormData({}); setDone(false) }}>
            Nouveau document
          </Button>
          {token ? (
            <Link href="/dashboard"><Button>Voir mes documents</Button></Link>
          ) : (
            <Link href="/auth/register"><Button>Créer un compte</Button></Link>
          )}
        </div>
      </div>
    )
  }

  return (
    <div>
      <ProgressBar current={step} total={schema.steps.length} steps={schema.steps} />

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 md:p-8">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-1">{currentStep.title}</h2>
        {currentStep.description && (
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">{currentStep.description}</p>
        )}

        <div className="space-y-5 mt-6">
          {currentStep.fields.map(field => (
            <WizardField
              key={field.id}
              field={field}
              value={formData[field.id]}
              country={country}
              onChange={val => updateField(field.id, val)}
            />
          ))}
        </div>

        {error && (
          <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
          <Button variant="ghost" onClick={handleBack} disabled={step === 0}>
            ← Retour
          </Button>

          {isLast ? (
            <Button onClick={handleSubmit} loading={loading} size="lg">
              Générer et télécharger →
            </Button>
          ) : (
            <Button onClick={handleNext}>
              Continuer →
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
