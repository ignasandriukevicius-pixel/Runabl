'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

// LOGIN
export async function login(formData: FormData) {
  console.log('LOGIN TRIGGERED')

  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    console.log('LOGIN ERROR: missing fields')
    return redirect('/login?error=Missing credentials')
  }

  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.log('LOGIN ERROR:', error.message)
    return redirect('/login?error=' + encodeURIComponent(error.message))
  }

  console.log('LOGIN SUCCESS:', data.user?.id)

  revalidatePath('/', 'layout')
  return redirect('/')
}

// SIGNUP
export async function signup(formData: FormData) {
  console.log('SIGNUP TRIGGERED')

  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    console.log('SIGNUP ERROR: missing fields')
    return redirect('/signup?error=Missing credentials')
  }

  const { error, data } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    console.log('SIGNUP ERROR:', error.message)
    return redirect('/signup?error=' + encodeURIComponent(error.message))
  }

  console.log('SIGNUP SUCCESS:', data.user?.id)

  revalidatePath('/', 'layout')
  return redirect('/login?success=' + encodeURIComponent('Account created. Please log in.'))
}

// LOGOUT
export async function logout() {
  console.log('LOGOUT TRIGGERED')

  const supabase = await createClient()
  await supabase.auth.signOut()

  revalidatePath('/', 'layout')
  return redirect('/login')
}
