export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export const DOC_LABELS: Record<string, string> = {
  cdi: 'Contrat CDI',
  cdd: 'Contrat CDD',
  nda: 'Accord de confidentialité',
  prestation: 'Contrat de prestation',
  pacte_associes: "Pacte d'associés",
}

export const COUNTRY_LABELS: Record<string, string> = {
  CI: "Côte d'Ivoire",
  SN: 'Sénégal',
}
