export default function Login(){
  return (
    <div className="max-w-md mx-auto p-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900">Login</h1>
        <p className="mt-2 text-gray-600">Sign in to your account (placeholder).</p>
        <form className="mt-4 space-y-3">
          <input className="w-full border border-gray-200 rounded-md px-3 py-2" placeholder="Email" />
          <input className="w-full border border-gray-200 rounded-md px-3 py-2" type="password" placeholder="Password" />
          <button className="w-full bg-primary-600 text-white px-3 py-2 rounded-md">Sign in</button>
        </form>
      </div>
    </div>
  )
}
