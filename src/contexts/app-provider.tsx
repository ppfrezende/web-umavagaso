'use client'

import { ReactNode } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'

import { ThemeProvider } from 'next-themes'

import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from 'sonner'
import { queryClient } from '../services/query-client'
import { AuthProvider } from './auth-context'

export const AppProvider = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
        >
          <Toaster position="top-center" />
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </>
  )
}
