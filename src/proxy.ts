import { NextRequest, NextResponse } from 'next/server'

export default function proxy(request: NextRequest) {
  const token = request.cookies.get('uvs.token')?.value
  const signInURL = new URL('/auth/sign-in', request.url)
  const dashboardURL = new URL('/dashboard', request.url)

  // Se está tentando acessar a página de login e já está autenticado
  if (request.nextUrl.pathname === '/auth/sign-in') {
    if (token) {
      return NextResponse.redirect(dashboardURL)
    }
    return NextResponse.next()
  }

  // Se está tentando acessar uma rota privada sem estar autenticado
  if (!token) {
    return NextResponse.redirect(signInURL)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/sign-in'],
}
