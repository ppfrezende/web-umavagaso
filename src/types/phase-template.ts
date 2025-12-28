export interface PhaseTemplate {
  id: string
  tenantId: string
  name: string
  description: string | null
  purpose: string
  defaultOrder: number
  isActive: boolean
  suggestedDurationDays: number | null
  defaultMinAccuracy: string | null
  defaultMinCompletion: string | null
  createdAt: string
  updatedAt: string
}

export interface CreatePhaseTemplateData {
  name: string
  description?: string
  purpose: string
  defaultOrder: number
  suggestedDurationDays?: number
  defaultMinAccuracy?: number
  defaultMinCompletion?: number
}

export interface UpdatePhaseTemplateData {
  name?: string
  description?: string
  purpose?: string
  defaultOrder?: number
  isActive?: boolean
  suggestedDurationDays?: number
  defaultMinAccuracy?: number
  defaultMinCompletion?: number
}

export interface PhaseTemplateResponse {
  phaseTemplate: PhaseTemplate
}

export interface PhaseTemplatesListResponse {
  phaseTemplates: PhaseTemplate[]
}
