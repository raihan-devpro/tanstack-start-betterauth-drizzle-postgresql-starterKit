import { Link, useRouter } from '@tanstack/react-router'

import { toast } from 'sonner'
import LogoTextComponent from '../shared/logo-text'
import { ThemeToggler } from '../shared/theme-toggler'
import { Button, buttonVariants } from '@/components/ui/button'

import { useAppContext } from '@/hooks/use-app-context'
import { authClient } from '@/integrations/better-auth/auth-client'

export const NavbarComponent = () => {
  const { session } = useAppContext()
  const router = useRouter()
  const handelLogout = () => {
    authClient.signOut(
      {},
      {
        onSuccess: () => {
          toast.success('Logged out successfully')
          router.invalidate()
        },
        onError: ({ error }) => {
          toast.error(error.message || 'Something went wrong')
        },
      },
    )
  }
  return (
    <nav className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur-2xl supports-backdrop-filter:bg-background/60">
      <div className=" mx-auto flex items-center h-16 max-w-6xl justify-between">
        <LogoTextComponent />
        <div className="flex items-center gap-2">
          <ThemeToggler />
          {session ? (
            <>
              <Button
                variant={'outline'}
                size={'sm'}
                onClick={() => {
                  handelLogout()
                }}
              >
                Logout
              </Button>
              <Link
                to="/dashboard"
                className={buttonVariants({ variant: 'default', size: 'sm' })}
              >
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={buttonVariants({ variant: 'secondary', size: 'sm' })}
              >
                Login
              </Link>

              <Link
                to="/signup"
                className={buttonVariants({ variant: 'default', size: 'sm' })}
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
