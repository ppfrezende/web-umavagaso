'use client'

import { useContext, useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2, CheckCircle2, XCircle, Mail, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import { AxiosError } from 'axios'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { AuthContext } from '@/src/contexts/auth-context'
import { api } from '@/src/services/api-client'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type InvitationStatus =
  | 'loading'
  | 'form'
  | 'success'
  | 'error'
  | 'already-authenticated'

interface AcceptInvitationFormData {
  name: string
  password: string
  confirmPassword: string
}

const acceptInvitationSchema = z
  .object({
    name: z
      .string()
      .min(3, { message: 'Nome deve ter no mínimo 3 caracteres' }),
    password: z
      .string()
      .min(6, { message: 'Senha deve ter no mínimo 6 caracteres' }),
    confirmPassword: z.string().min(6, { message: 'Confirme sua senha' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })

function AcceptInvitationContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user, signOut } = useContext(AuthContext)
  const [status, setStatus] = useState<InvitationStatus>('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const token = searchParams.get('token')

  const { handleSubmit, register, formState } =
    useForm<AcceptInvitationFormData>({
      resolver: zodResolver(acceptInvitationSchema),
    })

  const { isSubmitting, errors } = formState

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setErrorMessage('Token de convite não fornecido')
      return
    }

    if (user) {
      setStatus('already-authenticated')
    } else {
      setStatus('form')
    }
  }, [user, token])

  const acceptInvitation: SubmitHandler<AcceptInvitationFormData> = async (
    values
  ) => {
    if (!token) {
      setStatus('error')
      setErrorMessage('Token de convite não fornecido')
      return
    }

    try {
      setErrorMessage('')
      await api.post(`/invitations/${token}/accept`, {
        name: values.name,
        password: values.password,
      })

      setStatus('success')
      toast.success('Convite aceito com sucesso!', {
        description: 'Você será redirecionado para fazer login.',
      })

      setTimeout(() => {
        router.push('/auth/sign-in')
      }, 2000)
    } catch (err) {
      if (err instanceof AxiosError) {
        const message = err.response?.data?.message || 'Erro ao aceitar convite'
        setErrorMessage(message)
        toast.error('Erro ao aceitar convite', {
          description: message,
        })
      }
    }
  }

  const handleSignOut = async () => {
    await signOut()
    setStatus('form')
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
            <CardTitle>Processando convite...</CardTitle>
            <CardDescription>
              Aguarde enquanto validamos seu convite
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (status === 'already-authenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Mail className="h-12 w-12 text-yellow-500" />
            </div>
            <CardTitle>Você já está autenticado</CardTitle>
            <CardDescription>
              Para aceitar este convite, você precisa sair da sua conta atual
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button onClick={handleSignOut} className="w-full">
              Sair e aceitar convite
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/dashboard/student')}
              className="w-full"
            >
              Voltar ao dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (status === 'form') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Mail className="h-12 w-12 text-primary" />
            </div>
            <CardTitle>Complete seu cadastro</CardTitle>
            <CardDescription>
              Preencha seus dados abaixo para aceitar o convite e criar sua
              conta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmit(acceptInvitation)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input
                  onFocus={() => setErrorMessage('')}
                  {...register('name')}
                  name="name"
                  type="text"
                  id="name"
                  placeholder="Seu nome completo"
                />
                {errors.name && (
                  <p className="text-sm font-medium text-destructive">
                    {errors?.name?.message?.toString()}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  onFocus={() => setErrorMessage('')}
                  {...register('password')}
                  placeholder="Digite sua senha"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                />
                {errors.password && (
                  <p className="text-sm font-medium text-destructive">
                    {errors?.password?.message?.toString()}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar senha</Label>
                <Input
                  onFocus={() => setErrorMessage('')}
                  {...register('confirmPassword')}
                  placeholder="Confirme sua senha"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  id="confirmPassword"
                />
                {errors.confirmPassword && (
                  <p className="text-sm font-medium text-destructive">
                    {errors?.confirmPassword?.message?.toString()}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-sm hover:bg-transparent"
              >
                {showPassword ? (
                  <div className="flex items-center gap-2">
                    <EyeOff size={16} /> Ocultar senha
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Eye size={16} /> Mostrar senha
                  </div>
                )}
              </button>

              {errorMessage && (
                <div className="rounded-lg bg-destructive/10 p-3">
                  <p className="text-sm font-medium text-destructive">
                    {errorMessage}
                  </p>
                </div>
              )}

              {isSubmitting ? (
                <Button className="w-full" disabled>
                  <Loader2 className="animate-spin" />
                </Button>
              ) : (
                <Button type="submit" className="w-full">
                  Aceitar convite e criar conta
                </Button>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
            </div>
            <CardTitle>Convite aceito!</CardTitle>
            <CardDescription>
              Sua conta foi criada com sucesso
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Redirecionando para a página de login...
            </p>
            <div className="flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <XCircle className="h-12 w-12 text-destructive" />
            </div>
            <CardTitle>Erro ao aceitar convite</CardTitle>
            <CardDescription>{errorMessage}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button onClick={() => setStatus('form')} className="w-full">
              Tentar novamente
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/')}
              className="w-full"
            >
              Voltar ao início
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return null
}

export default function AcceptInvitationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
              <CardTitle>Carregando...</CardTitle>
              <CardDescription>
                Aguarde enquanto validamos seu convite
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      }
    >
      <AcceptInvitationContent />
    </Suspense>
  )
}
