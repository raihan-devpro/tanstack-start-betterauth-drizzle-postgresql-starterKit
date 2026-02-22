import FormSignupComponent from '@/components/form/form-signup-component'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_public/_auth/signup')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-2 md:p-10">
      <div className="w-full max-w-lg">
        <FormSignupComponent />
      </div>
    </div>
  )
}
