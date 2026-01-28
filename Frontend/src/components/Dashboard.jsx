export default function Dashboard(){
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900">Dashboard</h2>
          <p className="mt-2 text-gray-600">Overview of your activity and upcoming sessions.</p>
        </div>
        <aside className="bg-white shadow rounded-lg p-6">
          <h3 className="font-medium text-gray-800">Quick Actions</h3>
        </aside>
      </div>
    </div>
  )
}
