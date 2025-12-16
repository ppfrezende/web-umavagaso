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
import Image from 'next/image'
import { z } from 'zod'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { useContext, useState } from 'react'
import { Eye, EyeOff, LoaderIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { AuthContext } from '@/src/contexts/auth-context'

import logo from '@/public/logo.svg'
import logoDark from '@/public/logoDark.svg'
import sideImage from '@/public/side-image-login.png'
import { ThemeToggle } from '@/components/theme-toggle'

interface SignInFormData {
  email: string
  password: string
}
const authenticateBodySchema = z.object({
  email: z.string().email({ message: 'Digite um e-mail válido' }),
  password: z.string().min(6, { message: 'Min. 6 dígitos' }),
})

export default function SignInPage() {
  const { theme, systemTheme } = useTheme()

  const currentTheme = theme === 'system' ? systemTheme : theme

  const brand = currentTheme === 'dark' ? logoDark : logo

  const { signIn, isInvalidCredentials, setIsInvalidCredentials } =
    useContext(AuthContext)

  const { handleSubmit, register, formState } = useForm<SignInFormData>({
    resolver: zodResolver(authenticateBodySchema),
  })

  const { isSubmitting, errors } = formState

  const [showPassword, setShowPassword] = useState(false)
  const handleShowPassword = () => setShowPassword(!showPassword)

  const handleSignIn: SubmitHandler<SignInFormData> = async (values) => {
    await signIn(values)
  }
  return (
    <div className="flex min-h-screen bg-linear-to-br from-background via-background to-muted/20">
      <div className="container relative grid min-h-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
        {/* Left side - Login Card */}
        <div className="relative flex h-full flex-col items-center justify-center p-8">
          <div className="absolute right-8 top-8">
            <ThemeToggle />
          </div>

          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-112.5">
            <div className="flex flex-col items-center space-y-2 text-center">
              <Image src={brand} alt="Logo" className="mb-4 h-12 w-auto" />
              <h1 className="text-3xl font-bold tracking-tight">
                Bem-vindo de volta
              </h1>
              <p className="text-sm text-muted-foreground">
                Entre com suas credenciais de <strong>mentor</strong> para
                acessar sua conta
              </p>
              <p className="text-xs text-muted-foreground">
                *Se você é <strong>estudante</strong>, espere ser convidado por
                um mentor para poder acessar a plataforma
              </p>
            </div>

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-2xl">Login</CardTitle>
                <CardDescription>
                  Digite seu e-mail e senha para continuar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={handleSubmit(handleSignIn)}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      onFocus={() => setIsInvalidCredentials(false)}
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
                    <Label htmlFor="password">Senha</Label>
                    <Input
                      onFocus={() => setIsInvalidCredentials(false)}
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

                  {isInvalidCredentials && (
                    <div className="rounded-lg bg-destructive/10 p-3">
                      <p className="text-sm font-medium text-destructive">
                        Credenciais inválidas! Verifique seu e-mail e senha.
                      </p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="h-11 w-full text-base font-semibold"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                        Entrando...
                      </>
                    ) : (
                      'Entrar'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="flex items-center text-sm gap-2 justify-center">
              <p className="">Ainda não tem conta?</p>
              <strong>Criar conta</strong>
            </div>
          </div>
        </div>

        {/* Right side - Image */}
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex">
          <div className="absolute inset-0 overflow-hidden rounded-l-2xl">
            <Image
              src={sideImage}
              alt="Login illustration"
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
