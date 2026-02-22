import { Link, useNavigate } from '@tanstack/react-router'

import { useStore } from '@tanstack/react-form'
import { Lock, Mail } from 'lucide-react'
import { toast } from 'sonner'
import { InputGroupAddon } from '../ui/input-group'
import { LoginFormSchema } from './zod-schema'
import type { LoginFormSchemaType } from './zod-schema'
import { authClient } from '@/integrations/better-auth/auth-client'
import { cn } from '@/lib/utils'
import { useAppForm } from '@/integrations/tanstack-form/form-hooks'
import { Card, CardContent } from '@/components/ui/card'

export default function FormLoginComponent({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const navigate = useNavigate()
  const form = useAppForm({
    defaultValues: {
      email: '',
      password: '',
    } as LoginFormSchemaType,
    validators: {
      onChange: LoginFormSchema,
    },
    onSubmit: async (data) => {
      const { email, password } = data.value

      toast.loading('Logging in...', { id: 'login' })
      await authClient.signIn.email(
        {
          email: email,
          password: password,

          callbackURL: '/dashboard',
        },
        {
          onSuccess: () => {
            toast.success('Account logged in successfully', { id: 'login' })
            navigate({ to: '/dashboard', replace: true })
            form.reset()
          },
          onError: ({error}) => {
            toast.error(error.message || 'Something went wrong', {
              id: 'login',
            })
            console.log(error)
          },
        },
      )
    },
  })
  const isSubmitting = useStore(form.store, (state) => state.isSubmitting)
  return (
    <div className={cn('flex flex-col gap-6 ', className)} {...props}>
      <Card className="shadow-none border-none ">
        <h1 className="text-4xl font-semibold mx-auto text-primary"> Log In</h1>
        <CardContent className="p-0">
          <form
            autoComplete="off"
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}
          >
            <div className="flex flex-col gap-6  p-6 rounded-lg">
              <div className="grid gap-3">
                <form.AppField name="email">
                  {(field) => (
                    <field.TsTextField
                      label="Email"
                      addOn={
                        <InputGroupAddon>
                          <Mail className="mr-1" />
                        </InputGroupAddon>
                      }
                      props={{
                        type: 'email',
                        autoComplete: 'off',
                        placeholder: 'email@example.com',
                      }}
                      description="Please enter your email"
                    />
                  )}
                </form.AppField>
              </div>
              <div className="grid gap-3">
                <form.AppField name="password">
                  {(field) => (
                    <field.TsTextField
                      label="Password"
                      addOn={
                        <InputGroupAddon>
                          <Lock className="mr-1" />
                        </InputGroupAddon>
                      }
                      description="Please enter your password"
                      props={{
                        type: 'password',
                        placeholder: '*****',
                        autoComplete: 'off',
                      }}
                    />
                  )}
                </form.AppField>
              </div>

              <div className="flex flex-col gap-3">
                <form.AppForm>
                  <form.TsSubscribeButton
                    label={isSubmitting? "Logging..." : "Log In"}
                    className={cn("w-full rounded-full", isSubmitting && "animate-pulse")}
                    disabled={isSubmitting}
                  />
                </form.AppForm>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className=" text-center text-sm flex items-center gap-2 justify-center">
        Don't have an account?
        <Link
          to="/signup"
          replace
          className="underline underline-offset-4 text-primary"
        >
          Sign Up
        </Link>
      </div>
    </div>
  )
}
