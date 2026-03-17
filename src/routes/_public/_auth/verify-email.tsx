import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { ArrowLeft, CheckCircle2, Clock, Loader2, Mail } from 'lucide-react'
import z from 'zod'
import { toast } from 'sonner'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { authClient } from '@/integrations/better-auth/auth-client'

export const Route = createFileRoute('/_public/_auth/verify-email')({
  validateSearch: z.object({
    email: z.email().optional(),
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const [otp, setOtp] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const { email } = Route.useSearch()

  const mockEmail = email || 'john.doe@example.com'

  const handleVerify = async () => {
    if (otp.length !== 6) return
    setIsLoading(true)
    toast.loading('Verifying email...', {
      id: 'verify-email',
    })
    await authClient.signIn.emailOtp(
      {
        email: email ?? '',
        otp,
      },
      {
        onSuccess: () => {
          toast.success('Email verified successfully', {
            id: 'verify-email',
          })
          setIsVerified(true)

          navigate({ to: '/dashboard', replace: true })
        },
        onError: ({ error }) => {
          toast.error(error.message || 'Something went wrong', {
            id: 'verify-email',
          })
          setIsVerified(false)
          console.log(error)
        },
      },
    )

    setIsLoading(false)
  }
  const startResendCooldown = () => {
    setResendCooldown(60)
    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleResend = async () => {
    toast.loading('Sending verification code...', {
      id: 'verify-email',
    })
    await authClient.emailOtp.sendVerificationOtp(
      {
        email: email ?? '',
        type: 'sign-in',
      },
      {
        onSuccess: () => {
          toast.success('Verification code sent successfully', {
            id: 'verify-email',
          })
          startResendCooldown()
        },
        onError: ({ error }) => {
          toast.error(error.message || 'Something went wrong', {
            id: 'verify-email',
          })
          console.log(error)
        },
      },
    )
  }

  if (isVerified) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-4 md:p-10">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 flex flex-col items-center text-center">
            <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Email Verified!</h2>
            <p className="text-muted-foreground mb-6">
              Your email has been successfully verified. You can now access all
              features.
            </p>
            <Button
              className="w-full"
              onClick={() => {
                window.location.href = '/login'
              }}
            >
              Continue to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-4 md:p-10">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Verify your email</CardTitle>
          <CardDescription className="mt-2">
            We've sent a 6-digit verification code to your email address.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-center gap-2 rounded-lg bg-muted/50 p-3 text-sm">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{mockEmail}</span>
          </div>

          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(value) => setOtp(value)}
              className="gap-0"
            >
              <InputOTPGroup>
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                    className="h-12 w-12"
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>
          <div className="text-center text-sm text-muted-foreground">
            Enter the 6-digit verification code
          </div>

          <Button
            className="w-full"
            size="lg"
            onClick={handleVerify}
            disabled={otp.length !== 6 || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              'Verify Email'
            )}
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <div className="text-center text-sm text-muted-foreground">
            Didn't receive the code?{' '}
            {resendCooldown > 0 ? (
              <span className="flex items-center justify-center gap-1 mt-1">
                <Clock className="h-3 w-3" />
                Resend in {resendCooldown}s
              </span>
            ) : (
              <Button
                variant="link"
                className="h-auto p-0 text-primary"
                onClick={handleResend}
              >
                Resend verification code
              </Button>
            )}
          </div>
          <Link
            className={buttonVariants({
              variant: 'ghost',
              className: 'w-full',
            })}
            to="/signup"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Sign Up
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
