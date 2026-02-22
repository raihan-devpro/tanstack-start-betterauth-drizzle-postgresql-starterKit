import { Route } from '@/routes/__root'

export function useAppContext() {

  const routeContext=Route.useRouteContext()

  return {
    ...routeContext
  }
}
