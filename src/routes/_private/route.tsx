import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_private')({
  beforeLoad:({context})=>{

    if(!context.user?.id){
      throw redirect({
        to:'/login'
      })
    }

  },
  component: RouteComponent,
})

function RouteComponent() {
  return <Outlet />
}
