import { createClient } from '@/utils/supabase/server'
import { completeWorkout } from './actions'
import { logout } from '@/app/auth/actions'
import { getWorkoutStatus } from '@/utils/workout-logic'

export default async function AthleteDashboard() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: workoutsPlanned } = await supabase
    .from('workouts_planned')
    .select('*')
    .eq('athlete_id', user!.id)
    .order('date', { ascending: false })

  const { data: workoutsCompleted } = await supabase
    .from('workouts_completed')
    .select('*')
    .eq('athlete_id', user!.id)

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Athlete Dashboard</h1>
        <form action={logout}>
          <button className="text-red-500 hover:underline">Logout</button>
        </form>
      </div>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Weekly Training Plan</h2>
        <div className="grid gap-6">
          {workoutsPlanned?.map((p) => {
            const completed = workoutsCompleted?.find((c) => c.date === p.date)
            const status = getWorkoutStatus(p.date, !!completed)
            
            const statusStyles = {
              completed: 'bg-green-100 text-green-800',
              planned: 'bg-blue-100 text-blue-800',
              missed: 'bg-red-100 text-red-800',
            }

            return (
              <div key={p.id} className="p-6 border rounded-lg shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-500">{p.date}</p>
                    <h3 className="text-lg font-bold capitalize">{p.workout_type}</h3>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${statusStyles[status]}`}>
                    {status}
                  </span>
                </div>
                
                <p className="text-gray-700 mb-6">{p.description}</p>

                {!completed ? (
                  <form action={completeWorkout} className="bg-gray-50 p-4 rounded-md">
                    <input type="hidden" name="date" value={p.date} />
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1">
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">RPE (1-10)</label>
                        <input
                          type="number"
                          name="rpe"
                          min="1"
                          max="10"
                          required
                          className="w-full px-3 py-2 border rounded-md"
                          placeholder="How hard was it?"
                        />
                      </div>
                      <div className="flex-[2]">
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Notes</label>
                        <input
                          type="text"
                          name="notes"
                          className="w-full px-3 py-2 border rounded-md"
                          placeholder="Short note about the run..."
                        />
                      </div>
                      <div className="flex items-end">
                        <button
                          type="submit"
                          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 font-medium"
                        >
                          Mark Done
                        </button>
                      </div>
                    </div>
                  </form>
                ) : (
                  <div className="bg-green-50 p-4 rounded-md border border-green-100">
                    <p className="text-sm font-medium text-green-800">Your Report:</p>
                    <p className="text-sm text-green-700">RPE: {completed.rpe} | {completed.notes}</p>
                  </div>
                )}
              </div>
            )
          })}
          {workoutsPlanned?.length === 0 && (
            <p className="text-gray-500 text-center py-12 border border-dashed rounded-lg">
              No workouts assigned by your coach yet.
            </p>
          )}
        </div>
      </section>
    </div>
  )
}
