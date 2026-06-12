'use client'
import Link from 'next/link'
import { useAuthStore } from '@/store/auth'
import { Button } from '@/components/ui/Button'
import { useRouter } from 'next/navigation'

export function Navbar() {
  const { user, logout } = useAuthStore()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-blue-700 font-bold text-xl tracking-tight">Lex<span className="text-emerald-600">Africa</span></span>
          <span className="hidden sm:inline text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">OHADA</span>
        </Link>

        <nav className="flex items-center gap-3">
          {user ? (
            <>
              <Link href="/dashboard" className="text-sm text-slate-600 hover:text-blue-700 transition-colors">
                Mes documents
              </Link>
              <span className="text-sm text-slate-400 hidden sm:inline">{user.email}</span>
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
