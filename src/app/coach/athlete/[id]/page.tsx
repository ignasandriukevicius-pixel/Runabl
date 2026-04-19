import { createClient } from '@/utils/supabase/server'
import { planWorkout } from '../../actions'
import Link from 'next/link'
import { getWorkoutStatus } from '@/utils/workout-logic'

export default async function AthleteDetails({ params }: { params: { id: string } }) {
  const { id: athleteId } = await params
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', athleteId)
    .single()

  const { data: workoutsPlanned } = await supabase
    .from('workouts_planned')
    .select('*')
    .eq('athlete_id', athleteId)
    .order('date', { ascending: false })

  const { data: workoutsCompleted } = await supabase
    .from('workouts_completed')
    .select('*')
    .eq('athlete_id', athleteId)

  return (
    <div className="p-8">
      <Link href="/coach" className="text-blue-500 hover:underline mb-4 inline-block">
        &larr; Back to Dashboard
      </Link>
      
      <h1 className="text-3xl font-bold mb-8">
        Athlete: {profile?.full_name || profile?.email}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <section>
          <h2 className="text-xl font-semibold mb-4">Plan New Workout</h2>
          <form action={planWorkout} className="space-y-4 max-w-sm">
            <input type="hidden" name="athleteId" value={athleteId} />
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input
                type="date"
                name="date"
                required
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select
                name="workoutType"
                required
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="easy">Easy</option>
                <option value="intervals">Intervals</option>
                <option value="long run">Long Run</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                name="description"
                rows={3}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Workout details..."
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
            >
              Plan Workout
            </button>
          </form>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Training History</h2>
          <div className="space-y-4">
            {workoutsPlanned?.map((p) => {
              const completed = workoutsCompleted?.find((c) => c.date === p.date)
              const status = getWorkoutStatus(p.date, !!completed)
              
              const statusStyles = {
                completed: 'bg-green-100 text-green-800',
                planned: 'bg-blue-100 text-blue-800',
                missed: 'bg-red-100 text-red-800',
              }

              return (
                <div key={p.id} className="p-4 border rounded-md">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-bold">{p.date}</p>
                      <p className="capitalize text-blue-600 font-medium">{p.workout_type}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${statusStyles[status]}`}>
                      {status}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">{p.description}</p>
                  {completed && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-400 font-semibold uppercase">Athlete Report</p>
                      <p className="text-sm">RPE: <span className="font-bold">{completed.rpe}/10</span></p>
                      <p className="text-sm italic">"{completed.notes}"</p>
                    </div>
                  )}
                </div>
              )
            })}
            {workoutsPlanned?.length === 0 && (
              <p className="text-gray-500 italic text-center py-8">No workouts planned yet.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
