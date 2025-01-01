import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Users, Tag } from 'lucide-react';

export default function CommunitiesPage() {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [showMatchingForm, setShowMatchingForm] = useState(false);
  const [matchingQuery, setMatchingQuery] = useState(''); // Renamed for clarity
  const [matchedCommunities, setMatchedCommunities] = useState([]);
  const [matchResponse, setMatchResponse] = useState(''); // To display LLM response
  const [isMatchLoading, setIsMatchLoading] = useState(false);
  const [matchError, setMatchError] = useState<string | null>(null);

  const API_BASE_URL = 'http://127.0.0.1:8000';

  // Fetch all communities
  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/communities`);
        if (!response.ok) throw new Error('Failed to fetch communities');
        const data = await response.json();
        setCommunities(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCommunities();
  }, []);

  // Handle matching form submission
  const handleMatchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsMatchLoading(true);
    setMatchError(null);
    setMatchedCommunities([]);
    setMatchResponse('');

    try {
      const query = matchingQuery.trim();
      if (!query) throw new Error('Please enter a search query');

      const response = await fetch(`${API_BASE_URL}/match/communities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to find matches');
      }

      // Safely handle the response data
      if (Array.isArray(data)) {
        setMatchedCommunities(data);
        setMatchResponse('Here are some communities that match your interests:');
      } else if (data.communities) {
        setMatchedCommunities(data.communities);
        setMatchResponse(data.response || 'Found matching communities');
      } else {
        setMatchedCommunities([]);
        setMatchResponse('No matching communities found');
      }
    } catch (err: any) {
      setMatchError(err.message);
    } finally {
      setIsMatchLoading(false);
    }
  };

  // Filter communities based on search and interests
  const filteredCommunities = communities.filter((community: any) => {
    const matchesSearch =
      community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      community.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesInterests =
      selectedInterests.length === 0 ||
      selectedInterests.some((interest) =>
        community.interests?.includes(interest)
      );

    return matchesSearch && matchesInterests;
  });

  // Get unique interests from all communities
  const allInterests = [
    ...new Set(communities.flatMap((c: any) => c.interests || [])),
  ];

  return (
    <div className="max-w-7xl my-24 mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header with Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Communities</h1>
          <button
            onClick={() => setShowMatchingForm(!showMatchingForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            AI Matching Communities
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search communities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Interest Filters */}
        <div className="flex flex-wrap gap-2">
          {allInterests.map((interest: string) => (
            <button
              key={interest}
              onClick={() =>
                setSelectedInterests((prev) =>
                  prev.includes(interest)
                    ? prev.filter((i) => i !== interest)
                    : [...prev, interest]
                )
              }
              className={`px-3 py-1 rounded-full text-sm ${
                selectedInterests.includes(interest)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {interest}
            </button>
          ))}
        </div>
      </div>

      {/* Matching Form */}
      {showMatchingForm && (
        <div className="mb-8 p-6 bg-gray-50 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">
            Find Matching Communities
          </h2>
          <form onSubmit={handleMatchSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                What kind of community are you looking for?
              </label>
              <textarea
                value={matchingQuery}
                onChange={(e) => setMatchingQuery(e.target.value)}
                placeholder="Describe your interests or the type of community you're looking for..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 min-h-[100px]"
              />
            </div>
            <button
              type="submit"
              disabled={isMatchLoading}
              className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]`}
            >
              {isMatchLoading ? (
                <span className="inline-block animate-spin mr-2">⌛</span>
              ) : null}
              {isMatchLoading ? 'Finding...' : 'Find Matches'}
            </button>
          </form>

          {matchError && (
            <div className="mt-4 p-4 bg-red-100 text-red-800 rounded-lg">
              {matchError}
            </div>
          )}

          {matchResponse && !matchError && (
            <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-lg">
              {matchResponse}
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="text-red-500 text-center py-4">{error}</div>
      )}

      {/* Communities Grid */}
      {loading ? (
        <div className="text-center py-10">Loading communities...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(matchedCommunities.length > 0
            ? matchedCommunities
            : filteredCommunities
          ).map((community: any) => (
            <Link
              key={community.id}
              to={`/community/${community.id}`}
              className="block bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              {community.image_url && (
                <img
                  src={community.image_url}
                  alt={community.name}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">
                  {community.name}
                </h2>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {community.description}
                </p>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Users className="w-4 h-4 mr-1" />
                  <span>{community.member_count || 0} members</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {community.interests?.map((interest: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
