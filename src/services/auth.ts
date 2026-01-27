import { supabase } from '../utils/supabase'


/**
 * Signs up a new user and automatically creates their profile metadata.
 * @param email User's email address
 * @param password User's password (min 6 chars)
 * @param firstName User's first name (stored in metadata)
 * @param lastName User's last name (stored in metadata)
 */
export const signUpUser = async (email: string, password: string, firstName: string, lastName: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName
        }
      }
    })

    if (error) throw error
    return { data, error: null }
  } catch (error: any) {
    console.error('Signup Error:', error.message)
    return { data: null, error: error.message }
  }
}

/**
 * Logs in an existing user.
 * @param email User's email
 * @param password User's password
 */
export const loginUser = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error
    return { data, error: null }
  } catch (error: any) {
    console.error('Login Error:', error.message)
    return { data: null, error: error.message }
  }
}

/**
 * Sends a password reset email.
 * @param email The email address to send the reset link to
 */
export const resetPassword = async (email: string) => {
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'http://localhost:3000/auth/update-password', // Update for production
    })

    if (error) throw error
    return { data, error: null }
  } catch (error: any) {
    return { data: null, error: error.message }
  }
}

/**
 * Logs out the current user.
 */
export const logoutUser = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) console.error('Logout Error:', error.message)
}
