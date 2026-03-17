import { toast } from 'sonner'
import { Calendar, LogOut, Mail, User } from 'lucide-react'
import { useRouter } from '@tanstack/react-router'
import { useAppContext } from '@/hooks/use-app-context'
import { authClient } from '@/integrations/better-auth/auth-client'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

function LoggedInUserInfo() {
  const { session, user } = useAppContext()
  const router = useRouter()

  const handleLogout = () => {
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

  const getInitials = (name?: string) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }



  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center pb-4">
            <Avatar size="lg" className="size-24">
              <AvatarImage src={user?.image ?? ''} alt={user?.name ?? 'User'} />
              <AvatarFallback className="text-2xl">
                {getInitials(user?.name)}
              </AvatarFallback>
            </Avatar>
          </div>
          <CardTitle className="text-2xl">{user?.name ?? 'User'}</CardTitle>
          <CardDescription>Welcome to your dashboard</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Mail className="size-4" />
            <span>{user?.email ?? 'No email'}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Calendar className="size-4" />
            <span>
              Joined{' '}
              {user?.createdAt.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
          {session?.expiresAt && (
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <User className="size-4" />
              <span>
                Session expires{' '}
                {session.expiresAt.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            variant="destructive"
            onClick={handleLogout}
            className="w-full"
          >
            <LogOut className="mr-2 size-4" />
            Sign Out
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default LoggedInUserInfo