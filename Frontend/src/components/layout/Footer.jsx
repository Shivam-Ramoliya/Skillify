export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white mt-auto border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/Skillify.png"
                alt="Skillify"
                className="h-6 w-6 rounded"
              />
              <h3 className="text-xl font-bold">Skillify</h3>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Connect with experts, share your skills, and grow together in a
              supportive community.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold mb-4 text-white uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="/"
                  className="text-gray-400 hover:text-teal-400 transition-colors text-sm"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/discover"
                  className="text-gray-400 hover:text-teal-400 transition-colors text-sm"
                >
                  Discover
                </a>
              </li>
              <li>
                <a
                  href="/dashboard"
                  className="text-gray-400 hover:text-teal-400 transition-colors text-sm"
                >
                  Dashboard
                </a>
              </li>
              <li>
                <a
                  href="/profile"
                  className="text-gray-400 hover:text-teal-400 transition-colors text-sm"
                >
                  Profile
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              &copy; {currentYear} Skillify. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm">
              Made with <span className="text-red-500">♥</span> for learners
              everywhere
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
