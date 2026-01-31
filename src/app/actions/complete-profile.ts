'use server'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function completeProfile(formData: FormData) {
    const supabase = await createClient()

    // 1. Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
        return { error: 'User not authenticated' }
    }

    // 2. Extract data
    const username = formData.get('username') as string
    const fullName = formData.get('fullName') as string

    // 3. Simple Validation
    if (!username || username.length < 3) {
        return { error: 'Username must be at least 3 characters long' }
    }

    // 4. Update Database
    const { error: updateError } = await supabase
        .from('profiles')
        .update({
            username: username,
            full_name: fullName,
            updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

    if (updateError) {
        if (updateError.code === '23505') {
            return { error: 'Username is already taken.' }
        }
        return { error: 'Failed to update profile.' }
    }

    // 5. Success
    redirect('/dashboard')
}
