'use client';

// src/components/ConnectQR.tsx
import React, { useEffect } from 'react';
import { useSessionStore } from '../stores/sessionStore';
// import QRCode from 'react-qr-code'; // Assuming user will install this: npm install react-qr-code

// Temporary stub for the QR library if it's missing types or the lib itself
// In a real scenario, we'd ensure the lib is in package.json
// For now, I'll assume standard usage.
let QRCode: any;
try {
    QRCode = require('react-qr-code');
    // Handle default export if needed
    if (QRCode.default) QRCode = QRCode.default;
} catch (e) {
    QRCode = () => <div className="p-4 border border-red-500">Error: react-qr-code not found</div>;
}


export const ConnectQR = () => {
    const {
        sessionId,
        keys,
        status,
        initSession,
        sharedSecret
    } = useSessionStore();

    useEffect(() => {
        // Start session generation on mount if not ready
        if (status === 'idle') {
            initSession();
        }
    }, [status, initSession]);

    if (status === 'generating' || status === 'idle') {
        return (
            <div className="flex flex-col items-center justify-center p-8 space-y-4">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-500">Generating Secure Keys...</p>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="text-red-500 p-4">
                failed to initialize secure session. Please refresh.
            </div>
        )
    }

    if (status === 'connected') {
        return (
            <div className="flex flex-col items-center justify-center p-8 space-y-4 bg-green-50 rounded-lg">
                <div className="text-4xl">🔒</div>
                <h2 className="text-xl font-bold text-green-700">Secure Bridge Established</h2>
                <p className="text-sm text-green-600">End-to-End Encrypted</p>
            </div>
        )
    }

    // Status is 'ready' - Show QR
    // Payload: Minimal JSON to save QR density
    // s: sessionId, k: publicKey (Base64)
    const payload = JSON.stringify({
        s: sessionId,
        k: keys?.publicKey
    });

    return (
        <div className="flex flex-col items-center space-y-6 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">Scan to Connect</h3>
                <p className="text-sm text-gray-500 max-w-xs mx-auto">
                    Open the Fisc Mobile App and scan this code to establish a secure, ephemeral connection.
                </p>
            </div>

            <div className="p-4 bg-white rounded-lg shadow-inner border border-gray-200">
                {/* @ts-ignore - Ignoring type checks for the external lib stub */}
                <QRCode
                    value={payload}
                    size={256}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    viewBox={`0 0 256 256`}
                />
            </div>

            <div className="text-xs font-mono text-gray-400">
                Session: {sessionId?.slice(0, 8)}...
            </div>
        </div>
    );
};
