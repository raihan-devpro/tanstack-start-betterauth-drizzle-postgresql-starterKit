import { z } from 'zod'
import { defineWebSocketHandler } from 'nitro/h3'
import type { AdapterInternal, Peer } from 'crossws'

import type { ChannelEvents, WsEvent } from '@/websocket/ws-types'

const baseWsMessageSchema = z.object({
  type: z.string(),
  payload: z.unknown().optional(),
})

if (!(globalThis as any).__WS_PEERS__) {
  ;(globalThis as any).__WS_PEERS__ = new Set()
}

const peers: Set<any> = (globalThis as any).__WS_PEERS__

interface ExtendedPeer extends Peer<AdapterInternal> {
  subscribedChannels: Set<string>
}

export default defineWebSocketHandler({
  open(peer) {
    // Initialize subscription tracking per peer
    const p = peer as ExtendedPeer

    p.subscribedChannels = new Set<string>()
    p.subscribe = (channel: string) => p.subscribedChannels.add(channel)
    p.unsubscribe = (channel: string) => p.subscribedChannels.delete(channel)

    peers.add(p)

    console.log('[ws] open', peer.id)

    peer.send({
      type: 'welcome',
      payload: { message: 'Welcome to the WebSocket server' },
    })
  },

  message(peer, message) {
    try {
      const text = message.text()
      const raw = JSON.parse(text)
      console.log('[ws] message', raw)

      const validation = baseWsMessageSchema.safeParse(raw)
      if (!validation.success) {
        console.warn('[ws] invalid message dropped')
        return
      }

      if (raw.type === 'subscribe') {
        const channel = raw.payload?.channel
        if (typeof channel === 'string') {
          console.log('[ws] subscribe', peer.id, channel)
          peer.subscribe(channel)
        }
      }

      if (raw.type === 'unsubscribe') {
        const channel = raw.payload?.channel
        if (typeof channel === 'string') {
          console.log('[ws] unsubscribe', peer.id, channel)
          peer.unsubscribe(channel)
        }
      }
    } catch (err) {
      console.error('[ws] failed to parse message', err)
    }
  },

  close(peer) {
    peers.delete(peer)
    console.log('[ws] close', peer.id)
  },

  error(peer, error) {
    console.error('[ws] connection error', peer.id, error)
  },
})

// Broadcast to all peers subscribed to a channel
export function broadcastEvent(
  channel: keyof ChannelEvents,
  event: ChannelEvents[keyof ChannelEvents],
) {
  const _peers: Set<any> = (globalThis as any).__WS_PEERS__

  if (_peers.size === 0) {
    console.warn('[ws-broadcast] no peers to broadcast to')
    return
  }

  const payload = JSON.stringify(event)

  for (const peer of _peers) {
    if (peer.subscribedChannels?.has(channel)) {
      try {
        peer.send(payload) // <-- send directly
      } catch (err) {
        console.error('[ws-broadcast] failed to send to peer', peer.id, err)
      }
    }
  }

  if (event.type !== 'ping') {
    console.log(
      `[ws-broadcast] sent ${event.type} to ${_peers.size} peers on ${channel}`,
    )
  }
}
export function broadcastDynamicEvent(channel: string, event: WsEvent) {
  const _peers: Set<any> = (globalThis as any).__WS_PEERS__

  if (_peers.size === 0) {
    console.warn('[ws-broadcast] no peers to broadcast to')
    return
  }

  const payload = JSON.stringify(event)

  for (const peer of _peers) {
    if (peer.subscribedChannels?.has(channel)) {
      try {
        peer.send(payload) // <-- send directly
      } catch (err) {
        console.error('[ws-broadcast] failed to send to peer', peer.id, err)
      }
    }
  }

  if (event.type !== 'ping') {
    console.log(
      `[ws-broadcast] sent ${event.type} to ${_peers.size} peers on ${channel}`,
    )
  }
}
if (!(globalThis as any).__WS_INTERVAL__) {
  ;(globalThis as any).__WS_INTERVAL__ = setInterval(() => {
    broadcastEvent('system', {
      type: 'ping',
      payload: { time: Date.now() },
    })
  }, 10000)
}




  // ? note: WebSocket client code connection example

  // useEffect(() => {
  //   const ws = new WebSocket(getClientWebSocketUrl())
  //   wsRef.current = ws

  //   ws.onopen = () => {
  //     setWsStatus('connected')
  //     ws.send(
  //       JSON.stringify({ type: 'subscribe', payload: { channel: 'todos' } }),
  //     )
  //   }
  //   ws.onclose = () => setWsStatus('disconnected')
  //   ws.onerror = () => setWsStatus('disconnected')

  //   ws.onmessage = (event) => {
  //     try {
  //       const msg: ChannelEvents['todos'] = JSON.parse(event.data)

  //       setTodos((prev) => {
  //         switch (msg.type) {
  //           case 'todo:added':
  //             return [msg.payload as Todo, ...prev]
  //           case 'todo:update':
  //             return prev.map((t) =>
  //               t.id === msg.payload.id
  //                 ? { ...t, completed: msg.payload.completed }
  //                 : t,
  //             )
  //           case 'todo:deleted':
  //             return prev.filter((t) => t.id !== msg.payload.id)
  //           default:
  //             return prev
  //         }
  //       })
  //     } catch {
  //       // ignore
  //     }
  //   }

  //   return () => {
  //     if(ws.readyState === WebSocket.OPEN){
  //       ws.send(
  //       JSON.stringify({ type: 'unsubscribe', payload: { channel: 'todos' } }),
  //     )
  //     }
  //     ws.close()
  //   }
  // }, [])
