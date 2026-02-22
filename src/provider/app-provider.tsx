import React from 'react'
import { ThemeProvider } from './theme-provider'
import type { QueryClient } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { QueryProvider } from '@/integrations/tanstack-query/query-provider'

function AppProvider({ children, queryClient }: { children: React.ReactNode ,queryClient: QueryClient}) {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="ts-theme">
      <Toaster closeButton position="top-center" duration={500} />

      <TooltipProvider>
        <QueryProvider queryClient={queryClient}>{children}</QueryProvider>
      </TooltipProvider>
    </ThemeProvider>
  )
}

export default AppProvider
