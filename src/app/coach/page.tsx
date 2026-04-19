import { createClient } from '@/utils/supabase/server'
import { addAthlete } from './actions'
import { logout } from '@/app/auth/actions'
import Link from 'next/link'

export default async function CoachDashboard() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: athletes } = await supabase
    .from('athletes')
    .select(`
      athlete_id,
      profiles!athlete_id (
        email,
        full_name
      )
    `)

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Coach Dashboard</h1>
        <form action={logout}>
          <button className="text-red-500 hover:underline">Logout</button>
        </form>
      </div>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Add Athlete</h2>
        <form action={addAthlete} className="flex gap-4 max-w-md">
          <input
            type="email"
            name="email"
            placeholder="Athlete Email"
            required
            className="flex-1 px-3 py-2 border rounded-md"
          />
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          >
            Add
          </button>
        </form>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Your Athletes</h2>
        <div className="grid gap-4">
          {athletes?.map((a: any) => (
            <Link
              key={a.athlete_id}
              href={`/coach/athlete/${a.athlete_id}`}
              className="p-4 border rounded-md hover:bg-gray-50 flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{a.profiles?.full_name || 'No Name'}</p>
                <p className="text-sm text-gray-500">{a.profiles?.email}</p>
              </div>
              <span className="text-blue-500">View Training &rarr;</span>
            </Link>
          ))}
          {athletes?.length === 0 && (
            <p className="text-gray-500 text-center py-8 border border-dashed rounded-md">
              No athletes added yet.
            </p>
          )}
        </div>
      </section>
    </div>
  )
}
