import { createFileRoute } from '@tanstack/react-router'
import { useAppContext } from '@/hooks/use-app-context'

export const Route = createFileRoute('/_private/dashboard/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { session, user } = useAppContext()

  return <div>Hello "/_private/dashboard/"!</div>
}
