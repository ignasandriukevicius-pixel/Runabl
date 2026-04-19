'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function completeWorkout(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const date = formData.get('date') as string
  const rpe = parseInt(formData.get('rpe') as string)
  const notes = formData.get('notes') as string

  const { error } = await supabase
    .from('workouts_completed')
    .upsert({
      athlete_id: user.id,
      date,
      rpe,
      notes,
      completed_at: new Date().toISOString()
    }, {
      onConflict: 'athlete_id,date'
    })

  if (error) {
    throw new Error('Failed to complete workout: ' + error.message)
  }

  revalidatePath('/athlete')
}
