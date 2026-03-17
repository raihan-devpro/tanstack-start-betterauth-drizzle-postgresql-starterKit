import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Github, Loader2, Mail } from 'lucide-react'
import { FaGoogle } from 'react-icons/fa'
import { getSession } from '@/integrations/better-auth/auth-fns'


interface AuthCallbackSearch {
  social?: string
}

export const Route = createFileRoute('/_public/_auth/auth/callback')({
  component: AuthCallback,
  validateSearch: (search: Record<string, unknown>): AuthCallbackSearch => ({
    social: typeof search.social === 'string' ? search.social : undefined,
  }),
})

const providerConfig = {
  github: {
    name: 'GitHub',
    icon: Github,
    color: 'bg-gray-900 dark:bg-gray-100',
    textColor: 'text-gray-900 dark:text-gray-100',
    gradient: 'from-gray-700 to-gray-900 dark:from-gray-300 dark:to-gray-100',
  },
  google: {
    name: 'Google',
    icon: FaGoogle,
    color: 'bg-blue-500',
    textColor: 'text-blue-600 dark:text-blue-400',
    gradient: 'from-blue-400 via-red-400 via-yellow-400 to-green-400',
  },
  email: {
    name: 'Email',
    icon: Mail,
    color: 'bg-indigo-600',
    textColor: 'text-indigo-600 dark:text-indigo-400',
    gradient: 'from-indigo-500 to-purple-600',
  },
}

function AuthCallback() {
  const navigate = useNavigate()
  const search = Route.useSearch()
  const [progress, setProgress] = useState(0)

  const provider = (search.social )
  const config = providerConfig[(provider as keyof typeof providerConfig)]
  const Icon = config.icon

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev
        return prev + Math.random() * 15
      })
    }, 300)

    async function handleSync() {
      try {
        const session = await getSession()
        if (session) {
          setProgress(100)

          setTimeout(() => navigate({ to: '/dashboard' ,replace: true}), 50)
        } else {
          console.error('No session found after callback')
          navigate({ to: '/login' ,replace: true})
        }
      } catch (err) {
        console.error('Failed to sync session', err)
        navigate({ to: '/login' ,replace: true})
      }
    }
    handleSync()

    return () => clearInterval(progressInterval)
  }, [navigate])

  if(!provider) {
    navigate({ to: '/login',replace:true })
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="relative">
        {/* Animated rings */}
        <div className="absolute inset-0 -m-8">
          <div
            className="absolute inset-0 animate-ping rounded-full bg-linear-to-r opacity-20 dark:opacity-10"
            style={{
              background:
                provider === 'google'
                  ? 'linear-gradient(to right, #3b82f6, #ef4444, #eab308, #22c55e)'
                  : undefined,
            }}
          />
        </div>
        <div className="absolute inset-0 -m-4">
          <div
            className="absolute inset-0 animate-pulse rounded-full bg-linear-to-r opacity-30 dark:opacity-20"
            style={{ animationDelay: '0.5s' }}
          />
        </div>

        {/* Provider icon */}
        <div
          className={`relative flex items-center justify-center w-24 h-24 rounded-2xl ${config.color} shadow-2xl transform transition-all duration-500 hover:scale-105`}
        >
          <Icon className="w-12 h-12 text-white dark:text-gray-900" />
        </div>

        {/* Loading spinner */}
        <div className="absolute -bottom-2 -right-2">
          <div className="flex items-center justify-center w-10 h-10 bg-white dark:bg-slate-800 rounded-full shadow-lg">
            <Loader2 className="w-5 h-5 animate-spin text-slate-600 dark:text-slate-300" />
          </div>
        </div>
      </div>

      {/* Text content */}
      <div className="mt-8 text-center space-y-3">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
          Authenticating with{' '}
          <span className={config.textColor}>{config.name}</span>
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Please wait while we verify your credentials...
        </p>
      </div>

      {/* Progress bar */}
      <div className="mt-8 w-64">
        <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className={`h-full bg-linear-to-r ${config.gradient} rounded-full transition-all duration-500 ease-out`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        <div className="mt-2 flex justify-between text-xs text-slate-400 dark:text-slate-500">
          <span>Connecting</span>
          <span>{Math.round(Math.min(progress, 100))}%</span>
        </div>
      </div>

      {/* Security badge */}
      <div className="mt-8 flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-label="Secure lock icon"
        >
          <title>Secure</title>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
        <span>Secure authentication</span>
      </div>
    </div>
  )
}
