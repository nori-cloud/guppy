"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Moon, Sun } from "lucide-react"
import {
  ThemeProvider as NextThemeProvider,
  useTheme,
  type ThemeProviderProps,
} from "next-themes"
import { useEffect, useState } from "react"

// Export a custom ThemeProvider with enableSystem set to true by default
export function ThemeProvider({
  children,
  ...props
}: { children: React.ReactNode } & ThemeProviderProps) {
  return (
    <NextThemeProvider
      enableSystem={true}
      attribute="class"
      defaultTheme="system"
      {...props}
    >
      {children}
    </NextThemeProvider>
  )
}

// Simple toggle button that switches between light and dark
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <Button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={cn("rounded-md border p-2", className)}
    >
      {theme === "dark" ? <Sun /> : <Moon />}
    </Button>
  )
}

// Theme selector with dropdown
export function ThemeSelect() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <select
      value={theme}
      onChange={(e) => setTheme(e.target.value)}
      className="rounded-md border p-2"
    >
      <option value="system">System</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  )
}
