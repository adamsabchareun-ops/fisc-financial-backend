'use client';
import React, { useEffect } from 'react';
import { ConnectQR } from '../components/ConnectQR';
import { Dashboard } from '../components/Dashboard';
import { useSessionStore } from '../stores/sessionStore';

export default function Home() {
    const { financialData, sessionId, keys } = useSessionStore();

    useEffect(() => {
        if (sessionId && keys) {
            console.log("Session ID: " + sessionId);
            console.log("Public Key: " + keys.publicKey);
        }
    }, [sessionId, keys]);

    return (
        <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            {/* Header / Brand */}
            <div className="mb-10 text-center">
                <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                    Fisc Financial
                </h1>
                <p className="text-gray-400 text-sm mt-2">Secure Backend Bridge</p>
            </div>

            <div className="w-full max-w-5xl">
                {!financialData ? (
                    <div className="flex justify-center">
                        <ConnectQR />
                    </div>
                ) : (
                    <Dashboard />
                )}
            </div>

            {/* Footer */}
            <div className="mt-12 text-center text-xs text-gray-300">
                <p>End-to-End Encrypted Session</p>
                <p>No data is persisted on this server.</p>
            </div>
        </main>
    );
}
