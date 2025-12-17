'use client'

import {
  ReactNode,
  createContext,
  useEffect,
  useState,
  useCallback,
} from 'react'
import { setCookie, parseCookies, destroyCookie } from 'nookies'
import { useRouter } from 'next/navigation'
import { AxiosError } from 'axios'
import { api } from '../services/api-client'

export type User = {
  id: string
  name: string
  email: string
  role: string
  avatar: string
  created_at: string
}

type SignInCredentials = {
  email: string
  password: string
}

type AuthContextData = {
  signIn: (credentials: SignInCredentials) => Promise<void>
  setIsInvalidCredentials: (value: boolean) => void
  user: User | null
  isAuthenticate: boolean
  isLoadingAuth: boolean
  isInvalidCredentials: boolean
  signOut: () => void
}

type AuthProviderProps = {
  children: ReactNode
}

export const AuthContext = createContext({} as AuthContextData)
let authChannel: BroadcastChannel

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticate, setIsAuthenticate] = useState<boolean>(false)
  const [isLoadingAuth, setIsLoadingAuth] = useState(true)

  const [isInvalidCredentials, setIsInvalidCredentials] =
    useState<boolean>(false)

  const router = useRouter()
  const { 'uvs.token': token } = parseCookies()

  const signOut = useCallback(
    (byBroadcastChannel = false) => {
      destroyCookie(undefined, 'uvs.token', { path: '/' })
      destroyCookie(undefined, 'uvs.refreshToken', { path: '/' })

      setUser(null)
      setIsAuthenticate(false)

      if (!byBroadcastChannel) {
        authChannel.postMessage('signOut')
      }

      router.push('/auth/sign-in')
    },
    [router]
  )

  useEffect(() => {
    authChannel = new BroadcastChannel('auth')

    authChannel.onmessage = (message) => {
      switch (message.data) {
        case 'signOut':
          signOut(true)
          break

        default:
          break
      }
    }
  }, [signOut])

  useEffect(() => {
    if (token) {
      api
        .get('/me')
        .then((response) => {
          setUser(response.data.user)
          setIsAuthenticate(true)
        })
        .catch(() => {
          signOut()
          router.push('/auth/sign-in')
        })
        .finally(() => {
          setIsLoadingAuth(false)
        })
    } else {
      setIsLoadingAuth(false)
    }
  }, [router, signOut, token])

  async function signIn({ email, password }: SignInCredentials) {
    try {
      const response = await api.post('sessions', {
        email,
        password,
      })

      const { token, refreshToken, id, name, role, avatar, created_at } =
        response.data

      setCookie(undefined, 'uvs.token', token, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
      })
      setCookie(undefined, 'uvs.refreshToken', refreshToken, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
      })

      setUser({
        id,
        name,
        email,
        role,
        avatar,
        created_at,
      })

      api.defaults.headers.Authorization = `Bearer ${token}`

      authChannel.postMessage('signIn')

      router.push('/')
    } catch (err) {
      if (err instanceof AxiosError) {
        const isInvalidCredentials =
          err.response?.data.message === 'Invalid credentials.' ||
          'Validation error.'
        if (isInvalidCredentials) {
          setIsInvalidCredentials(true)
        }
      }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        isAuthenticate,
        isLoadingAuth,
        user,
        isInvalidCredentials,
        setIsInvalidCredentials,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
