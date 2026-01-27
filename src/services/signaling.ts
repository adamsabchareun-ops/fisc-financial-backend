import { RealtimeChannel } from '@supabase/supabase-js'
import { supabase } from '../utils/supabase'

export type SignalType = 'HANDSHAKE_REQUEST' | 'HANDSHAKE_RESPONSE' | 'PING' | 'PONG' | 'SYNC_DATA'

export interface SignalMessage {
    type: SignalType
    payload: any
    senderId?: string
}

export class SignalingService {
    private channel: RealtimeChannel | null = null
    private sessionId: string

    constructor(sessionId: string) {
        this.sessionId = sessionId
    }

    /**
     * Subscribes to the signaling channel for the session.
     * @param onMessage Callback for receiving messages
     */
    public subscribe(onMessage: (msg: SignalMessage) => void) {
        if (this.channel) return

        this.channel = supabase.channel(`room:${this.sessionId}`)

        this.channel
            .on(
                'broadcast',
                { event: 'signal' },
                (payload) => {
                    // Verify payload structure if needed
                    if (payload.payload && payload.payload.type) {
                        onMessage(payload.payload as SignalMessage)
                    }
                }
            )
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    console.log(`Subscribed to signaling channel: room:${this.sessionId}`)
                }
            })
    }

    /**
     * Sends a signal to the peer.
     * @param type The type of signal
     * @param payload Data to send
     */
    public async sendSignal(type: SignalType, payload: any = {}) {
        if (!this.channel) {
            console.error('Cannot send signal: Channel not initialized')
            return
        }

        await this.channel.send({
            type: 'broadcast',
            event: 'signal',
            payload: { type, payload }
        })
    }

    /**
     * Clean up encryption channel
     */
    public unsubscribe() {
        if (this.channel) {
            supabase.removeChannel(this.channel)
            this.channel = null
        }
    }
}
