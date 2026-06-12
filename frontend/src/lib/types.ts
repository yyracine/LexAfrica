export interface User {
  id: string
  email: string
  company_name: string | null
  country: string | null
  plan: string
  created_at: string
}

export interface AuthToken {
  access_token: string
  token_type: string
  user: User
}

export interface DocumentRecord {
  id: string
  document_type: string
  country: string
  status: string
  is_paid: boolean
  created_at: string
}

export interface WizardField {
  id: string
  type: 'text' | 'number' | 'select' | 'textarea' | 'boolean' | 'associates_list'
  label: string
  required?: boolean
  placeholder?: string
  options?: { value: string; label: string }[]
  min?: number
  max?: number
  default?: unknown
  default_CI?: string
  default_SN?: string
  default_cadre?: number
  default_non_cadre?: number
}

export interface WizardStep {
  id: string
  title: string
  description?: string
  fields: WizardField[]
}

export interface WizardSchema {
  title: string
  description: string
  countries: string[]
  steps: WizardStep[]
}

export interface Associate {
  name: string
  percentage: number
}

export type FormData = Record<string, unknown>

export type DocumentType = 'cdi' | 'cdd' | 'nda' | 'prestation' | 'pacte_associes'
export type Country = 'CI' | 'SN'
