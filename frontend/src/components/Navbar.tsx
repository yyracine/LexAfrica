'use client'
import Link from 'next/link'
import { useAuthStore } from '@/store/auth'
import { Button } from '@/components/ui/Button'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function Navbar() {
  const { user, logout } = useAuthStore()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const handleLogout = () => {
    logout()
    router.push('/auth/login')
  }

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-blue-700 dark:text-blue-400 font-bold text-xl tracking-tight">
            Lex<span className="text-emerald-600 dark:text-emerald-400">Africa</span>
          </span>
          <span className="hidden sm:inline text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
            OHADA
          </span>
        </Link>

        <nav className="flex items-center gap-3">
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Changer le thème"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          )}
          {user ? (
            <>
              <Link href="/dashboard" className="text-sm text-slate-600 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-400 transition-colors">
                Mes documents
              </Link>
              <span className="text-sm text-slate-400 dark:text-slate-500 hidden sm:inline">{user.email}</span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Déconnexion
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">Connexion</Button>
              </Link>
              <Link href="/auth/register">
                <Button variant="primary" size="sm">Créer un compte</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
