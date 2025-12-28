'use client'

import { useState, useEffect } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Loader2 } from 'lucide-react'

import { useCreatePhaseTemplate } from '@/src/hooks/use-create-phase-template'
import { usePhaseTemplateActions } from '@/src/hooks/use-phase-template-actions'
import type { PhaseTemplate } from '@/src/types/phase-template'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const phaseTemplateSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
  purpose: z.string().min(1, 'Propósito é obrigatório'),
  defaultOrder: z.coerce.number().int().positive('Ordem deve ser um número positivo'),
  suggestedDurationDays: z.coerce.number().int().positive().optional().or(z.literal('')),
  defaultMinAccuracy: z.coerce.number().min(0).max(100).optional().or(z.literal('')),
  defaultMinCompletion: z.coerce.number().min(0).max(100).optional().or(z.literal('')),
})

type PhaseTemplateFormData = z.infer<typeof phaseTemplateSchema>

interface CreatePhaseTemplateDialogProps {
  tenantId: string
  editingTemplate?: PhaseTemplate | null
  onClose?: () => void
}

export function CreatePhaseTemplateDialog({
  tenantId,
  editingTemplate,
  onClose,
}: CreatePhaseTemplateDialogProps) {
  const [open, setOpen] = useState(false)
  const createPhaseTemplate = useCreatePhaseTemplate()
  const { updatePhaseTemplate } = usePhaseTemplateActions(tenantId)

  const isEditing = !!editingTemplate

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PhaseTemplateFormData>({
    resolver: zodResolver(phaseTemplateSchema),
    defaultValues: isEditing
      ? {
          name: editingTemplate.name,
          description: editingTemplate.description || '',
          purpose: editingTemplate.purpose,
          defaultOrder: editingTemplate.defaultOrder,
          suggestedDurationDays: editingTemplate.suggestedDurationDays || undefined,
          defaultMinAccuracy: editingTemplate.defaultMinAccuracy
            ? parseFloat(editingTemplate.defaultMinAccuracy)
            : undefined,
          defaultMinCompletion: editingTemplate.defaultMinCompletion
            ? parseFloat(editingTemplate.defaultMinCompletion)
            : undefined,
        }
      : undefined,
  })

  useEffect(() => {
    if (editingTemplate) {
      setOpen(true)
      reset({
        name: editingTemplate.name,
        description: editingTemplate.description || '',
        purpose: editingTemplate.purpose,
        defaultOrder: editingTemplate.defaultOrder,
        suggestedDurationDays: editingTemplate.suggestedDurationDays || undefined,
        defaultMinAccuracy: editingTemplate.defaultMinAccuracy
          ? parseFloat(editingTemplate.defaultMinAccuracy)
          : undefined,
        defaultMinCompletion: editingTemplate.defaultMinCompletion
          ? parseFloat(editingTemplate.defaultMinCompletion)
          : undefined,
      })
    }
  }, [editingTemplate, reset])

  const onSubmit: SubmitHandler<PhaseTemplateFormData> = async (data) => {
    const formattedData = {
      name: data.name,
      description: data.description || undefined,
      purpose: data.purpose,
      defaultOrder: data.defaultOrder,
      suggestedDurationDays:
        data.suggestedDurationDays
          ? Number(data.suggestedDurationDays)
          : undefined,
      defaultMinAccuracy:
        data.defaultMinAccuracy
          ? Number(data.defaultMinAccuracy)
          : undefined,
      defaultMinCompletion:
        data.defaultMinCompletion
          ? Number(data.defaultMinCompletion)
          : undefined,
    }

    if (isEditing && editingTemplate) {
      updatePhaseTemplate.mutate(
        {
          phaseTemplateId: editingTemplate.id,
          data: formattedData,
        },
        {
          onSuccess: () => {
            reset()
            setOpen(false)
            onClose?.()
          },
        }
      )
    } else {
      createPhaseTemplate.mutate(
        {
          tenantId,
          data: formattedData,
        },
        {
          onSuccess: () => {
            reset()
            setOpen(false)
          },
        }
      )
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!createPhaseTemplate.isPending && !updatePhaseTemplate.isPending) {
      setOpen(newOpen)
      if (!newOpen) {
        reset()
        onClose?.()
      }
    }
  }

  const isLoading = createPhaseTemplate.isPending || updatePhaseTemplate.isPending

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Novo Template
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Template de Fase' : 'Criar Template de Fase'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Edite as informações do template de fase'
              : 'Crie um novo template de fase para sua plataforma'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                placeholder="Ex: Introdução ao Python"
                {...register('name')}
                disabled={isLoading}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="defaultOrder">Ordem *</Label>
              <Input
                id="defaultOrder"
                type="number"
                placeholder="1"
                {...register('defaultOrder')}
                disabled={isLoading}
              />
              {errors.defaultOrder && (
                <p className="text-sm text-destructive">
                  {errors.defaultOrder.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="purpose">Propósito *</Label>
            <Textarea
              id="purpose"
              placeholder="Descreva o objetivo principal desta fase..."
              rows={3}
              {...register('purpose')}
              disabled={isLoading}
            />
            {errors.purpose && (
              <p className="text-sm text-destructive">{errors.purpose.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              placeholder="Informações adicionais sobre esta fase..."
              rows={2}
              {...register('description')}
              disabled={isLoading}
            />
            {errors.description && (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="suggestedDurationDays">Duração (dias)</Label>
              <Input
                id="suggestedDurationDays"
                type="number"
                placeholder="30"
                {...register('suggestedDurationDays')}
                disabled={isLoading}
              />
              {errors.suggestedDurationDays && (
                <p className="text-sm text-destructive">
                  {errors.suggestedDurationDays.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="defaultMinAccuracy">Precisão Mín. (%)</Label>
              <Input
                id="defaultMinAccuracy"
                type="number"
                min="0"
                max="100"
                step="0.01"
                placeholder="70"
                {...register('defaultMinAccuracy')}
                disabled={isLoading}
              />
              {errors.defaultMinAccuracy && (
                <p className="text-sm text-destructive">
                  {errors.defaultMinAccuracy.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="defaultMinCompletion">Conclusão Mín. (%)</Label>
              <Input
                id="defaultMinCompletion"
                type="number"
                min="0"
                max="100"
                step="0.01"
                placeholder="80"
                {...register('defaultMinCompletion')}
                disabled={isLoading}
              />
              {errors.defaultMinCompletion && (
                <p className="text-sm text-destructive">
                  {errors.defaultMinCompletion.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? 'Salvar Alterações' : 'Criar Template'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
