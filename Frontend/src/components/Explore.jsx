export default function Explore(){
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900">Explore</h1>
        <p className="mt-2 text-gray-600">Search for users and skills to connect with.</p>
        <div className="mt-4">
          <input className="w-full border border-gray-200 rounded-md px-3 py-2" placeholder="Search people or skills..." />
        </div>
      </div>
    </div>
  )
}
