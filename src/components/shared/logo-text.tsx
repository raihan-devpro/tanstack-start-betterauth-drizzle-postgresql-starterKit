import { Link } from '@tanstack/react-router'
import { APP_NAME } from '@/lib/constants'
import { cn } from '@/lib/utils'

export default function LogoTextComponent({
  className,
  to,
  replacee,
}: {
  className?: string
  to?: string
  replacee?: boolean
}) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <img
        src="https://tanstack.com/.netlify/images?url=%2Fimages%2Flogos%2Fsplash-dark.png&w=85&q=85"
        className="size-8"
        alt="App Logo"
      />
      <Link
        to={to ?? '/'}
        replace={replacee ?? true}
        className="text-xl font-semibold "
      >
        {APP_NAME}
      </Link>
    </div>
  )
}
