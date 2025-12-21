export type InvitationStatus = 'PENDING' | 'ACCEPTED' | 'CANCELLED' | 'EXPIRED'

export interface Invitation {
  id: string
  email: string
  token: string
  status: InvitationStatus
  tenantId: string
  invitedBy: string
  expiresAt: string
  createdAt: string
  updatedAt: string
  tenant?: {
    id: string
    name: string
    description: string | null
  }
  inviter?: {
    id: string
    name: string
    email: string
  }
}

export interface CreateInvitationData {
  email: string
}

export interface ListInvitationsResponse {
  invitations: Invitation[]
}
