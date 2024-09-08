"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"
import { useState } from "react"


export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [queryClient] = useState(() => new QueryClient());
  return (

    <QueryClientProvider client={queryClient}>
      <NextThemesProvider {...props}>
        {children}
      </NextThemesProvider>
    </QueryClientProvider>


  )
}
