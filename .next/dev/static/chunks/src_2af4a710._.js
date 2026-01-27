(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/services/crypto.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/services/crypto.ts
// Helper to detect if we are in a browser or node-like environment
__turbopack_context__.s([
    "decrypt",
    ()=>decrypt,
    "deriveSharedSecret",
    ()=>deriveSharedSecret,
    "encrypt",
    ()=>encrypt,
    "generateKeyPair",
    ()=>generateKeyPair
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/compiled/buffer/index.js [app-client] (ecmascript)");
// Helper to convert ArrayBuffer to Base64
function toBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for(let i = 0; i < len; i++){
        binary += String.fromCharCode(bytes[i]);
    }
    // Safe check for btoa (Browser) vs Buffer (Node)
    if (typeof btoa === 'function') {
        return btoa(binary);
    } else if (typeof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"] !== 'undefined') {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(binary, 'binary').toString('base64');
    }
    return ''; // Fallback
}
// Helper to convert Base64 to ArrayBuffer
function fromBase64(base64) {
    if (typeof atob === 'function') {
        const binaryString = atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for(let i = 0; i < len; i++){
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
    } else if (typeof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"] !== 'undefined') {
        const buf = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(base64, 'base64');
        return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
    }
    return new ArrayBuffer(0);
}
// Check environment
const isWeb = ("TURBOPACK compile-time value", "object") !== 'undefined' && window.crypto && window.crypto.subtle;
async function generateKeyPair() {
    if (isWeb) {
        const keyPair = await window.crypto.subtle.generateKey({
            name: 'ECDH',
            namedCurve: 'P-256'
        }, true, [
            'deriveKey',
            'deriveBits'
        ]);
        const publicKeyBuffer = await window.crypto.subtle.exportKey('raw', keyPair.publicKey);
        const privateKeyBuffer = await window.crypto.subtle.exportKey('pkcs8', keyPair.privateKey);
        return {
            publicKey: toBase64(publicKeyBuffer),
            privateKey: toBase64(privateKeyBuffer)
        };
    } else {
        throw new Error("React Native / Node implementation requires 'react-native-quick-crypto' setup.");
    }
}
async function deriveSharedSecret(localPrivateKeyBase64, remotePublicKeyBase64) {
    if (!isWeb) throw new Error("Not implemented for non-web yet");
    const localPrivateKey = await window.crypto.subtle.importKey('pkcs8', fromBase64(localPrivateKeyBase64), {
        name: 'ECDH',
        namedCurve: 'P-256'
    }, false, [
        'deriveBits'
    ] // We only need deriveBits to get the raw secret
    );
    const remotePublicKey = await window.crypto.subtle.importKey('raw', fromBase64(remotePublicKeyBase64), {
        name: 'ECDH',
        namedCurve: 'P-256'
    }, false, []);
    // Derive a shared secret buffer
    const sharedBits = await window.crypto.subtle.deriveBits({
        name: 'ECDH',
        public: remotePublicKey
    }, localPrivateKey, 256 // 256 bits for AES-256
    );
    // Return raw bits as Base64
    return toBase64(sharedBits);
}
async function encrypt(message, sharedSecretBase64) {
    if (!isWeb) throw new Error("Not implemented for non-web yet");
    const secretKey = await window.crypto.subtle.importKey('raw', fromBase64(sharedSecretBase64), {
        name: 'AES-GCM'
    }, false, [
        'encrypt'
    ]);
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const ciphertextBuffer = await window.crypto.subtle.encrypt({
        name: 'AES-GCM',
        iv: iv
    }, secretKey, data);
    // Concatenate IV + Ciphertext
    const ciphertext = new Uint8Array(ciphertextBuffer);
    const combined = new Uint8Array(iv.length + ciphertext.length);
    combined.set(iv);
    combined.set(ciphertext, iv.length);
    return toBase64(combined.buffer);
}
async function decrypt(encryptedMessageBase64, sharedSecretBase64) {
    if (!isWeb) throw new Error("Not implemented for non-web yet");
    const secretKey = await window.crypto.subtle.importKey('raw', fromBase64(sharedSecretBase64), {
        name: 'AES-GCM'
    }, false, [
        'decrypt'
    ]);
    const combined = new Uint8Array(fromBase64(encryptedMessageBase64));
    // Extract IV (first 12 bytes)
    const iv = combined.slice(0, 12);
    const ciphertext = combined.slice(12);
    const decryptedBuffer = await window.crypto.subtle.decrypt({
        name: 'AES-GCM',
        iv: iv
    }, secretKey, ciphertext);
    const decoder = new TextDecoder();
    return decoder.decode(decryptedBuffer);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/utils/supabase.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "supabase",
    ()=>supabase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [app-client] (ecmascript) <locals>");
;
const supabaseUrl = ("TURBOPACK compile-time value", "https://ltnasudddtanriqdgcpw.supabase.co");
const supabaseKey = ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0bmFzdWRkZHRhbnJpcWRnY3B3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwNDIyNDAsImV4cCI6MjA4NDYxODI0MH0.-NSOwsdfR9EJ3ykYWEsumAJaTalS33n4oiofTVyjgk8");
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseKey);
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/services/signaling.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SignalingService",
    ()=>SignalingService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/supabase.ts [app-client] (ecmascript)");
;
class SignalingService {
    channel = null;
    sessionId;
    constructor(sessionId){
        this.sessionId = sessionId;
    }
    /**
     * Subscribes to the signaling channel for the session.
     * @param onMessage Callback for receiving messages
     */ subscribe(onMessage) {
        if (this.channel) return;
        this.channel = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].channel(`room:${this.sessionId}`);
        this.channel.on('broadcast', {
            event: 'signal'
        }, (payload)=>{
            // Verify payload structure if needed
            if (payload.payload && payload.payload.type) {
                onMessage(payload.payload);
            }
        }).subscribe((status)=>{
            if (status === 'SUBSCRIBED') {
                console.log(`Subscribed to signaling channel: room:${this.sessionId}`);
            }
        });
    }
    /**
     * Sends a signal to the peer.
     * @param type The type of signal
     * @param payload Data to send
     */ async sendSignal(type, payload = {}) {
        if (!this.channel) {
            console.error('Cannot send signal: Channel not initialized');
            return;
        }
        await this.channel.send({
            type: 'broadcast',
            event: 'signal',
            payload: {
                type,
                payload
            }
        });
    }
    /**
     * Clean up encryption channel
     */ unsubscribe() {
        if (this.channel) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].removeChannel(this.channel);
            this.channel = null;
        }
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/stores/sessionStore.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useSessionStore",
    ()=>useSessionStore
]);
// src/stores/sessionStore.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/index.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$crypto$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/crypto.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$signaling$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/signaling.ts [app-client] (ecmascript)");
;
;
;
const useSessionStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["create"])((set, get)=>({
        sessionId: null,
        status: 'idle',
        keys: null,
        peerPublicKey: null,
        sharedSecret: null,
        signaling: null,
        financialData: null,
        initSession: async ()=>{
            try {
                get().resetSession();
                set({
                    status: 'generating'
                });
                // 1. Generate UUID for the session
                const sessionId = crypto.randomUUID();
                // 2. Generate Ephemeral Keys
                const keys = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$crypto$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["generateKeyPair"])();
                // 3. Initialize Signaling
                const signaling = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$signaling$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SignalingService"](sessionId);
                // 4. Subscribe to signals
                signaling.subscribe((msg)=>{
                    const state = get();
                    // Allow processing signals even if connected (like SYNC_DATA)
                    switch(msg.type){
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
                        case 'SYNC_DATA':
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
                });
                await signaling.sendSignal('HANDSHAKE_REQUEST', {
                    publicKey: keys.publicKey
                });
                console.log("Session Initialized:", sessionId);
            } catch (e) {
                console.error("Session Init Error:", e);
                set({
                    status: 'error'
                });
            }
        },
        setPeerKey: async (peerKeyBase64)=>{
            const { keys } = get();
            if (!keys) {
                console.error("Cannot set peer key: No local keys generated.");
                set({
                    status: 'error'
                });
                return;
            }
            try {
                console.log("Setting Peer Key...", peerKeyBase64.substring(0, 10) + "...");
                set({
                    peerPublicKey: peerKeyBase64
                });
                // Derive Shared Secret immediately
                const secret = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$crypto$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deriveSharedSecret"])(keys.privateKey, peerKeyBase64);
                set({
                    sharedSecret: secret,
                    status: 'connected'
                });
                console.log("Shared Secret Derived. Connection Established.");
            } catch (e) {
                console.error("Key Agreement Error:", e);
                set({
                    status: 'error'
                });
            }
        },
        processIncomingData: async (encryptedPayload)=>{
            const { sharedSecret } = get();
            if (!sharedSecret) {
                console.error("Cannot decrypt data: No shared secret established.");
                return;
            }
            try {
                console.log("Decrypting incoming data...");
                const jsonString = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$crypto$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["decrypt"])(encryptedPayload, sharedSecret);
                const data = JSON.parse(jsonString);
                set({
                    financialData: data
                });
                console.log("Financial Data Decrypted & Synced!", data);
            } catch (e) {
                console.error("Decryption Error:", e);
            // Optionally set an error state here
            }
        },
        resetSession: ()=>{
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
    }));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ConnectQR.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ConnectQR",
    ()=>ConnectQR
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
// src/components/ConnectQR.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$sessionStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/sessionStore.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
// import QRCode from 'react-qr-code'; // Assuming user will install this: npm install react-qr-code
// Temporary stub for the QR library if it's missing types or the lib itself
// In a real scenario, we'd ensure the lib is in package.json
// For now, I'll assume standard usage.
let QRCode;
try {
    QRCode = __turbopack_context__.r("[project]/node_modules/react-qr-code/lib/index.js [app-client] (ecmascript)");
    // Handle default export if needed
    if (QRCode.default) QRCode = QRCode.default;
} catch (e) {
    QRCode = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-4 border border-red-500",
            children: "Error: react-qr-code not found"
        }, void 0, false, {
            fileName: "[project]/src/components/ConnectQR.tsx",
            lineNumber: 17,
            columnNumber: 20
        }, ("TURBOPACK compile-time value", void 0));
}
const ConnectQR = ()=>{
    _s();
    const { sessionId, keys, status, initSession, sharedSecret } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$sessionStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSessionStore"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ConnectQR.useEffect": ()=>{
            // Start session generation on mount if not ready
            if (status === 'idle') {
                initSession();
            }
        }
    }["ConnectQR.useEffect"], [
        status,
        initSession
    ]);
    if (status === 'generating' || status === 'idle') {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col items-center justify-center p-8 space-y-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
                }, void 0, false, {
                    fileName: "[project]/src/components/ConnectQR.tsx",
                    lineNumber: 40,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-gray-500",
                    children: "Generating Secure Keys..."
                }, void 0, false, {
                    fileName: "[project]/src/components/ConnectQR.tsx",
                    lineNumber: 41,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/ConnectQR.tsx",
            lineNumber: 39,
            columnNumber: 13
        }, ("TURBOPACK compile-time value", void 0));
    }
    if (status === 'error') {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-red-500 p-4",
            children: "failed to initialize secure session. Please refresh."
        }, void 0, false, {
            fileName: "[project]/src/components/ConnectQR.tsx",
            lineNumber: 48,
            columnNumber: 13
        }, ("TURBOPACK compile-time value", void 0));
    }
    if (status === 'connected') {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col items-center justify-center p-8 space-y-4 bg-green-50 rounded-lg",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-4xl",
                    children: "🔒"
                }, void 0, false, {
                    fileName: "[project]/src/components/ConnectQR.tsx",
                    lineNumber: 57,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    className: "text-xl font-bold text-green-700",
                    children: "Secure Bridge Established"
                }, void 0, false, {
                    fileName: "[project]/src/components/ConnectQR.tsx",
                    lineNumber: 58,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-sm text-green-600",
                    children: "End-to-End Encrypted"
                }, void 0, false, {
                    fileName: "[project]/src/components/ConnectQR.tsx",
                    lineNumber: 59,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/ConnectQR.tsx",
            lineNumber: 56,
            columnNumber: 13
        }, ("TURBOPACK compile-time value", void 0));
    }
    // Status is 'ready' - Show QR
    // Payload: Minimal JSON to save QR density
    // s: sessionId, k: publicKey (Base64)
    const payload = JSON.stringify({
        s: sessionId,
        k: keys?.publicKey
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col items-center space-y-6 p-6 bg-white rounded-xl shadow-sm border border-gray-100",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center space-y-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-lg font-semibold text-gray-900",
                        children: "Scan to Connect"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ConnectQR.tsx",
                        lineNumber: 75,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-gray-500 max-w-xs mx-auto",
                        children: "Open the Fisc Mobile App and scan this code to establish a secure, ephemeral connection."
                    }, void 0, false, {
                        fileName: "[project]/src/components/ConnectQR.tsx",
                        lineNumber: 76,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ConnectQR.tsx",
                lineNumber: 74,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-4 bg-white rounded-lg shadow-inner border border-gray-200",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(QRCode, {
                    value: payload,
                    size: 256,
                    style: {
                        height: "auto",
                        maxWidth: "100%",
                        width: "100%"
                    },
                    viewBox: `0 0 256 256`
                }, void 0, false, {
                    fileName: "[project]/src/components/ConnectQR.tsx",
                    lineNumber: 83,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/ConnectQR.tsx",
                lineNumber: 81,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-xs font-mono text-gray-400",
                children: [
                    "Session: ",
                    sessionId?.slice(0, 8),
                    "..."
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ConnectQR.tsx",
                lineNumber: 91,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ConnectQR.tsx",
        lineNumber: 73,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
_s(ConnectQR, "GbPy+t07+4Ke2xhfKZdFeix8g1M=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$sessionStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSessionStore"]
    ];
});
_c = ConnectQR;
var _c;
__turbopack_context__.k.register(_c, "ConnectQR");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/Dashboard.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Dashboard",
    ()=>Dashboard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$sessionStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/sessionStore.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
const Dashboard = ()=>{
    _s();
    const { financialData } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$sessionStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSessionStore"])();
    if (!financialData) return null;
    const totalNetWorth = financialData.accounts.reduce((sum, acc)=>sum + acc.balance_current, 0);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full max-w-4xl mx-auto space-y-8 p-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "flex justify-between items-center pb-6 border-b border-gray-100",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-2xl font-bold text-gray-800",
                        children: "Your Digital Briefcase"
                    }, void 0, false, {
                        fileName: "[project]/src/components/Dashboard.tsx",
                        lineNumber: 15,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-xs text-gray-400",
                        children: [
                            "Synced: ",
                            new Date(financialData.timestamp).toLocaleTimeString()
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/Dashboard.tsx",
                        lineNumber: 16,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/Dashboard.tsx",
                lineNumber: 14,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-blue-100 text-sm font-medium uppercase tracking-wider mb-2",
                        children: "Total Net Worth"
                    }, void 0, false, {
                        fileName: "[project]/src/components/Dashboard.tsx",
                        lineNumber: 23,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-5xl font-bold",
                        children: [
                            "$",
                            totalNetWorth.toLocaleString('en-US', {
                                minimumFractionDigits: 2
                            })
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/Dashboard.tsx",
                        lineNumber: 24,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/Dashboard.tsx",
                lineNumber: 22,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 md:grid-cols-2 gap-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white rounded-xl shadow-sm border border-gray-100 p-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-lg font-semibold text-gray-800 mb-4",
                                children: "Accounts"
                            }, void 0, false, {
                                fileName: "[project]/src/components/Dashboard.tsx",
                                lineNumber: 32,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-3",
                                children: financialData.accounts.map((acc)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-between items-center py-2 border-b border-dashed border-gray-100 last:border-0",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "font-medium text-gray-700",
                                                        children: acc.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/Dashboard.tsx",
                                                        lineNumber: 37,
                                                        columnNumber: 37
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-gray-400 capitalize",
                                                        children: acc.type
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/Dashboard.tsx",
                                                        lineNumber: 38,
                                                        columnNumber: 37
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/Dashboard.tsx",
                                                lineNumber: 36,
                                                columnNumber: 33
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "font-semibold text-gray-900",
                                                children: [
                                                    "$",
                                                    acc.balance_current.toLocaleString()
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/Dashboard.tsx",
                                                lineNumber: 40,
                                                columnNumber: 33
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, acc.id, true, {
                                        fileName: "[project]/src/components/Dashboard.tsx",
                                        lineNumber: 35,
                                        columnNumber: 29
                                    }, ("TURBOPACK compile-time value", void 0)))
                            }, void 0, false, {
                                fileName: "[project]/src/components/Dashboard.tsx",
                                lineNumber: 33,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/Dashboard.tsx",
                        lineNumber: 31,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white rounded-xl shadow-sm border border-gray-100 p-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-lg font-semibold text-gray-800 mb-4",
                                children: "Recent Transactions"
                            }, void 0, false, {
                                fileName: "[project]/src/components/Dashboard.tsx",
                                lineNumber: 50,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-4",
                                children: financialData.transactions.slice(0, 5).map((tx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-between items-start",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "font-medium text-gray-700",
                                                        children: tx.payee
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/Dashboard.tsx",
                                                        lineNumber: 55,
                                                        columnNumber: 37
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-gray-400",
                                                        children: new Date(tx.date).toLocaleDateString()
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/Dashboard.tsx",
                                                        lineNumber: 56,
                                                        columnNumber: 37
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/Dashboard.tsx",
                                                lineNumber: 54,
                                                columnNumber: 33
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: `font-semibold ${tx.amount < 0 ? 'text-gray-900' : 'text-green-600'}`,
                                                children: [
                                                    tx.amount < 0 ? '-' : '+',
                                                    "$",
                                                    Math.abs(tx.amount).toFixed(2)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/Dashboard.tsx",
                                                lineNumber: 58,
                                                columnNumber: 33
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, tx.id, true, {
                                        fileName: "[project]/src/components/Dashboard.tsx",
                                        lineNumber: 53,
                                        columnNumber: 29
                                    }, ("TURBOPACK compile-time value", void 0)))
                            }, void 0, false, {
                                fileName: "[project]/src/components/Dashboard.tsx",
                                lineNumber: 51,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/Dashboard.tsx",
                        lineNumber: 49,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/Dashboard.tsx",
                lineNumber: 29,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/Dashboard.tsx",
        lineNumber: 13,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
_s(Dashboard, "VogmlOCnG5BLzT5adYH4FZ7IeRM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$sessionStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSessionStore"]
    ];
});
_c = Dashboard;
var _c;
__turbopack_context__.k.register(_c, "Dashboard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ConnectQR$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ConnectQR.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Dashboard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Dashboard.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$sessionStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/sessionStore.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
function Home() {
    _s();
    const { financialData, sessionId, keys } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$sessionStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSessionStore"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Home.useEffect": ()=>{
            if (sessionId && keys) {
                console.log("Session ID: " + sessionId);
                console.log("Public Key: " + keys.publicKey);
            }
        }
    }["Home.useEffect"], [
        sessionId,
        keys
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-10 text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600",
                        children: "Fisc Financial"
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 21,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-gray-400 text-sm mt-2",
                        children: "Secure Backend Bridge"
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 24,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 20,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full max-w-5xl",
                children: !financialData ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex justify-center",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ConnectQR$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ConnectQR"], {}, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 30,
                        columnNumber: 25
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 29,
                    columnNumber: 21
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Dashboard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Dashboard"], {}, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 33,
                    columnNumber: 21
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 27,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-12 text-center text-xs text-gray-300",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: "End-to-End Encrypted Session"
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 39,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: "No data is persisted on this server."
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 40,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 38,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/page.tsx",
        lineNumber: 18,
        columnNumber: 9
    }, this);
}
_s(Home, "3+jnDp1amDWRj5bSzM7cd8JjArA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$sessionStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSessionStore"]
    ];
});
_c = Home;
var _c;
__turbopack_context__.k.register(_c, "Home");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_2af4a710._.js.map