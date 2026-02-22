import { atom, useAtom } from "jotai"
import { useQueryState } from 'nuqs'

const countAtom = atom(0)
export const useAppStore = () => {
  const [count, setCount] = useAtom(countAtom)
  const [queryParam, setQueryParam] = useQueryState('parentMessageId',{
    defaultValue:"",

  })
  return {
    count,
    setCount,
    queryParam,
    setQueryParam,
  }
}
