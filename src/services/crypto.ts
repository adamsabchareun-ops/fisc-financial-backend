
// src/services/crypto.ts

// Helper to detect if we are in a browser or node-like environment
declare const Buffer: any;

// Helper to convert ArrayBuffer to Base64
function toBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    // Safe check for btoa (Browser) vs Buffer (Node)
    if (typeof btoa === 'function') {
        return btoa(binary);
    } else if (typeof Buffer !== 'undefined') {
        return Buffer.from(binary, 'binary').toString('base64');
    }
    return ''; // Fallback
}

// Helper to convert Base64 to ArrayBuffer
function fromBase64(base64: string): ArrayBuffer {
    if (typeof atob === 'function') {
        const binaryString = atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
    } else if (typeof Buffer !== 'undefined') {
        const buf = Buffer.from(base64, 'base64');
        return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
    }
    return new ArrayBuffer(0);
}

export interface KeyPair {
    publicKey: string; // Base64
    privateKey: string; // Base64
}

// Check environment
const isWeb = typeof window !== 'undefined' && window.crypto && window.crypto.subtle;

/**
 * Generates an ephemeral X25519 key pair for ECDH.
 */
export async function generateKeyPair(): Promise<KeyPair> {
    if (isWeb) {
        const keyPair = await window.crypto.subtle.generateKey(
            {
                name: 'ECDH',
                namedCurve: 'P-256', // P-256 for standard web compatibility
            },
            true,
            ['deriveKey', 'deriveBits']
        );

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

/**
 * Derives a shared secret (AES-GCM key) from a local private key and a remote public key.
 */
export async function deriveSharedSecret(localPrivateKeyBase64: string, remotePublicKeyBase64: string): Promise<string> {
    if (!isWeb) throw new Error("Not implemented for non-web yet");

    const localPrivateKey = await window.crypto.subtle.importKey(
        'pkcs8',
        fromBase64(localPrivateKeyBase64),
        { name: 'ECDH', namedCurve: 'P-256' },
        false,
        ['deriveBits'] // We only need deriveBits to get the raw secret
    );

    const remotePublicKey = await window.crypto.subtle.importKey(
        'raw',
        fromBase64(remotePublicKeyBase64),
        { name: 'ECDH', namedCurve: 'P-256' },
        false,
        []
    );

    // Derive a shared secret buffer
    const sharedBits = await window.crypto.subtle.deriveBits(
        { name: 'ECDH', public: remotePublicKey },
        localPrivateKey,
        256 // 256 bits for AES-256
    );

    // Return raw bits as Base64
    return toBase64(sharedBits);
}

/**
 * Encrypts a message using AES-256-GCM and the shared secret.
 * Returns Base64 string of IV (12 bytes) + Ciphertext.
 */
export async function encrypt(message: string, sharedSecretBase64: string): Promise<string> {
    if (!isWeb) throw new Error("Not implemented for non-web yet");

    const secretKey = await window.crypto.subtle.importKey(
        'raw',
        fromBase64(sharedSecretBase64),
        { name: 'AES-GCM' },
        false,
        ['encrypt']
    );

    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encoder = new TextEncoder();
    const data = encoder.encode(message);

    const ciphertextBuffer = await window.crypto.subtle.encrypt(
        {
            name: 'AES-GCM',
            iv: iv
        },
        secretKey,
        data
    );

    // Concatenate IV + Ciphertext
    const ciphertext = new Uint8Array(ciphertextBuffer);
    const combined = new Uint8Array(iv.length + ciphertext.length);
    combined.set(iv);
    combined.set(ciphertext, iv.length);

    return toBase64(combined.buffer);
}

/**
 * Decrypts a message using AES-256-GCM.
 * Input is Base64 (IV + Ciphertext).
 */
export async function decrypt(encryptedMessageBase64: string, sharedSecretBase64: string): Promise<string> {
    if (!isWeb) throw new Error("Not implemented for non-web yet");

    const secretKey = await window.crypto.subtle.importKey(
        'raw',
        fromBase64(sharedSecretBase64),
        { name: 'AES-GCM' },
        false,
        ['decrypt']
    );

    const combined = new Uint8Array(fromBase64(encryptedMessageBase64));

    // Extract IV (first 12 bytes)
    const iv = combined.slice(0, 12);
    const ciphertext = combined.slice(12);

    const decryptedBuffer = await window.crypto.subtle.decrypt(
        {
            name: 'AES-GCM',
            iv: iv
        },
        secretKey,
        ciphertext
    );

    const decoder = new TextDecoder();
    return decoder.decode(decryptedBuffer);
}
