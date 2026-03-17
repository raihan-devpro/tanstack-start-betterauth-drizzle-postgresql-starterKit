import { createFileRoute } from '@tanstack/react-router'
import LoggedInUserInfo from '@/components/custom/LoggedInUserInfo'


export const Route = createFileRoute('/_private/dashboard/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <LoggedInUserInfo />
}
