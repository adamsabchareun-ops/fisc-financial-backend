// src/stores/sessionStore.ts
import { create } from 'zustand'
import { generateKeyPair, deriveSharedSecret, KeyPair, decrypt } from '../services/crypto'
import { SignalingService, SignalMessage } from '../services/signaling'
import { SyncPayload } from '../types/schema'

// STATUS: 'idle' | 'generating' | 'ready' (waiting for scan) | 'connected' (shared secret established) | 'error'
export type SessionStatus = 'idle' | 'generating' | 'ready' | 'connected' | 'error';

interface SessionState {
    sessionId: string | null;
    status: SessionStatus;

    // Local Ephemeral Keys (NEVER PERSIST)
    keys: KeyPair | null;

    // Remote Peer Identity
    peerPublicKey: string | null;

    // Derived Shared Secret (NEVER PERSIST)
    sharedSecret: string | null;

    // Signaling Service Instance
    signaling: SignalingService | null;

    // Decrypted Data
    financialData: SyncPayload | null;

    // Actions
    initSession: () => Promise<void>;
    setPeerKey: (peerKeyBase64: string) => Promise<void>;
    processIncomingData: (encryptedPayload: string) => Promise<void>;
    resetSession: () => void;
}

/**
 * Ephemeral Session Store
 * 
 * SECURITY WARNING:
 * This store contains high-sensitive ephemeral cryptographic keys.
 * It must NEVER be persisted to localStorage, IndexedDB, or any disk storage.
 * It should only exist in memory for the duration of the browser tab / app session.
 */
export const useSessionStore = create<SessionState>((set, get) => ({
    sessionId: null,
    status: 'idle',
    keys: null,
    peerPublicKey: null,
    sharedSecret: null,
    signaling: null,
    financialData: null,

    initSession: async () => {
        try {
            get().resetSession();

            set({ status: 'generating' });

            // 1. Generate UUID for the session
            const sessionId = crypto.randomUUID();

            // 2. Generate Ephemeral Keys
            const keys = await generateKeyPair();

            // 3. Initialize Signaling
            const signaling = new SignalingService(sessionId);

            // 4. Subscribe to signals
            signaling.subscribe((msg: SignalMessage) => {
                const state = get();

                // Allow processing signals even if connected (like SYNC_DATA)
                switch (msg.type) {
                    case 'HANDSHAKE_RESPONSE':
                        console.log("Received Handshake Response from Peer");
                        if (msg.payload && msg.payload.publicKey) {
                            state.setPeerKey(msg.payload.publicKey);
                        }
                        break;
                    case 'PING':
                        console.log("Received PING");
                        signaling.sendSignal('PONG', {});
                        break;
                    // NEW: Handle Data Sync
                    case 'SYNC_DATA': // Using generic 'SYNC_DATA' or checking type in payload
                        console.log("Received SYNC_DATA");
                        if (msg.payload && msg.payload.encryptedData) {
                            state.processIncomingData(msg.payload.encryptedData);
                        }
                        break;
                }
            });

            set({
                sessionId,
                keys,
                status: 'ready',
                signaling,
                error: null
            } as any);

            await signaling.sendSignal('HANDSHAKE_REQUEST', { publicKey: keys.publicKey });

            console.log("Session Initialized:", sessionId);

        } catch (e: any) {
            console.error("Session Init Error:", e);
            set({ status: 'error' });
        }
    },

    setPeerKey: async (peerKeyBase64: string) => {
        const { keys } = get();
        if (!keys) {
            console.error("Cannot set peer key: No local keys generated.");
            set({ status: 'error' });
            return;
        }

        try {
            console.log("Setting Peer Key...", peerKeyBase64.substring(0, 10) + "...");
            set({ peerPublicKey: peerKeyBase64 });

            // Derive Shared Secret immediately
            const secret = await deriveSharedSecret(keys.privateKey, peerKeyBase64);

            set({
                sharedSecret: secret,
                status: 'connected'
            });
            console.log("Shared Secret Derived. Connection Established.");

        } catch (e: any) {
            console.error("Key Agreement Error:", e);
            set({ status: 'error' });
        }
    },

    processIncomingData: async (encryptedPayload: string) => {
        const { sharedSecret } = get();
        if (!sharedSecret) {
            console.error("Cannot decrypt data: No shared secret established.");
            return;
        }

        try {
            console.log("Decrypting incoming data...");
            const jsonString = await decrypt(encryptedPayload, sharedSecret);
            const data = JSON.parse(jsonString) as SyncPayload;

            set({ financialData: data });
            console.log("Financial Data Decrypted & Synced!", data);
        } catch (e: any) {
            console.error("Decryption Error:", e);
            // Optionally set an error state here
        }
    },

    resetSession: () => {
        const { signaling } = get();
        if (signaling) {
            signaling.unsubscribe();
        }

        set({
            sessionId: null,
            status: 'idle',
            keys: null,
            peerPublicKey: null,
            sharedSecret: null,
            signaling: null,
            financialData: null
        });
    }
}))
