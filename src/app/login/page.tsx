'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
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
                if (error) throw error
                setMessage({ text: 'Check your email for the confirmation link.', type: 'success' })
            } else {
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

                <Card title={view === 'sign-in' ? 'Welcome Back' : 'Create Account'} className="w-full">
                    <form onSubmit={handleAuth} className="flex flex-col gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-charcoal mb-1">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-2 bg-[#F9F9F7] rounded-xl border-none focus:ring-2 focus:ring-primary-green/20 focus:outline-none"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-charcoal mb-1">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-2 bg-[#F9F9F7] rounded-xl border-none focus:ring-2 focus:ring-primary-green/20 focus:outline-none"
                                placeholder="••••••••"
                            />
                        </div>

                        {message && (
                            <div className={`text-sm p-3 rounded-lg ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                {message.text}
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#4A5D4E] text-white rounded-xl hover:bg-[#3d4d40] disabled:opacity-50 mt-2"
                        >
                            {loading ? 'Processing...' : (view === 'sign-in' ? 'Sign In' : 'Sign Up')}
                        </Button>

                        <div className="text-center mt-4">
                            <button
                                type="button"
                                className="text-sm text-gray-500 hover:text-text-charcoal underline"
                                onClick={() => {
                                    setView(view === 'sign-in' ? 'sign-up' : 'sign-in')
                                    setMessage(null)
                                }}
                            >
                                {view === 'sign-in' ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                            </button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    )
}
