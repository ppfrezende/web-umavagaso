# Sistema de Convites de Alunos

## Resumo da Implementação

Esta documentação descreve a implementação completa do sistema de convites de alunos no frontend da plataforma Uma Vaga Só.

## Arquivos Criados

### 1. Componentes UI (shadcn/ui)

#### [components/ui/dialog.tsx](components/ui/dialog.tsx)
- Componente de diálogo modal baseado em Radix UI
- Usado para exibir o formulário de convite

#### [components/ui/select.tsx](components/ui/select.tsx)
- Componente de seleção dropdown
- Baseado em Radix UI

#### [components/ui/table.tsx](components/ui/table.tsx)
- Componente de tabela responsiva
- Usado para exibir a lista de convites

#### [components/ui/badge.tsx](components/ui/badge.tsx)
- Componente de badge/tag para status
- Variantes: default, success, warning, destructive, outline

### 2. Tipos TypeScript

#### [src/types/invitation.ts](src/types/invitation.ts)
```typescript
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
  tenant?: { ... }
  inviter?: { ... }
}
```

### 3. Componentes de Funcionalidade

#### [components/invite-student-dialog.tsx](components/invite-student-dialog.tsx)
**Responsabilidades:**
- Formulário modal para enviar convites
- Validação de email com Zod
- Integração com API: `POST /tenants/:tenantId/invitations`
- Feedback de sucesso/erro com toast

**Props:**
- `tenantId`: ID do tenant
- `onInviteSent`: Callback após envio bem-sucedido

**Validações:**
- Email obrigatório e válido
- Previne fechamento durante envio

#### [components/invitations-table.tsx](components/invitations-table.tsx)
**Responsabilidades:**
- Exibir lista de convites em formato tabular
- Ações: Reenviar e Cancelar convites
- Formatação de datas com `date-fns`
- Badges coloridos por status
- Menu dropdown para ações

**Colunas:**
- Email do convidado
- Status (badge colorido)
- Data de envio (relativa)
- Data de expiração (relativa)
- Ações (dropdown menu)

**Integração API:**
- `POST /invitations/:id/resend` - Reenviar convite
- `DELETE /invitations/:id` - Cancelar convite

**Regras de Negócio:**
- Apenas convites PENDING podem ser reenviados
- Apenas convites PENDING podem ser cancelados
- Convites expirados são automaticamente detectados
- Estados de loading individuais por ação

### 4. Páginas

#### [src/app/dashboard/mentor/invitations/page.tsx](src/app/dashboard/mentor/invitations/page.tsx)
**Rota:** `/dashboard/mentor/invitations`

**Características:**
- Protegida por autenticação
- Apenas OWNER e MENTOR têm acesso
- Lista todos os convites do tenant
- Botão de ação para convidar novo aluno
- Integração com API: `GET /tenants/:tenantId/invitations`

**Validações:**
- Redireciona não-autorizados para dashboard
- Verifica role do usuário (OWNER/MENTOR)
- Toast de erro para acessos negados

#### [src/app/accept-invitation/page.tsx](src/app/accept-invitation/page.tsx)
**Rota:** `/accept-invitation?token=...`

**Características:**
- Rota pública (não requer autenticação)
- Aceita convite via query parameter token
- Integração com API: `POST /invitations/:token/accept`
- Redireciona para sign-up após aceite

**Fluxos:**
1. **Usuário não autenticado:** Aceita convite automaticamente → Redireciona para cadastro
2. **Usuário autenticado:** Oferece opção de sair e aceitar convite
3. **Sucesso:** Exibe confirmação e redireciona em 2s
4. **Erro:** Exibe mensagem e permite retry

**Estados:**
- `loading`: Processando convite
- `success`: Convite aceito com sucesso
- `error`: Erro ao aceitar convite
- `already-authenticated`: Usuário já logado

### 5. Navegação

#### [components/mentor-sidebar.tsx](components/mentor-sidebar.tsx) (atualizado)
- Link "Convites" adicionado em "Gestão de Alunos"
- Aponta para `/dashboard/mentor/invitations`

## Fluxo de Uso

### 1. Mentor/Owner Envia Convite
1. Acessa `/dashboard/mentor/invitations`
2. Clica em "Convidar Aluno"
3. Preenche email do aluno
4. Sistema envia email com link único
5. Convite aparece na tabela com status "Pendente"

### 2. Aluno Recebe e Aceita Convite
1. Aluno clica no link do email: `http://localhost:3333/accept-invitation?token=...`
2. Se não estiver logado: convite é aceito automaticamente
3. Sistema redireciona para `/auth/sign-up`
4. Aluno completa cadastro
5. Status do convite muda para "Aceito"

### 3. Gerenciamento de Convites
- **Reenviar:** Mentor pode reenviar convites pendentes
- **Cancelar:** Mentor pode cancelar convites pendentes
- **Expiração:** Convites expiram automaticamente em 7 dias

## Integrações Backend

### Endpoints Utilizados

```typescript
// Criar convite
POST /tenants/:tenantId/invitations
Body: { email: string }

// Listar convites
GET /tenants/:tenantId/invitations
Response: { invitations: Invitation[] }

// Aceitar convite (público)
POST /invitations/:token/accept
Response: { email, tenantName, inviterName }

// Reenviar convite
POST /invitations/:invitationId/resend

// Cancelar convite
DELETE /invitations/:invitationId
```

## Validações Implementadas

### Frontend
- ✅ Email válido e obrigatório
- ✅ Verificação de role (OWNER/MENTOR)
- ✅ Previne ações em convites aceitos/cancelados
- ✅ Detecta convites expirados (7 dias)
- ✅ Loading states para todas as ações
- ✅ Feedback visual com toasts

### Backend (esperado)
- ✅ Apenas OWNER e MENTOR podem convidar
- ✅ OWNER não pode ser convidado
- ✅ MENTOR não pode ser convidado
- ✅ STUDENT pode estar em múltiplos tenants
- ✅ Não permite convites duplicados
- ✅ Token único e seguro
- ✅ Expiração em 7 dias

## Dependências

### Já Instaladas
- `react-hook-form` - Gerenciamento de formulários
- `zod` - Validação de schemas
- `@hookform/resolvers` - Integração Zod + RHF
- `date-fns` - Formatação de datas
- `sonner` - Toast notifications
- `lucide-react` - Ícones
- `axios` - Cliente HTTP
- Radix UI components (dialog, select, dropdown)

### Novas Dependências
Nenhuma dependência adicional foi necessária.

## Testes Recomendados

### Testes Funcionais
1. ✅ Enviar convite com email válido
2. ✅ Enviar convite com email inválido (deve falhar)
3. ✅ Enviar convite duplicado (deve falhar no backend)
4. ✅ Reenviar convite pendente
5. ✅ Cancelar convite pendente
6. ✅ Aceitar convite com token válido
7. ✅ Aceitar convite com token inválido (deve falhar)
8. ✅ Aceitar convite expirado (deve falhar)
9. ✅ Tentar aceitar convite estando logado
10. ✅ Acessar página de convites sem permissão

### Testes de UX
1. ✅ Loading states durante requisições
2. ✅ Toast de sucesso/erro apropriados
3. ✅ Formatação de datas em português
4. ✅ Badges coloridos por status
5. ✅ Responsividade da tabela
6. ✅ Modal não fecha durante envio

## Melhorias Futuras

### Funcionalidades
- [ ] Paginação da tabela de convites
- [ ] Filtros (status, data, email)
- [ ] Busca por email
- [ ] Exportar lista de convites
- [ ] Convites em lote (múltiplos emails)
- [ ] Preview do email de convite

### Otimizações
- [ ] React Query para cache de convites
- [ ] Debounce no campo de email
- [ ] Skeleton loaders
- [ ] Infinite scroll na tabela

### Acessibilidade
- [ ] Testes com screen readers
- [ ] Navegação por teclado
- [ ] ARIA labels adequados

## Arquitetura

### Padrões Utilizados
- **Component Composition:** Componentes reutilizáveis e modulares
- **Controlled Components:** Formulários controlados com RHF
- **Schema Validation:** Validação declarativa com Zod
- **Error Handling:** Try/catch com feedback visual
- **Loading States:** Estados de carregamento granulares
- **Separation of Concerns:** Lógica separada de apresentação

### Boas Práticas
- TypeScript strict mode
- Props interfaces tipadas
- Error boundaries implícitos
- Acessibilidade com Radix UI
- Toast notifications consistentes
- Client-side validation + server validation

## Observações

1. **Segurança:** Tokens são validados apenas no backend
2. **Email:** Backend deve enviar emails automaticamente
3. **Multi-tenant:** Sistema respeita isolamento de tenants
4. **Roles:** Validações de permissão em frontend e backend
5. **Expiração:** Calculada no cliente, validada no servidor

## Suporte

Para dúvidas ou problemas:
1. Verifique logs do backend para erros de API
2. Confirme que variáveis de ambiente estão corretas
3. Valide que o backend está rodando corretamente
4. Teste endpoints via Postman/Insomnia
