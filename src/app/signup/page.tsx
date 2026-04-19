import { signup } from '@/app/auth/actions'

export const dynamic = 'force-dynamic'

type PageProps = {
  searchParams?: Promise<{
    error?: string
  }>
}

export default async function SignupPage({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {}

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-4xl font-bold mb-8">Sign Up</h1>

        <form className="w-full max-w-xs text-left" action={signup}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          {params.error && (
            <p className="text-red-500 mb-4">{params.error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-4">
          Already have an account?{' '}
          <a href="/login" className="text-blue-500 hover:underline">
            Log in
          </a>
        </p>
      </main>
    </div>
  )
}
