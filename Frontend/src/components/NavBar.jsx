import { Link } from 'react-router-dom'

export default function NavBar(){
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="text-lg font-semibold text-gray-800">Skillify</Link>
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</Link>
              <Link to="/explore" className="text-gray-600 hover:text-gray-900">Explore</Link>
              <Link to="/messages" className="text-gray-600 hover:text-gray-900">Messages</Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center space-x-3">
              <Link to="/sessions" className="text-gray-600 hover:text-gray-900">Sessions</Link>
              <Link to="/profile" className="text-gray-600 hover:text-gray-900">Profile</Link>
            </div>
            <Link to="/login" className="px-3 py-1.5 rounded-md bg-primary-600 text-white hover:bg-primary-700">Login</Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
