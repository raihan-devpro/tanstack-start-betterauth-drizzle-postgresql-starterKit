import { Link, useNavigate } from '@tanstack/react-router'
import { Lock, Mail, User } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Checkbox } from '../ui/checkbox'
import { InputGroupAddon } from '../ui/input-group'
import { SignupSchema } from './zod-schema'
import type { SignupSchemaType } from './zod-schema'
import { Card, CardContent } from '@/components/ui/card'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from '@/components/ui/field'
import { useAppForm } from '@/integrations/tanstack-form/form-hooks'
import { cn } from '@/lib/utils'

import { authClient } from '@/integrations/better-auth/auth-client'

export default function FormSignupComponent({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const navigate = useNavigate()
  const [agreement, setAgreement] = useState(false)
  const [subscribe, setSubscribe] = useState(false)
  const form = useAppForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    } as SignupSchemaType,
    validators: {
      onChange: SignupSchema,
    },
    onSubmit: async (data) => {
      const { name, email, password } = data.value

      toast.loading('Creating account...',{id:"signup"})
      await authClient.signUp.email({
        email: email,
        password: password,
        name: name,
        // callbackURL: '/dashboard',
      },{
        onSuccess: () => {
          toast.success('Account created successfully',{id:"signup"})
          navigate({to:"/dashboard",replace:true})
          form.reset()
        },
        onError: ({error}) => {
          toast.error(error.message || "Something went wrong",{id:"signup"})
          console.log(error)
        },
      })
    },
  })
  return (
    <div className={cn('flex flex-col gap-6 ', className)} {...props}>
      <Card className="shadow-none border-none  ">
        <h1 className="text-4xl font-semibold mx-auto text-primary">
          {' '}
          Sign Up{' '}
        </h1>
        <CardContent className="p-0 ">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}
          >
            <div className="flex flex-col gap-6  p-6 rounded-lg">
              <div className="grid gap-3">
                <form.AppField name="name">
                  {(field) => (
                    <field.TsTextField
                      label="Name"
                      props={{
                        type: 'text',
                        autoComplete: 'off',
                        placeholder: 'John Doe',
                      }}
                      // description="Please enter your name"
                      addOn={
                        <InputGroupAddon key={'name'}>
                          <User />
                        </InputGroupAddon>
                      }
                    />
                  )}
                </form.AppField>
              </div>
              <div className="grid gap-3">
                <form.AppField name="email">
                  {(field) => (
                    <field.TsTextField
                      label="Email"
                      addOn={
                        <InputGroupAddon key={'email'}>
                          <Mail />
                        </InputGroupAddon>
                      }
                      props={{
                        type: 'email',
                        autoComplete: 'off',
                        placeholder: 'email@example.com',
                      }}
                      // description="Please enter your phone number"
                    />
                  )}
                </form.AppField>
              </div>
              <div className="grid gap-3">
                <form.AppField name="password">
                  {(field) => (
                    <field.TsTextField
                      label="Password"
                      // description="Please enter your password"
                      addOn={
                        <InputGroupAddon key={'password'}>
                          <Lock />
                        </InputGroupAddon>
                      }
                      props={{
                        type: 'password',
                        autoComplete: 'off',
                        placeholder: '*****',
                      }}
                    />
                  )}
                </form.AppField>
              </div>
              <div className="flex flex-col gap-2">
                <Field orientation="horizontal">
                  <Checkbox
                    id="terms-checkbox-2"
                    checked={agreement}
                    onCheckedChange={(checked) => {
                      setAgreement(checked === true)
                    }}
                    name="terms-checkbox-2"
                  />
                  <FieldContent>
                    <FieldLabel
                      htmlFor="terms-checkbox-2"
                      className="cursor-pointer"
                    >
                      Accept terms and conditions
                    </FieldLabel>
                    <FieldDescription className="text-xs">
                      By clicking this, you agree to the{' '}
                      <Link
                        to="/terms-conditons"
                        className="hover:underline cursor-pointer text-primary"
                      >
                        Terms & Conditions
                      </Link>
                      {' | '}
                      <Link
                        to="/privacy-policy"
                        className="hover:underline cursor-pointer text-primary"
                      >
                        Privacy Policy
                      </Link>
                    </FieldDescription>
                  </FieldContent>
                </Field>
                <Field orientation="horizontal">
                  <Checkbox
                    id="subscribe-checkbox"
                    checked={subscribe}
                    onCheckedChange={(checked) => {
                      setSubscribe(checked === true)
                    }}
                    name="subscribe-checkbox"
                  />
                  <FieldContent>
                    <FieldLabel
                      htmlFor="subscribe-checkbox"
                      className="cursor-pointer"
                    >
                      Send me updates and news
                    </FieldLabel>
                    {/* <FieldDescription>
                    By clicking this checkbox, you agree to receive marketing
                    communications from us. You can unsubscribe at any time.
                  </FieldDescription> */}
                  </FieldContent>
                </Field>
              </div>
              <div className="flex flex-col gap-3">
                <form.AppForm>
                  <form.TsSubscribeButton
                    disabled={!agreement}
                    label=" Sign up"
                    className="w-full rounded-full"
                  />
                </form.AppForm>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className=" text-center text-sm">
        Already have an account?{' '}
        <Link to="/login" replace className="underline underline-offset-4">
          Login
        </Link>
      </div>
    </div>
  )
}
