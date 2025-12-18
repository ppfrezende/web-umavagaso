'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from './ui/button'

export function ThemeSwitcher() {
  const { theme, setTheme, systemTheme, resolvedTheme } = useTheme()

  const currentTheme = theme === 'system' ? systemTheme : theme
  const isDark = (resolvedTheme || currentTheme) === 'dark'

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark')
  }

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme}>
      <Sun className="block dark:hidden" />
      <Moon className="hidden dark:block" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
