'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [rememberMe, setRememberMe] = useState(true)
    const [loading, setLoading] = useState(false)
    const [view, setView] = useState<'sign-in' | 'sign-up'>('sign-in')
    const [message, setMessage] = useState<{ text: string; type: 'error' | 'success' } | null>(null)

    const router = useRouter()
    const supabase = createClient()

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage(null)

        try {
            if (view === 'sign-up') {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${location.origin}/auth/callback`,
                    },
                })
                if (error) {
                    console.error('FULL SIGNUP ERROR:', error)
                    throw error
                }
                setMessage({ text: 'Check your email for the confirmation link.', type: 'success' })
            } else {
                // Determine session expiry based on Remember Me
                // Note: Standard Supabase auth persists by default, but this logic can be extended via server configs
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })
                if (error) throw error
                router.refresh()
                router.push('/horizon')
            }
        } catch (error: any) {
            setMessage({ text: error.message, type: 'error' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F9F9F7] p-4 text-[#2D2D2D] font-sans">
            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-text-charcoal tracking-tight">Fisc Financial</h1>
                    <p className="text-gray-500 mt-2">Manage your horizon.</p>
                </div>

                <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#E0E0E0] w-full">
                    <h2 className="text-xl font-bold text-text-charcoal mb-6 text-center">
                        {view === 'sign-in' ? 'Welcome Back' : 'Create Account'}
                    </h2>

                    <form onSubmit={handleAuth} className="flex flex-col gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-charcoal mb-2">Email address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-2.5 bg-[#F9F9F7] rounded-xl border border-gray-200 focus:border-primary-green/50 focus:ring-2 focus:ring-primary-green/20 focus:outline-none transition-all"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-charcoal mb-2">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-2.5 bg-[#F9F9F7] rounded-xl border border-gray-200 focus:border-primary-green/50 focus:ring-2 focus:ring-primary-green/20 focus:outline-none transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        {view === 'sign-in' && (
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="h-4 w-4 text-[#4A5D4E] focus:ring-[#4A5D4E] border-gray-300 rounded cursor-pointer"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600 cursor-pointer">
                                    Remember me for 30 days
                                </label>
                            </div>
                        )}

                        {message && (
                            <div className={`text-sm p-3 rounded-lg ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                {message.text}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#4A5D4E] text-white py-2.5 rounded-xl hover:bg-[#3d4d40] disabled:opacity-50 disabled:cursor-not-allowed mt-2 font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            {loading && (
                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            )}
                            {loading ? 'Signing in...' : (view === 'sign-in' ? 'Sign In' : 'Sign Up')}
                        </button>

                        <div className="text-center mt-4 border-t border-gray-100 pt-4">
                            <button
                                type="button"
                                className="text-sm text-gray-500 hover:text-[#4A5D4E] transition-colors"
                                onClick={() => {
                                    setView(view === 'sign-in' ? 'sign-up' : 'sign-in')
                                    setMessage(null)
                                }}
                            >
                                {view === 'sign-in'
                                    ? "Don't have an account? Create one"
                                    : "Already have an account? Sign In"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
