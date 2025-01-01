// CommunityPage.jsx

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';

export default function CommunityPage() {
  const { communityId } = useParams(); // Assuming you're using React Router
  const [community, setCommunity] = useState(null);
  const [loadingCommunity, setLoadingCommunity] = useState(false);
  const [errorCommunity, setErrorCommunity] = useState(null);

  const [relatedUsers, setRelatedUsers] = useState([]);
  const [relatedCommunities, setRelatedCommunities] = useState([]);
  const [loadingMatch, setLoadingMatch] = useState(false);
  const [errorMatch, setErrorMatch] = useState(null);

  const [searchRelated, setSearchRelated] = useState('');

  const API_BASE_URL = 'http://127.0.0.1:8000'; // Replace with your FastAPI backend URL

  // Fetch community details on component mount
  useEffect(() => {
    const fetchCommunity = async () => {
      setLoadingCommunity(true);
      try {
        const response = await fetch(`${API_BASE_URL}/communities/${communityId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch community details');
        }
        const data = await response.json();
        setCommunity(data);
      } catch (err) {
        console.error("Error fetching community details:", err);
        setErrorCommunity(err.message || 'An unexpected error occurred.');
      } finally {
        setLoadingCommunity(false);
      }
    };

    fetchCommunity();
  }, [communityId]);

  // Fetch related users and communities based on community interests
  useEffect(() => {
    const fetchMatches = async () => {
      if (!community || !community.interests || community.interests.length === 0) {
        setRelatedUsers([]);
        setRelatedCommunities([]);
        return;
      }

      setLoadingMatch(true);
      setErrorMatch(null);

      try {
        const response = await fetch(`${API_BASE_URL}/communities/${communityId}/match`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ interests: community.interests }),
        });

        const text = await response.text();
        let data;
        
        try {
          data = JSON.parse(text);
        } catch (e) {
          console.error('Failed to parse JSON:', text);
          throw new Error('Invalid response format from server');
        }

        if (!response.ok) {
          throw new Error(data.detail || 'Failed to fetch matches');
        }

        // Handle both array and object responses
        if (Array.isArray(data)) {
          const users = data.filter(item => item.username);
          const communities = data.filter(item => item.name && !item.username);
          setRelatedUsers(users);
          setRelatedCommunities(communities);
        } else {
          setRelatedUsers(data.related_users || []);
          setRelatedCommunities(data.related_communities || []);
        }
      } catch (err) {
        console.error("Error fetching matches:", err);
        setErrorMatch(err.message || 'An unexpected error occurred.');
      } finally {
        setLoadingMatch(false);
      }
    };

    fetchMatches();
  }, [community, communityId]);

  // Handle search input for related users and communities
  const handleSearchChange = (e) => {
    setSearchRelated(e.target.value);
  };

  // Filter related users and communities based on search input
  const filteredRelatedUsers = relatedUsers.filter((usr) =>
    usr.username.toLowerCase().includes(searchRelated.toLowerCase()) ||
    usr.email.toLowerCase().includes(searchRelated.toLowerCase()) ||
    (usr.interests && usr.interests.some((interest) => interest.toLowerCase().includes(searchRelated.toLowerCase())))
  );

  const filteredRelatedCommunities = relatedCommunities.filter((comm) =>
    comm.name.toLowerCase().includes(searchRelated.toLowerCase()) ||
    (comm.description && comm.description.toLowerCase().includes(searchRelated.toLowerCase())) ||
    (comm.interests && comm.interests.some((interest) => interest.toLowerCase().includes(searchRelated.toLowerCase())))
  );

  // Render loading state
  if (loadingCommunity) {
    return (
      <div className="max-w-4xl my-24 mx-auto py-12 text-center">
        <p className="text-gray-500">Loading community details...</p>
      </div>
    );
  }

  // Render error state
  if (errorCommunity) {
    return (
      <div className="max-w-4xl my-24 mx-auto py-12 text-center">
        <p className="text-red-500">{errorCommunity}</p>
      </div>
    );
  }

  // If community data is not yet fetched
  if (!community) {
    return null;
  }

  return (
    <div className="max-w-4xl my-24 mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <h1 className="text-4xl font-bold mb-8 text-center">Community Details</h1>

      {/* Community Details */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <div className="flex items-center mb-6">
          <img
            src={community.image_url || 'https://via.placeholder.com/150'}
            alt="Community Avatar"
            className="w-24 h-24 rounded-full mr-6 object-cover"
          />
          <div>
            <h2 className="text-2xl font-bold">{community.name}</h2>
            <p className="text-gray-600">{community.description || 'No description provided.'}</p>
          </div>
        </div>
        {/* Community Interests */}
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-4">Interests</h3>
          <div className="flex flex-wrap gap-2">
            {community.interests && community.interests.length > 0 ? (
              community.interests.map((interest, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                >
                  {interest}
                </span>
              ))
            ) : (
              <p className="text-gray-600">No interests listed.</p>
            )}
          </div>
        </div>
      </div>

      {/* Related Users and Communities */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-2xl font-semibold mb-4">Related Users and Communities</h3>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search related users and communities..."
          value={searchRelated}
          onChange={handleSearchChange}
          className="w-full mb-6 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        {/* Loading Indicator */}
        {loadingMatch ? (
          <p className="text-gray-500">Fetching related users and communities...</p>
        ) : (
          <>
            {/* Error Message */}
            {errorMatch && (
              <p className="text-red-500 mb-4">{errorMatch}</p>
            )}

            {/* Related Users List */}
            {filteredRelatedUsers.length > 0 && (
              <div className="mb-8">
                <h4 className="text-xl font-semibold mb-2">Related Users</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredRelatedUsers.map((relatedUser) => (
                    <div key={relatedUser.id} className="flex items-center bg-gray-100 p-4 rounded-lg">
                      <img
                        src={relatedUser.avatar || 'https://via.placeholder.com/100'}
                        alt={`${relatedUser.username}'s avatar`}
                        className="w-16 h-16 rounded-full mr-4 object-cover"
                      />
                      <div>
                        <h5 className="text-lg font-bold">{relatedUser.username}</h5>
                        <p className="text-gray-600">{relatedUser.email}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {relatedUser.interests && relatedUser.interests.length > 0 ? (
                            relatedUser.interests.map((interest, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full"
                              >
                                {interest}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-500 text-sm">No interests listed.</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Related Communities List */}
            {filteredRelatedCommunities.length > 0 && (
              <div>
                <h4 className="text-xl font-semibold mb-2">Related Communities</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredRelatedCommunities.map((comm) => (
                    <div key={comm.id} className="p-4 bg-gray-100 rounded-lg">
                      <h5 className="text-lg font-bold mb-2">{comm.name}</h5>
                      <p className="text-gray-700 mb-2">{comm.description || 'No description provided.'}</p>
                      <div className="flex flex-wrap gap-2">
                        {comm.interests && comm.interests.length > 0 ? (
                          comm.interests.map((interest, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full"
                            >
                              {interest}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-500 text-sm">No interests listed.</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No Related Users or Communities Found */}
            {filteredRelatedUsers.length === 0 && filteredRelatedCommunities.length === 0 && (
              <p className="text-gray-500">No related users or communities found.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
