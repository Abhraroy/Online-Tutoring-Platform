import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

const SearchResultPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const isInternalUpdate = useRef(false);

  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sync query state with URL params when they change externally (e.g., from navbar search)
  useEffect(() => {
    if (isInternalUpdate.current) {
      isInternalUpdate.current = false;
      return;
    }
    const urlQuery = searchParams.get('q') || '';
    setQuery(prevQuery => {
      if (urlQuery !== prevQuery) {
        // Update debounced query immediately for external URL changes
        setDebouncedQuery(urlQuery);
        return urlQuery;
      }
      return prevQuery;
    });
  }, [searchParams]);
  const getAverageRating = (tutor) => {
    if (!tutor || !Array.isArray(tutor.rating) || tutor.rating.length === 0) return null;
    const sum = tutor.rating.reduce((acc, val) => acc + (Number(val) || 0), 0);
    const avg = sum / tutor.rating.length;
    if (!isFinite(avg) || avg <= 0) return null;
    return avg.toFixed(1);
  };
  // Debounce query changes by 200ms
  useEffect(() => {
    const trimmedQuery = query.trim();
    const handler = setTimeout(() => {
      const currentUrlQuery = searchParams.get('q') || '';
      if (trimmedQuery !== currentUrlQuery) {
        isInternalUpdate.current = true;
        setSearchParams(trimmedQuery ? { q: trimmedQuery } : {});
      }
      setDebouncedQuery(trimmedQuery);
    }, 200);

    return () => clearTimeout(handler);
  }, [query, setSearchParams, searchParams]);
  // Fetch results when debouncedQuery changes
  useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedQuery) {
        setSessions([]);
        setError(null);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get('/student/search', {
          params: { q: debouncedQuery },
          withCredentials: true
        });
        if (response.status === 200) {
          setSessions(response.data.sessions || []);
        }
      } catch (err) {
        console.error('Error fetching search results:', err);
        setError('Failed to load search results. Please try again.');
        setSessions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery]);

  return (
    <div className="w-full bg-gray-50 py-8 px-3 sm:px-4 lg:px-6 min-h-screen">
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Search Results</h1>
            <p className="text-gray-600 text-sm">
              Search sessions by subject or tutor name.
            </p>
          </div>
          <div className="w-full sm:w-80">
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by subject or tutor name..."
                className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {loading && (
          <div className="w-full flex items-center justify-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-500 mx-auto mb-3"></div>
              <p className="text-gray-600 text-sm">Searching...</p>
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="w-full flex items-center justify-center py-16">
            <div className="text-center">
              <p className="text-red-600 mb-3 text-sm">{error}</p>
              <button
                onClick={() => setQuery(query)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {!loading && !error && !debouncedQuery && (
          <div className="mt-8 text-center text-gray-500 text-sm">
            Start typing above to search for sessions by subject or tutor.
          </div>
        )}

        {!loading && !error && debouncedQuery && sessions.length === 0 && (
          <div className="mt-8 text-center text-gray-500 text-sm">
            No results found for <span className="font-semibold">&quot;{debouncedQuery}&quot;</span>.
          </div>
        )}

        {!loading && !error && sessions.length > 0 && (
          <div className="mt-6 space-y-6">
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Sessions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sessions.map((session) => (
                  <div
                    key={session._id}
                    className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 p-4 flex flex-col gap-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h3 className="text-base font-semibold text-gray-900">
                          {session.topic || 'Session'}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {session.subject}
                        </p>
                        {session.tutorId && (
                          <p className="text-xs text-gray-600 mt-1">
                            Tutor:{' '}
                            <span className="font-medium">
                              {session.tutorId.name}
                            </span>
                          </p>
                        )}
                      </div>
                      <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center">
                        <span className="text-indigo-700 font-semibold text-sm">
                          {session.tutorId?.name?.charAt(0).toUpperCase() || session.subject?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div className="text-xs text-gray-600 space-y-1">
                      {session.date && (
                        <p>
                          Date:{' '}
                          <span className="font-medium">
                            {new Date(session.date).toLocaleString()}
                          </span>
                        </p>
                      )}
                      {session.grade && (
                        <p>
                          Grade:{' '}
                          <span className="font-medium">
                            {session.grade}
                          </span>
                        </p>
                      )}
                      {typeof session.fee === 'number' && (
                        <p>
                          Fee:{' '}
                          <span className="font-medium">
                            ${session.fee}
                          </span>
                        </p>
                      )}
                      {typeof session.duration === 'number' && (
                        <p>
                          Duration:{' '}
                          <span className="font-medium">
                            {session.duration} mins
                          </span>
                        </p>
                      )}
                      {typeof session.availableSlots === 'number' && (
                        <p>
                          Available Slots:{' '}
                          <span className="font-medium">
                            {session.availableSlots}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResultPage;

