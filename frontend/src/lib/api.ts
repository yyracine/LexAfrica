const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(err.detail || 'Erreur serveur')
  }
  return res.json()
}

export const api = {
  auth: {
    register: (data: { email: string; password: string; company_name?: string; country?: string }) =>
      request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),

    login: (data: { email: string; password: string }) =>
      request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),

    me: (token: string) =>
      request('/auth/me', {}, token),
  },

  documents: {
    generatePreview: async (payload: {
      document_type: string
      country: string
      form_data: Record<string, unknown>
    }): Promise<Blob> => {
      const res = await fetch(`${API_BASE}/documents/generate-preview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: res.statusText }))
        throw new Error(err.detail || 'Erreur génération')
      }
      return res.blob()
    },

    generate: (
      payload: { document_type: string; country: string; form_data: Record<string, unknown> },
      token: string
    ) => request('/documents/generate', { method: 'POST', body: JSON.stringify(payload) }, token),

    list: (token: string) =>
      request('/documents/', {}, token),

    download: async (id: string, token: string): Promise<Blob> => {
      const res = await fetch(`${API_BASE}/documents/${id}/download`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Téléchargement échoué')
      return res.blob()
    },
  },
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
