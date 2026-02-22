import { atom, useAtom } from "jotai"

const countAtom = atom(0)
export const useAppStore = () => {
  const [count, setCount] = useAtom(countAtom)
  return {
    count,
    setCount,
  }
}
