import { useState, useEffect } from "react";
import { api } from "../utils/api";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ProfileCard from "../components/cards/ProfileCard";
import { setPageTitle, resetPageTitle } from "../utils/pageTitle";

export default function Discover() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchSkill, setSearchSkill] = useState("");
  const [totalUsers, setTotalUsers] = useState(0);
  const [skillType, setSkillType] = useState("all"); // all | offered | wanted

  useEffect(() => {
    setPageTitle("Discover");
    return () => resetPageTitle();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const fetchUsers = async (overrides = {}) => {
    const { page: overridePage, skill: overrideSkill, type: overrideType } =
      overrides;

    const effectivePage = overridePage ?? page;
    const effectiveSkill = overrideSkill ?? searchSkill;
    const effectiveType = overrideType ?? skillType;

    setLoading(true);
    try {
      const response = await api.discoverProfiles({
        page: effectivePage,
        limit: 12,
        skill: effectiveSkill,
        type: effectiveType,
      });

      if (response.success) {
        setUsers(response.data || []);
        setTotalPages(response.pages || 1);
        setTotalUsers(response.total || 0);
      }
    } catch (err) {
      setError(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsers({ page: 1, skill: searchSkill, type: skillType });
  };

  const handleClearFilters = () => {
    setSearchSkill("");
    setSkillType("all");
    fetchUsers({ page, skill: "", type: "all" });
  };

  if (loading && page === 1) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Discover Skilled People
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Find experts and learners ready to exchange skills
          </p>
          {totalUsers > 0 && (
            <p className="text-sm text-gray-500">
              {totalUsers} people available to connect with
            </p>
          )}
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-12 max-w-3xl mx-auto">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <svg
                className="absolute left-4 top-3.5 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                value={searchSkill}
                onChange={(e) => setSearchSkill(e.target.value)}
                placeholder="Search by skill (Data Science, React, etc.)"
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              />
            </div>
            <div className="flex items-center md:w-56">
              <select
                value={skillType}
                onChange={(e) => setSkillType(e.target.value)}
                className="w-full border border-gray-300 rounded-lg py-3 px-3 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="all">Offers & Wants</option>
                <option value="offered">Offers only</option>
                <option value="wanted">Wants only</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-gradient-to-r from-teal-600 to-teal-500 text-white px-6 py-3 rounded-lg hover:shadow-lg font-semibold transition-all duration-200"
              >
                Search
              </button>
              <button
                type="button"
                onClick={handleClearFilters}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 font-semibold transition-all duration-200"
              >
                Clear
              </button>
            </div>
          </div>
        </form>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-8 max-w-2xl mx-auto flex items-start gap-3">
            <svg
              className="w-5 h-5 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Users Grid */}
        {users.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {users.map((user) => (
                <ProfileCard key={user._id} user={user} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-6 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  ← Previous
                </button>
                <div className="flex items-center gap-2">
                  <span className="text-gray-700 font-medium">
                    Page {page} of {totalPages}
                  </span>
                </div>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-6 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <svg
              className="mx-auto h-16 w-16 text-gray-300 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
            <p className="text-gray-600 text-lg font-medium mb-2">
              No users found
            </p>
            <p className="text-gray-500">
              Try searching with different skills or keywords
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
