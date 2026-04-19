'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addAthlete(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const athleteEmail = formData.get('email') as string

  // Find the athlete profile by email
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', athleteEmail)
    .eq('role', 'ATHLETE')
    .single()

  if (profileError || !profile) {
    throw new Error('Athlete not found with that email')
  }

  // Link athlete to coach
  const { error: linkError } = await supabase
    .from('athletes')
    .insert({
      coach_id: user.id,
      athlete_id: profile.id
    })

  if (linkError) {
    throw new Error('Failed to link athlete: ' + linkError.message)
  }

  revalidatePath('/coach')
}

export async function planWorkout(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const athleteId = formData.get('athleteId') as string
  const date = formData.get('date') as string
  const workoutType = formData.get('workoutType') as string
  const description = formData.get('description') as string

  const { error } = await supabase
    .from('workouts_planned')
    .insert({
      athlete_id: athleteId,
      coach_id: user.id,
      date,
      workout_type: workoutType,
      description
    })

  if (error) {
    throw new Error('Failed to plan workout: ' + error.message)
  }

  revalidatePath(`/coach/athlete/${athleteId}`)
}
