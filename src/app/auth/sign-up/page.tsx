'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import Image from 'next/image'
import { z } from 'zod'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Eye, EyeOff, LoaderIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/navigation'
import { api } from '@/src/services/api-client'
import { AxiosError } from 'axios'

import logo from '@/public/logo.svg'
import logoDark from '@/public/logoDark.svg'
import sideImage from '@/public/side-image-login.png'
import { ThemeSwitcher } from '@/components/theme-switcher'
import Link from 'next/link'

interface SignUpFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
  tenantName: string
  tenantDescription?: string
}

const signUpSchema = z
  .object({
    name: z
      .string()
      .min(3, { message: 'Nome deve ter no mínimo 3 caracteres' }),
    email: z.string().email({ message: 'Digite um e-mail válido' }),
    password: z
      .string()
      .min(6, { message: 'Senha deve ter no mínimo 6 caracteres' }),
    confirmPassword: z.string().min(6, { message: 'Confirme sua senha' }),
    tenantName: z.string().min(3, {
      message: 'Nome da escola/organização deve ter no mínimo 3 caracteres',
    }),
    tenantDescription: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })

export default function SignUpPage() {
  const { theme, systemTheme } = useTheme()
  const router = useRouter()

  const currentTheme = theme === 'system' ? systemTheme : theme
  const brand = currentTheme === 'dark' ? logoDark : logo

  const [showPassword, setShowPassword] = useState(false)
  const [isOtpStep, setIsOtpStep] = useState(false)
  const [otp, setOtp] = useState('')
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [otpError, setOtpError] = useState('')

  const { handleSubmit, register, formState } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  })

  const { isSubmitting, errors } = formState

  const handleShowPassword = () => setShowPassword(!showPassword)

  const handleSignUp: SubmitHandler<SignUpFormData> = async (values) => {
    try {
      setErrorMessage('')
      await api.post('/users/register-with-tenant', {
        user: {
          name: values.name,
          email: values.email,
          password: values.password,
        },
        tenant: {
          name: values.tenantName,
          ...(values.tenantDescription && {
            description: values.tenantDescription,
          }),
        },
      })

      setUserEmail(values.email)
      setIsOtpStep(true)
    } catch (err) {
      if (err instanceof AxiosError) {
        setErrorMessage(
          err.response?.data.message || 'Erro ao criar conta. Tente novamente.'
        )
      }
    }
  }

  const handleVerifyOtp = async () => {
    try {
      setIsVerifyingOtp(true)
      setOtpError('')

      await api.post('/users/verify', {
        token: otp,
      })

      router.push('/auth/sign-in')
    } catch (err) {
      if (err instanceof AxiosError) {
        setOtpError(
          err.response?.data.message || 'Código inválido. Tente novamente.'
        )
      }
    } finally {
      setIsVerifyingOtp(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-linear-to-br from-background via-background to-muted/20">
      <div className="container relative grid min-h-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
        {/* Left side - Sign Up Card */}
        <div className="relative flex h-full flex-col items-center justify-center p-8">
          <div className="absolute right-8 top-8">
            <ThemeSwitcher />
          </div>

          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-112.5">
            <div className="flex flex-col items-center space-y-2 text-center">
              <Image src={brand} alt="Logo" className="mb-4 h-12 w-auto" />
              <h1 className="text-3xl font-bold tracking-tight">
                {isOtpStep ? 'Confirme seu e-mail' : 'Criar conta'}
              </h1>
              <p className="text-sm text-muted-foreground">
                {isOtpStep
                  ? `Enviamos um código de verificação para ${userEmail}`
                  : 'Preencha os dados abaixo para criar sua conta de mentor'}
              </p>
            </div>

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-2xl">
                  {isOtpStep ? 'Código de verificação' : 'Cadastro'}
                </CardTitle>
                <CardDescription>
                  {isOtpStep
                    ? 'Digite o código de 6 dígitos enviado para seu e-mail'
                    : 'Digite seus dados para continuar'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!isOtpStep ? (
                  <form
                    onSubmit={handleSubmit(handleSignUp)}
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
                      <Label htmlFor="email">E-mail</Label>
                      <Input
                        onFocus={() => setErrorMessage('')}
                        {...register('email')}
                        name="email"
                        type="email"
                        id="email"
                        placeholder="seu@email.com"
                      />
                      {errors.email && (
                        <p className="text-sm font-medium text-destructive">
                          {errors?.email?.message?.toString()}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tenantName">Nome da Organização</Label>
                      <Input
                        onFocus={() => setErrorMessage('')}
                        {...register('tenantName')}
                        name="tenantName"
                        type="text"
                        id="tenantName"
                        placeholder="Alfaestrategrancaveira XYZ"
                      />
                      {errors.tenantName && (
                        <p className="text-sm font-medium text-destructive">
                          {errors?.tenantName?.message?.toString()}
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
                      onClick={handleShowPassword}
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
                        <LoaderIcon className="animate-spin" />
                      </Button>
                    ) : (
                      <Button type="submit" className="w-full">
                        Criar conta
                      </Button>
                    )}
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <InputOTP
                        maxLength={6}
                        value={otp}
                        onChange={(value) => {
                          setOtp(value)
                          setOtpError('')
                        }}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>

                      {otpError && (
                        <div className="rounded-lg bg-destructive/10 p-3 w-full">
                          <p className="text-sm font-medium text-destructive text-center">
                            {otpError}
                          </p>
                        </div>
                      )}
                    </div>

                    {isVerifyingOtp ? (
                      <Button className="w-full" disabled>
                        <LoaderIcon className="animate-spin" />
                      </Button>
                    ) : (
                      <Button
                        onClick={handleVerifyOtp}
                        className="w-full"
                        disabled={otp.length !== 6}
                      >
                        Verificar código
                      </Button>
                    )}

                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => setIsOtpStep(false)}
                        className="text-sm text-muted-foreground hover:text-foreground"
                      >
                        Voltar para o cadastro
                      </button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex items-center text-sm gap-2 justify-center">
              <p className="">Já tem uma conta?</p>
              <Link href="/auth/sign-in">
                <strong className="hover:underline">Fazer login</strong>
              </Link>
            </div>
          </div>
        </div>

        {/* Right side - Image */}
        <div className="relative hidden h-full flex-col bg-transparent p-10 lg:flex">
          <div className="absolute inset-0 overflow-hidden rounded-l-2xl">
            <Image
              src={sideImage}
              alt="Sign up illustration"
              className="h-full w-full object-cover"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg font-medium">
                &ldquo;Foque em UM edital e seja aprovado mais rápido&rdquo;
              </p>
              <footer className="text-sm opacity-80">
                UmaVagaSó - Plataforma OpenSource de gestão de estudos unindo
                mentor e estudante.
              </footer>
            </blockquote>
          </div>
        </div>
      </div>
    </div>
  )
}
