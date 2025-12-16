'use client'

import { Switch } from '@/components/ui/switch'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

export function ThemeToggle() {
  const { theme, setTheme, systemTheme, resolvedTheme } = useTheme()

  const currentTheme = theme === 'system' ? systemTheme : theme
  const isDark = (resolvedTheme || currentTheme) === 'dark'

  const handleThemeChange = (checked: boolean) => {
    setTheme(checked ? 'dark' : 'light')
  }

  return (
    <div className="flex items-center gap-2 suppress-hydration-warning">
      <Sun className="h-4 w-4 text-muted-foreground" />
      <Switch checked={isDark} onCheckedChange={handleThemeChange} />
      <Moon className="h-4 w-4 text-muted-foreground" />
    </div>
  )
}
