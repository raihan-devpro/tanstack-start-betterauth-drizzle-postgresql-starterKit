import FormLoginComponent from '@/components/form/form-login-component'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_public/_auth/login')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-lg">
        <FormLoginComponent />
      </div>
    </div>
  )
}
