import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_public/terms-conditons')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_public/terms-conditons"!</div>
}
