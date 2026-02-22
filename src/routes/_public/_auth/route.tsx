import LogoTextComponent from '@/components/shared/logo-text'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_public/_auth')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="relative min-h-screen w-full">
      <LogoTextComponent className='absolute top-4 left-4'/>
      {/* <Link
        to="/"
        className={buttonVariants({
          variant: 'secondary',
          size:"sm",
          className: 'absolute top-4 left-4',
        })}
      >
        <ArrowLeft className="size-4" /> Back to Home
      </Link> */}
      <Outlet />
    </div>
  )
}
