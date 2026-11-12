import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { ThemeContext } from './ThemeContextDefinition'
import type { Theme, ThemeContextValue } from './ThemeContextDefinition'

function getInitialTheme(): Theme {
  try {
    const savedTheme = localStorage.getItem('skycast-theme')
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme
    }
  } catch {
    // Use the default theme when browser storage is unavailable.
  }

  return 'dark'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    try {
      localStorage.setItem('skycast-theme', theme)
    } catch {
      // Theme still works for the current session.
    }
  }, [theme])

  const value: ThemeContextValue = {
    theme,
    isNight: theme === 'dark',
    setTheme,
    toggleTheme: () =>
      setTheme((current) => (current === 'dark' ? 'light' : 'dark')),
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}