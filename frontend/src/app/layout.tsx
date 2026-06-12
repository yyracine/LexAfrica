import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/Navbar'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LexAfrica - Documents juridiques OHADA',
  description: "Générez des contrats et documents juridiques conformes au droit OHADA pour la Côte d'Ivoire et le Sénégal.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={`${geist.className} bg-slate-50 text-slate-800 antialiased`}>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  )
}
