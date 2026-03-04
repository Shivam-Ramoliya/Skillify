import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { setPageTitle, resetPageTitle } from "../utils/pageTitle";

export default function Home() {
  const { user } = useAuth();

  useEffect(() => {
    setPageTitle("Home");
    return () => resetPageTitle();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Hero Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 pt-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Learn & Share{" "}
                <span className="text-transparent bg-gradient-to-r from-teal-500 to-teal-600 bg-clip-text">
                  Skills
                </span>{" "}
                With Others
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl leading-relaxed">
                Connect with experts, mentors, and learners. Exchange knowledge,
                build meaningful relationships, and accelerate your growth in a
                supportive community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {!user ? (
                  <>
                    <Link
                      to="/signup"
                      className="bg-gradient-to-r from-teal-600 to-teal-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-lg transition-all duration-200 text-center"
                    >
                      Get Started Free
                    </Link>
                    <Link
                      to="/login"
                      className="bg-white text-teal-600 border-2 border-teal-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-teal-50 transition-all duration-200 text-center"
                    >
                      Sign In
                    </Link>
                  </>
                ) : (
                  <Link
                    to="/discover"
                    className="bg-gradient-to-r from-teal-600 to-teal-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-lg transition-all duration-200 text-center"
                  >
                    Explore Community
                  </Link>
                )}
              </div>
            </div>
            <div className="hidden md:block">
              <div className="bg-gradient-to-br from-teal-100 to-cyan-100 rounded-2xl p-8 shadow-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4 shadow-sm text-center">
                    <div className="text-3xl font-bold text-teal-600">4</div>
                    <p className="text-gray-600 text-sm mt-1">Core Modules</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm text-center">
                    <div className="text-3xl font-bold text-teal-600">10+</div>
                    <p className="text-gray-600 text-sm mt-1">Screens Built</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm text-center">
                    <div className="text-3xl font-bold text-teal-600">Auth</div>
                    <p className="text-gray-600 text-sm mt-1">
                      JWT + Email Flow
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm text-center">
                    <div className="text-3xl font-bold text-teal-600">MERN</div>
                    <p className="text-gray-600 text-sm mt-1">Tech Stack</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose Skillify?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to learn, teach, and grow in one platform.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "👥",
                title: "Connect with Experts",
                description:
                  "Find skilled professionals and mentors who can guide your learning journey.",
              },
              {
                icon: "🎓",
                title: "Share Your Expertise",
                description:
                  "Teach others what you know and build your professional network.",
              },
              {
                icon: "🚀",
                title: "Grow Together",
                description:
                  "Collaborate with our community and achieve your goals faster.",
              },
              {
                icon: "🎯",
                title: "Personalized Profiles",
                description:
                  "Showcase your skills with a complete profile including resume and photos.",
              },
              {
                icon: "🔍",
                title: "Smart Discovery",
                description:
                  "Find exactly what you're looking for with our intelligent search.",
              },
              {
                icon: "🌟",
                title: "Safe & Verified",
                description:
                  "All users are verified for a secure and trustworthy experience.",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-8 border border-slate-200 hover:border-teal-400 hover:shadow-lg transition-all duration-200"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Get started in 4 simple steps
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: 1,
                title: "Sign Up",
                desc: "Create your account in seconds",
              },
              {
                step: 2,
                title: "Build Profile",
                desc: "Add your skills and availability",
              },
              {
                step: 3,
                title: "Discover",
                desc: "Find people with skills you want to learn",
              },
              {
                step: 4,
                title: "Connect",
                desc: "Start learning and teaching",
              },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-lg mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-center text-sm">
                    {item.desc}
                  </p>
                </div>
                {item.step < 4 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-teal-300 to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-teal-600 via-teal-500 to-cyan-500">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Ready to Transform Your Learning?
          </h2>
          <p className="text-xl text-teal-50 mb-8 leading-relaxed max-w-2xl mx-auto">
            Join a vibrant community of learners and experts. Exchange skills,
            build connections, and grow together—all for free.
          </p>
          {!user && (
            <Link
              to="/signup"
              className="bg-white text-teal-600 px-10 py-4 rounded-lg text-lg font-semibold hover:shadow-xl transition-all duration-200 inline-block"
            >
              Start Learning Today →
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
