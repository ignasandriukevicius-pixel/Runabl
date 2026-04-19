import { login } from '@/app/auth/actions'

export const dynamic = 'force-dynamic'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>
}) {
  const params = await searchParams

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-4xl font-bold mb-8">Login</h1>

        <form className="w-full max-w-xs" action={login}>
          <div className="mb-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div className="mb-6">
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          {params?.error && (
            <p className="text-red-500 mb-4">{params.error}</p>
          )}

          {params?.success && (
            <p className="text-green-600 mb-4">{params.success}</p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
          >
            Log In
          </button>
        </form>

        <p className="mt-4">
          Don&apos;t have an account?{' '}
          <a href="/signup" className="text-blue-500 hover:underline">
            Sign up
          </a>
        </p>
      </main>
    </div>
  )
}
