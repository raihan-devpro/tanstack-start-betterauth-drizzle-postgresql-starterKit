import React from 'react'
import { NuqsAdapter } from 'nuqs/adapters/tanstack-router'
import { Provider as JotaiProvider } from 'jotai'
import { ThemeProvider } from './theme-provider'
import type { QueryClient } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { QueryProvider } from '@/integrations/tanstack-query/query-provider'
import AppModals from '@/app-modals'

function AppProvider({
  children,
  queryClient,
}: {
  children: React.ReactNode
  queryClient: QueryClient
}) {
  return (
    <JotaiProvider>
      <NuqsAdapter>
        <QueryProvider queryClient={queryClient}>
          <ThemeProvider defaultTheme="dark" storageKey="ts-theme">
            <TooltipProvider>
              <Toaster closeButton position="top-center" duration={500} />
              <AppModals />
              {children}
            </TooltipProvider>
          </ThemeProvider>
        </QueryProvider>
      </NuqsAdapter>
    </JotaiProvider>
  )
}

export default AppProvider
