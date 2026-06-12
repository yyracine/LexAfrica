'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth'
import { api } from '@/lib/api'
import { DocumentCard } from '@/components/dashboard/DocumentCard'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import type { DocumentRecord } from '@/lib/types'

export default function DashboardPage() {
  const { user, token, logout } = useAuthStore()
  const router = useRouter()
  const [docs, setDocs] = useState<DocumentRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) {
      router.push('/auth/login')
      return
    }
    api.documents.list(token)
      .then((data: unknown) => {
        const d = data as { documents: DocumentRecord[]; total: number }
        setDocs(d.documents)
      })
      .catch(() => setError('Impossible de charger les documents'))
      .finally(() => setLoading(false))
  }, [token, router])

  if (!user) return null

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Mes documents</h1>
          <p className="text-slate-500 mt-1">
            {user.company_name || user.email} · Plan {user.plan}
          </p>
        </div>
        <Link href="/">
          <Button>+ Nouveau document</Button>
        </Link>
      </div>

      {loading && (
        <div className="text-center py-16 text-slate-400">Chargement...</div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {!loading && !error && docs.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
          <div className="text-5xl mb-4">📂</div>
          <h2 className="text-lg font-semibold text-slate-700 mb-2">Aucun document pour l'instant</h2>
          <p className="text-slate-500 text-sm mb-6">Générez votre premier contrat en quelques minutes.</p>
          <Link href="/">
            <Button>Créer mon premier document</Button>
          </Link>
        </div>
      )}

      {!loading && docs.length > 0 && (
        <div className="space-y-3">
          {docs.map(doc => (
            <DocumentCard key={doc.id} doc={doc} token={token!} />
          ))}
        </div>
      )}
    </div>
  )
}
