import { Check, Moon, Settings, Sun } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { useTheme } from '@/provider/theme-provider'

export function ThemeToggler({
  size = 'icon-sm',
  className,
  text,
  variant = "outline",
}: {
  size?: 'sm' | 'icon' | 'icon-sm'
  className?: string
  text?: string
  variant?: "link" | "default" | "outline" | "destructive" | "secondary" | "ghost" | null | undefined
}) {
  const { setTheme, theme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={cn('w-fit  p-2', className)}
        >
          <div className="flex items-center gap-2 ">
            <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
            <span className="sr-only">Toggle theme</span>
          </div>
          {text && text}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>
          Light <Check className={cn(theme !== 'light' && 'hidden')} />
          <Sun className="h-[1.2rem] w-[1.2rem]  ml-auto transition-all  " />
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          Dark <Check className={cn(theme != 'dark' && 'hidden')} />
          <Moon className="h-[1.2rem] w-[1.2rem]   ml-auto transition-all  " />
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          System <Check className={cn(theme != 'system' && 'hidden')} />{' '}
          <Settings className="h-[1.2rem] w-[1.2rem]   ml-auto transition-all  " />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
