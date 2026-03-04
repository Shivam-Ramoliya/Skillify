import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../utils/api";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { setPageTitle, resetPageTitle } from "../utils/pageTitle";

export default function Connections() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [stats, setStats] = useState({
    activeConnections: 0,
    sentRequests: 0,
    receivedRequests: 0,
  });
  const [activeConnections, setActiveConnections] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentDisconnectRequests, setSentDisconnectRequests] = useState([]);
  const [receivedDisconnectRequests, setReceivedDisconnectRequests] = useState(
    [],
  );
  const [actionLoadingKey, setActionLoadingKey] = useState("");

  useEffect(() => {
    setPageTitle("Connections");
    return () => resetPageTitle();
  }, []);

  useEffect(() => {
    fetchConnections();
  }, []);

  const fetchConnections = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.getConnectionsData();
      if (response.success) {
        setStats(response.data?.stats || stats);
        setActiveConnections(response.data?.activeConnections || []);
        setSentRequests(response.data?.sentRequests || []);
        setReceivedRequests(response.data?.receivedRequests || []);
        setSentDisconnectRequests(response.data?.sentDisconnectRequests || []);
        setReceivedDisconnectRequests(
          response.data?.receivedDisconnectRequests || [],
        );
      }
    } catch (err) {
      setError(err.message || "Failed to load connections");
    } finally {
      setLoading(false);
    }
  };

  const withAction = async (key, action, successMessage) => {
    setActionLoadingKey(key);
    setError("");
    setMessage("");
    try {
      await action();
      setMessage(successMessage);
      await fetchConnections();
    } catch (err) {
      setError(err.message || "Action failed");
    } finally {
      setActionLoadingKey("");
    }
  };

  const askForRating = (label) => {
    const input = window.prompt(`Give rating to ${label} (0 to 10)`);
    if (input === null) return null;
    const rating = Number(input);
    if (!Number.isFinite(rating) || rating < 0 || rating > 10) {
      setError("Please enter a valid rating between 0 and 10");
      return null;
    }
    return rating;
  };

  const handleRequestDisconnect = async (user) => {
    const confirmed = window.confirm(
      `Are you sure you want to disconnect from ${user.name}?`,
    );
    if (!confirmed) return;

    const rating = askForRating(user.name);
    if (rating === null) return;

    await withAction(
      `disconnect-request-${user._id}`,
      () => api.requestDisconnectConnection(user._id, rating),
      "Disconnect request sent. Waiting for their confirmation.",
    );
  };

  const handleConfirmDisconnect = async (user) => {
    const confirmed = window.confirm(
      `${user.name} has requested disconnect. Confirm disconnection?`,
    );
    if (!confirmed) return;

    const rating = askForRating(user.name);
    if (rating === null) return;

    await withAction(
      `disconnect-confirm-${user._id}`,
      () => api.confirmDisconnectConnection(user._id, rating),
      "Disconnected successfully after mutual confirmation.",
    );
  };

  const averageRating = stats.averageRating || 0;
  const filledStars = Math.round(averageRating);

  const renderTenStars = () =>
    Array.from({ length: 10 }).map((_, index) => (
      <span
        key={`rating-star-${index}`}
        className={index < filledStars ? "text-yellow-500" : "text-gray-300"}
      >
        ★
      </span>
    ));

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Connections</h1>
          <p className="text-gray-600">
            Manage incoming requests, sent requests, and your active network.
          </p>
        </div>

        {message && (
          <div className="bg-teal-50 border border-teal-200 text-teal-700 px-4 py-3 rounded-lg">
            {message}
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm border p-5">
            <p className="text-sm text-gray-500">Active Connections</p>
            <p className="text-3xl font-bold text-teal-600 mt-1">
              {stats.activeConnections}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-5">
            <p className="text-sm text-gray-500">Requests Received</p>
            <p className="text-3xl font-bold text-cyan-600 mt-1">
              {stats.receivedRequests}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-5">
            <p className="text-sm text-gray-500">Requests Sent</p>
            <p className="text-3xl font-bold text-purple-600 mt-1">
              {stats.sentRequests}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-5">
            <p className="text-sm text-gray-500">Average Rating (10 Stars)</p>
            <p className="text-3xl font-bold text-amber-500 mt-1">
              {averageRating.toFixed(1)}
            </p>
            <div className="mt-2 flex flex-wrap gap-1 text-lg leading-none">
              {renderTenStars()}
            </div>
          </div>
        </div>

        <section className="bg-white rounded-2xl shadow-sm border p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Received Requests
          </h2>
          {receivedRequests.length === 0 ? (
            <p className="text-gray-500">No pending received requests.</p>
          ) : (
            <div className="space-y-4">
              {receivedRequests.map((request) => {
                const user = request.user;
                const keyAccept = `accept-${user._id}`;
                const keyDecline = `decline-${user._id}`;
                return (
                  <div
                    key={user._id}
                    className="flex items-center justify-between gap-4 border rounded-lg p-4"
                  >
                    <div className="flex items-center gap-3">
                      {user.profilePicture ? (
                        <img
                          src={user.profilePicture}
                          alt={user.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-semibold">
                          {user.name?.charAt(0)?.toUpperCase()}
                        </div>
                      )}
                      <div>
                        <Link
                          to={`/profile/${user._id}`}
                          className="font-semibold text-gray-900 hover:underline"
                        >
                          {user.name}
                        </Link>
                        <p className="text-sm text-gray-500">
                          {user.location || "Location not set"}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          withAction(
                            keyAccept,
                            () => api.acceptConnectionRequest(user._id),
                            "Request accepted",
                          )
                        }
                        disabled={
                          actionLoadingKey === keyAccept || !!actionLoadingKey
                        }
                        className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() =>
                          withAction(
                            keyDecline,
                            () => api.declineConnectionRequest(user._id),
                            "Request declined",
                          )
                        }
                        disabled={
                          actionLoadingKey === keyDecline || !!actionLoadingKey
                        }
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="bg-white rounded-2xl shadow-sm border p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Sent Requests
          </h2>
          {sentRequests.length === 0 ? (
            <p className="text-gray-500">No pending sent requests.</p>
          ) : (
            <div className="space-y-4">
              {sentRequests.map((request) => {
                const user = request.user;
                const keyWithdraw = `withdraw-${user._id}`;
                return (
                  <div
                    key={user._id}
                    className="flex items-center justify-between gap-4 border rounded-lg p-4"
                  >
                    <div className="flex items-center gap-3">
                      {user.profilePicture ? (
                        <img
                          src={user.profilePicture}
                          alt={user.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center font-semibold">
                          {user.name?.charAt(0)?.toUpperCase()}
                        </div>
                      )}
                      <div>
                        <Link
                          to={`/profile/${user._id}`}
                          className="font-semibold text-gray-900 hover:underline"
                        >
                          {user.name}
                        </Link>
                        <p className="text-sm text-gray-500">
                          {user.location || "Location not set"}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        withAction(
                          keyWithdraw,
                          () => api.withdrawConnectionRequest(user._id),
                          "Request withdrawn",
                        )
                      }
                      disabled={
                        actionLoadingKey === keyWithdraw || !!actionLoadingKey
                      }
                      className="px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 disabled:opacity-50"
                    >
                      Withdraw Request
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="bg-white rounded-2xl shadow-sm border p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Active Connections
          </h2>
          {activeConnections.length === 0 ? (
            <p className="text-gray-500">No active connections yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeConnections.map((user) => (
                <div
                  key={user._id}
                  className="border rounded-xl p-4 hover:border-teal-300 hover:bg-teal-50 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-3">
                    {user.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt={user.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-semibold">
                        {user.name?.charAt(0)?.toUpperCase()}
                      </div>
                    )}
                    <div>
                      <Link
                        to={`/profile/${user._id}`}
                        className="font-semibold text-gray-900 hover:underline"
                      >
                        {user.name}
                      </Link>
                      <p className="text-sm text-gray-500">
                        {user.location || "Location not set"}
                      </p>
                    </div>
                  </div>
                  {user.skillsOffered?.length > 0 && (
                    <p className="text-sm text-gray-600 truncate">
                      Offers: {user.skillsOffered.slice(0, 3).join(", ")}
                    </p>
                  )}

                  {sentDisconnectRequests.some(
                    (request) => request.user?._id === user._id,
                  ) ? (
                    <div className="mt-3 w-full px-4 py-2 text-center bg-amber-50 text-amber-700 border border-amber-200 rounded-lg font-medium">
                      Disconnect request sent
                    </div>
                  ) : receivedDisconnectRequests.some(
                      (request) => request.user?._id === user._id,
                    ) ? (
                    <button
                      onClick={() => handleConfirmDisconnect(user)}
                      disabled={!!actionLoadingKey}
                      className="mt-3 w-full px-4 py-2 bg-orange-100 text-orange-700 border border-orange-300 rounded-lg hover:bg-orange-200 disabled:opacity-50"
                    >
                      Confirm Disconnect & Rate
                    </button>
                  ) : (
                    <button
                      onClick={() => handleRequestDisconnect(user)}
                      disabled={!!actionLoadingKey}
                      className="mt-3 w-full px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 disabled:opacity-50"
                    >
                      Request Disconnect & Rate
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
