import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-50">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold text-blue-600 mb-4">
          RunnerCoach MVP
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          The simple way to manage training plans and track athlete progress.
        </p>

        <div className="flex gap-4">
          <Link
            href="/login"
            className="px-8 py-3 bg-blue-600 text-white rounded-md font-bold hover:bg-blue-700 transition-colors"
          >
            Get Started
          </Link>
          <Link
            href="/signup"
            className="px-8 py-3 border border-blue-600 text-blue-600 rounded-md font-bold hover:bg-blue-50 transition-colors"
          >
            Sign Up
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 text-left max-w-4xl">
          <div className="p-6 bg-white rounded-lg shadow-sm border">
            <h3 className="text-lg font-bold mb-2">For Coaches</h3>
            <ul className="list-disc list-inside text-gray-600">
              <li>Manage multiple athletes</li>
              <li>Assign weekly training plans</li>
              <li>Monitor workout completion status</li>
              <li>Review athlete RPE and notes</li>
            </ul>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-sm border">
            <h3 className="text-lg font-bold mb-2">For Athletes</h3>
            <ul className="list-disc list-inside text-gray-600">
              <li>View your weekly training plan</li>
              <li>Mark workouts as completed</li>
              <li>Record RPE and feedback</li>
              <li>Stay on track with your goals</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}
