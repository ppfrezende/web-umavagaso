'use client'

import { useMemo, useState } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
} from '@tanstack/react-table'
import {
  MoreHorizontal,
  Loader2,
  ArrowUpDown,
  Edit,
  Trash2,
  FileText,
  CheckCircle,
  XCircle,
} from 'lucide-react'

import type { PhaseTemplate } from '@/src/types/phase-template'
import { usePhaseTemplateActions } from '@/src/hooks/use-phase-template-actions'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { CreatePhaseTemplateDialog } from './create-phase-template-dialog'

interface PhaseTemplatesTableProps {
  phaseTemplates: PhaseTemplate[]
  tenantId: string
}

export function PhaseTemplatesTable({
  phaseTemplates,
  tenantId,
}: PhaseTemplatesTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [editingTemplate, setEditingTemplate] = useState<PhaseTemplate | null>(null)
  const { updatePhaseTemplate, deletePhaseTemplate } = usePhaseTemplateActions(tenantId)

  const columns = useMemo<ColumnDef<PhaseTemplate>[]>(
    () => [
      {
        accessorKey: 'defaultOrder',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
            >
              Ordem
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
        cell: ({ row }) => (
          <div className="font-medium text-center w-16">{row.getValue('defaultOrder')}</div>
        ),
      },
      {
        accessorKey: 'name',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
            >
              Nome
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
        cell: ({ row }) => (
          <div className="font-medium">{row.getValue('name')}</div>
        ),
      },
      {
        accessorKey: 'purpose',
        header: 'Propósito',
        cell: ({ row }) => (
          <div className="max-w-md truncate text-muted-foreground">
            {row.getValue('purpose')}
          </div>
        ),
      },
      {
        accessorKey: 'suggestedDurationDays',
        header: 'Duração (dias)',
        cell: ({ row }) => {
          const duration = row.getValue('suggestedDurationDays') as number | null
          return (
            <div className="text-center">
              {duration ?? '-'}
            </div>
          )
        },
      },
      {
        accessorKey: 'defaultMinAccuracy',
        header: 'Precisão Mín.',
        cell: ({ row }) => {
          const accuracy = row.getValue('defaultMinAccuracy') as string | null
          return (
            <div className="text-center">
              {accuracy ? `${parseFloat(accuracy).toFixed(0)}%` : '-'}
            </div>
          )
        },
      },
      {
        accessorKey: 'defaultMinCompletion',
        header: 'Conclusão Mín.',
        cell: ({ row }) => {
          const completion = row.getValue('defaultMinCompletion') as string | null
          return (
            <div className="text-center">
              {completion ? `${parseFloat(completion).toFixed(0)}%` : '-'}
            </div>
          )
        },
      },
      {
        accessorKey: 'isActive',
        header: 'Status',
        cell: ({ row }) => {
          const isActive = row.getValue('isActive') as boolean
          return (
            <Badge variant={isActive ? 'success' : 'destructive'}>
              {isActive ? (
                <>
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Ativo
                </>
              ) : (
                <>
                  <XCircle className="mr-1 h-3 w-3" />
                  Inativo
                </>
              )}
            </Badge>
          )
        },
      },
      {
        id: 'actions',
        header: () => <div className="text-right">Ações</div>,
        cell: ({ row }) => {
          const template = row.original
          const isLoadingUpdate = updatePhaseTemplate.isPending
          const isLoadingDelete = deletePhaseTemplate.isPending

          return (
            <div className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={isLoadingUpdate || isLoadingDelete}
                  >
                    {isLoadingUpdate || isLoadingDelete ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <MoreHorizontal className="h-4 w-4" />
                    )}
                    <span className="sr-only">Abrir menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => setEditingTemplate(template)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      updatePhaseTemplate.mutate({
                        phaseTemplateId: template.id,
                        data: { isActive: !template.isActive },
                      })
                    }
                  >
                    {template.isActive ? (
                      <>
                        <XCircle className="mr-2 h-4 w-4" />
                        Desativar
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Ativar
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      deletePhaseTemplate.mutate({ phaseTemplateId: template.id })
                    }
                    className="text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )
        },
      },
    ],
    [updatePhaseTemplate, deletePhaseTemplate]
  )

  const table = useReactTable({
    data: phaseTemplates,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  if (phaseTemplates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <FileText className="h-12 w-12 text-muted-foreground" />
        <h3 className="text-lg font-semibold">Nenhum template criado</h3>
        <p className="text-sm text-muted-foreground">
          Comece criando seu primeiro template de fase
        </p>
        <div className="py-2">
          <CreatePhaseTemplateDialog tenantId={tenantId} />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <Input
          placeholder="Filtrar por nome..."
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <CreatePhaseTemplateDialog
          tenantId={tenantId}
          editingTemplate={editingTemplate}
          onClose={() => setEditingTemplate(null)}
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Nenhum resultado encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-2">
        <div className="text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} template(s) no total
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <div className="text-sm text-muted-foreground">
            Página {table.getState().pagination.pageIndex + 1} de{' '}
            {table.getPageCount()}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Próxima
          </Button>
        </div>
      </div>
    </div>
  )
}
