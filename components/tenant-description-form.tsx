'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { api } from '@/src/services/api-client'
import type { Tenant } from '@/src/contexts/auth-context'
import { Textarea } from './ui/textarea'

interface TenantFormProps {
  tenant: Tenant
  onUpdate?: (updatedTenant: Tenant) => void
}

export function TenantForm({ tenant, onUpdate }: TenantFormProps) {
  const [name, setName] = React.useState(tenant.name || '')
  const [description, setDescription] = React.useState(tenant.description || '')
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    if (!name.trim()) {
      setError('O nome do tenant é obrigatório.')
      setIsLoading(false)
      return
    }

    try {
      const response = await api.patch(`/tenants/${tenant.id}`, {
        name: name.trim(),
        description: description.trim(),
      })

      setSuccess(true)

      if (onUpdate) {
        onUpdate(response.data.tenant)
      }

      // Remove a mensagem de sucesso após 3 segundos
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError('Erro ao atualizar as informações. Tente novamente.')
      console.error('Error updating tenant:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="tenant-name">Nome da Mentoria *</Label>
        <Input
          id="tenant-name"
          type="text"
          placeholder="Digite o nome da mentoria"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isLoading}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tenant-description">Descrição da Mentoria</Label>
        <Textarea
          id="tenant-description"
          rows={4}
          placeholder="Digite a descrição da mentoria"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isLoading}
        />
      </div>

      {error && <div className="text-sm text-destructive">{error}</div>}

      {success && (
        <div className="text-sm text-green-600 dark:text-green-400">
          Informações atualizadas com sucesso!
        </div>
      )}

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Salvando...' : 'Salvar Alterações'}
      </Button>
    </form>
  )
}
