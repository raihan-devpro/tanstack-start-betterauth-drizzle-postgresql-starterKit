export const getClientWebSocketUrl = () => {
  try {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    return `${protocol}//${window.location.host}/realtime`
  } catch (error) {
    console.error('Error getting client WebSocket URL:')
    return 'Loading...'
  }
}


export interface ChannelEvents {
  todos:
    | {
        type: 'todo:added'
        payload: {
          id: number
          title: string
          completed: boolean
          createdAt: Date | null
        }
      }
    | { type: 'todo:update'; payload: { id: number; completed: boolean } }
    | { type: 'todo:deleted'; payload: { id: number } }



  system: { type: 'ping'; payload: { time: number } } | { type: 'invalidate'; payload: { route: string } }
}

export type WsEvent<TType extends string = string, TPayload = any> = {
  type: TType
  payload: TPayload
}
