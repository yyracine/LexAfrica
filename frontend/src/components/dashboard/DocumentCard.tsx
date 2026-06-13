'use client'
import { useState } from 'react'
import type { DocumentRecord } from '@/lib/types'
import { Button } from '@/components/ui/Button'
import { api, downloadBlob } from '@/lib/api'
import { formatDate, DOC_LABELS, COUNTRY_LABELS } from '@/lib/utils'

interface DocumentCardProps {
  doc: DocumentRecord
  token: string
}

export function DocumentCard({ doc, token }: DocumentCardProps) {
  const [loading, setLoading] = useState(false)

  const handleDownload = async () => {
    setLoading(true)
    try {
      const blob = await api.documents.download(doc.id, token)
      downloadBlob(blob, `${doc.document_type}_${doc.country}.docx`)
    } catch {
      alert('Erreur lors du téléchargement')
    } finally {
      setLoading(false)
    }
  }

  const statusColors: Record<string, string> = {
    generated: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    paid: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
    draft: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400',
  }

  const statusLabels: Record<string, string> = {
    generated: 'Aperçu',
    paid: 'Payé',
    draft: 'Brouillon',
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5 flex items-start justify-between gap-4 hover:shadow-sm transition-shadow">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-xl shrink-0">
          📄
        </div>
        <div>
          <div className="font-semibold text-slate-800 dark:text-slate-100">
            {DOC_LABELS[doc.document_type] || doc.document_type}
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {COUNTRY_LABELS[doc.country] || doc.country} · {formatDate(doc.created_at)}
          </div>
          <span className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[doc.status] || 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
            {statusLabels[doc.status] || doc.status}
          </span>
        </div>
      </div>
      <Button variant="outline" size="sm" onClick={handleDownload} loading={loading}>
        Télécharger
      </Button>
    </div>
  )
}
