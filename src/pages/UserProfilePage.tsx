// UserProfilePage.jsx

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaUserPlus, FaUserCircle } from "react-icons/fa";
import { AiOutlinePlus } from "react-icons/ai";
import { IconContext } from "react-icons"; // Optional: To set global icon styles

// Define TypeScript interfaces (Optional but recommended)
interface User {
  id: number;
  username: string;
  email: string;
  interests: string[];
  avatar?: string; // Optional, since we'll use random images
  about?: string;
}

interface Event {
  id: number;
  name: string;
  location: string;
  type: string;
  date: string;
  day: string;
  time: string;
  description?: string;
  image_url?: string;
}

export default function UserProfilePage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const numericUserId = userId ? parseInt(userId, 10) : 1; // Default to user 1 if no ID

  useEffect(() => {
    if (!userId) {
      // Redirect to default user profile if no ID provided
      navigate('/profile/1');
    }
  }, [userId, navigate]);

  // State variables
  const [user, setUser] = useState<User | null>(null); // User details
  const [loadingUser, setLoadingUser] = useState(false); // Loading state for user details
  const [errorUser, setErrorUser] = useState<string | null>(null); // Error state for user details

  const [activeTab, setActiveTab] = useState<string>('Profile'); // Active tab: 'Profile', 'Find Friends', 'Suggested Events'

  const [relatedUsers, setRelatedUsers] = useState<User[]>([]); // Related users based on interests or search
  const [loadingMatch, setLoadingMatch] = useState(false); // Loading state for related users
  const [errorMatch, setErrorMatch] = useState<string | null>(null); // Error state for related users

  const [searchQuery, setSearchQuery] = useState<string>(''); // Search input for related users

  const [friends, setFriends] = useState<User[]>([]); // List of friends added by the user

  // Suggested Events State Variables
  const [suggestedEvents, setSuggestedEvents] = useState<Event[]>([]); // Suggested events based on interests
  const [loadingEvents, setLoadingEvents] = useState(false); // Loading state for suggested events
  const [errorEvents, setErrorEvents] = useState<string | null>(null); // Error state for suggested events

  // Add More Interests State Variables
  const [newInterest, setNewInterest] = useState<string>(''); // Input for new interest
  const [updatingInterests, setUpdatingInterests] = useState(false); // Loading state for updating interests
  const [errorInterests, setErrorInterests] = useState<string | null>(null); // Error state for updating interests
  const [successInterests, setSuccessInterests] = useState<string | null>(null); // Success message for updating interests

  const API_BASE_URL = 'http://127.0.0.1:8000'; // Replace with your FastAPI backend URL

  // Fetch user details on component mount
  useEffect(() => {
    const fetchUser = async () => {
      setLoadingUser(true);
      try {
        const response = await fetch(`${API_BASE_URL}/users/${numericUserId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user details');
        }
        const data: User = await response.json();
        setUser(data);
      } catch (err: any) {
        console.error("Error fetching user details:", err);
        setErrorUser(err.message || 'An unexpected error occurred.');
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, [numericUserId, API_BASE_URL]);

  // Fetch related users based on search query or user interests with debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const fetchRelatedUsers = async () => {
        if (!user) {
          setRelatedUsers([]);
          return;
        }

        setLoadingMatch(true);
        setErrorMatch(null);

        try {
          // Prepare the query
          const query =
            searchQuery.trim() !== ''
              ? searchQuery
                  .split(',')
                  .map((interest: string) => interest.trim())
                  .filter((interest: string) => interest !== '')
                  .join(', ')
              : user.interests.join(', ');

          const payload = {
            query,
          };

          const response = await fetch(`${API_BASE_URL}/match/users`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.detail || 'Failed to fetch related users');
          }

          // Handle the API response
          if (data.users && Array.isArray(data.users)) {
            setRelatedUsers(data.users);
          } else {
            setRelatedUsers([]);
          }
        } catch (err: any) {
          console.error("Error fetching related users:", err);
          setErrorMatch(err.message || 'An unexpected error occurred.');
        } finally {
          setLoadingMatch(false);
        }
      };

      fetchRelatedUsers();
    }, 500); // 500ms debounce delay

    // Cleanup function to cancel the timeout if searchQuery changes before 500ms
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, user, API_BASE_URL]);

  // Fetch suggested events based on user interests when "Suggested Events" tab is active
  useEffect(() => {
    if (activeTab !== 'Suggested Events' || !user) {
      return;
    }

    const fetchSuggestedEvents = async () => {
      setLoadingEvents(true);
      setErrorEvents(null);

      try {
        // Prepare the query based on user's interests
        const query = user.interests.join(', ');

        const payload = {
          query,
        };

        const response = await fetch(`${API_BASE_URL}/chatbot`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail || 'Failed to fetch suggested events');
        }

        // Handle the API response
        if (data.events && Array.isArray(data.events)) {
          setSuggestedEvents(data.events);
        } else {
          setSuggestedEvents([]);
        }
      } catch (err: any) {
        console.error("Error fetching suggested events:", err);
        setErrorEvents(err.message || 'An unexpected error occurred.');
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchSuggestedEvents();
  }, [activeTab, user, API_BASE_URL]);

  // Handle tab switching
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    setSearchQuery('');
    // Reset states related to the previous tab if necessary
    if (tab !== 'Find Friends') {
      setRelatedUsers([]);
      setErrorMatch(null);
      setLoadingMatch(false);
    }
    if (tab !== 'Suggested Events') {
      setSuggestedEvents([]);
      setErrorEvents(null);
      setLoadingEvents(false);
    }
  };

  // Handle search input for related users
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle adding a friend
  const handleAddFriend = async (friend: User) => {
    if (friends.find((f) => f.id === friend.id)) {
      return;
    }

    try {
      const payload = {
        user_id: numericUserId,
        friend_id: friend.id,
      };

      const response = await fetch(`${API_BASE_URL}/add-friend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to add friend');
      }

      // Update local state
      setFriends([...friends, friend]);
    } catch (err: any) {
      console.error("Error adding friend:", err);
      // Optionally, set an error state to display to the user
      alert(err.message || 'Failed to add friend.');
    }
  };

  // Handle adding an event to favorites (Optional Feature)
  const handleAddFavoriteEvent = (event: Event) => {
    // Implement this function based on your requirements
    // For example, add the event to a favorites list or send a request to the backend
    console.log(`Added event to favorites: ${event.name}`);
    alert(`Added "${event.name}" to favorites.`);
  };

  // Handle adding a new interest
  const handleAddInterest = async () => {
    if (newInterest.trim() === '') {
      setErrorInterests('Interest cannot be empty.');
      return;
    }

    setUpdatingInterests(true);
    setErrorInterests(null);
    setSuccessInterests(null);

    try {
      const payload = {
        user_id: numericUserId,
        new_interest: newInterest.trim(),
      };

      const response = await fetch(`${API_BASE_URL}/users/${numericUserId}/interests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to add new interest');
      }

      // Update user interests in state
      setUser((prevUser) => ({
        ...prevUser,
        interests: [...prevUser!.interests, newInterest.trim()],
      }));

      setSuccessInterests('Interest added successfully!');
      setNewInterest('');
    } catch (err: any) {
      console.error("Error adding new interest:", err);
      setErrorInterests(err.message || 'An unexpected error occurred.');
    } finally {
      setUpdatingInterests(false);
    }
  };

  // Render loading state
  if (loadingUser) {
    return (
      <div className="max-w-4xl my-24 mx-auto py-12 text-center">
        <p className="text-gray-500">Loading user profile...</p>
      </div>
    );
  }

  // Render error state
  if (errorUser) {
    return (
      <div className="max-w-4xl my-24 mx-auto py-12 text-center">
        <p className="text-red-500">{errorUser}</p>
      </div>
    );
  }

  // If user data is not yet fetched
  if (!user) {
    return null;
  }

  return (
    <div className="max-w-5xl my-12 mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">User Profile</h1>
        <FaUserCircle className="text-6xl text-blue-600" /> {/* User Icon */}
      </div>

      {/* User Details */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <div className="flex flex-col sm:flex-row items-center mb-6">
          <img
            src={`https://picsum.photos/seed/${user.id}/150/150`} // Random image based on user ID
            alt="User Avatar"
            className="w-32 h-32 rounded-full mb-4 sm:mb-0 sm:mr-6 object-cover"
          />
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-bold">{user.username}</h2>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-4">About</h3>
          <p className="text-gray-700">
            {user.about || 'No description provided.'}
          </p>
        </div>
        {/* User Interests */}
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-4">Interests</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {user.interests && user.interests.length > 0 ? (
              user.interests.map((interest, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                >
                  {interest}
                </span>
              ))
            ) : (
              <p className="text-gray-600">No interests listed.</p>
            )}
          </div>
          {/* Add More Interests */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Add a new interest..."
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAddInterest();
                }
              }}
            />
            <button
              onClick={handleAddInterest}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
              disabled={updatingInterests}
            >
              <AiOutlinePlus className="mr-2" />
              Add
            </button>
          </div>
          {/* Success and Error Messages */}
          {successInterests && (
            <p className="text-green-500 mt-2">{successInterests}</p>
          )}
          {errorInterests && (
            <p className="text-red-500 mt-2">{errorInterests}</p>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="flex border-b border-gray-200">
          {['Profile', 'Find Friends', 'Suggested Events'].map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabClick(tab)}
              className={`mr-8 pb-2 font-medium text-lg ${
                activeTab === tab
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {/* Profile Tab */}
        {activeTab === 'Profile' && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-2xl font-semibold mb-4">About Me</h3>
            <p className="text-gray-700">
              {user.about || 'No description provided.'}
            </p>
            {/* Additional profile-related information can be added here */}
          </div>
        )}

        {/* Find Friends Tab */}
        {activeTab === 'Find Friends' && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-2xl font-semibold mb-4">Find New Friends</h3>

            {/* Search Input for Finding Friends */}
            <input
              type="text"
              placeholder="Search by interests, name..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full mb-6 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Loading Indicator */}
            {loadingMatch ? (
              <p className="text-gray-500">Searching for friends...</p>
            ) : (
              <>
                {/* Error Message */}
                {errorMatch && (
                  <p className="text-red-500 mb-4">{errorMatch}</p>
                )}

                {/* Related Users List */}
                {relatedUsers.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {relatedUsers.map((relatedUser) => (
                      <div
                        key={relatedUser.id}
                        className="flex items-center bg-gray-100 p-4 rounded-lg shadow-sm"
                      >
                        <FaUserCircle className="text-4xl text-purple-500 mr-4" /> {/* User Icon */}
                        <div className="flex-1">
                          <h4 className="text-xl font-bold">{relatedUser.username}</h4>
                          <p className="text-gray-600">{relatedUser.email}</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {relatedUser.interests && relatedUser.interests.length > 0 ? (
                              relatedUser.interests.map((interest: string, i: number) => (
                                <span
                                  key={i}
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
                        <button
                          onClick={() => handleAddFriend(relatedUser)}
                          className={`ml-4 px-4 py-2 rounded-lg text-white flex items-center ${
                            friends.find((f) => f.id === relatedUser.id)
                              ? 'bg-gray-400 cursor-not-allowed'
                              : 'bg-blue-600 hover:bg-blue-700'
                          }`}
                          disabled={friends.find((f) => f.id === relatedUser.id)}
                        >
                          {friends.find((f) => f.id === relatedUser.id) ? (
                            <>
                              <FaUserPlus className="mr-2" />
                              Friend Added
                            </>
                          ) : (
                            <>
                              <FaUserPlus className="mr-2" />
                              Add 
                            </>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No users found matching your interests.</p>
                )}
              </>
            )}

            {/* Friends List */}
            {friends.length > 0 && (
              <div className="mt-8">
                <h3 className="text-2xl font-semibold mb-4">Your Friends</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {friends.map((friend) => (
                    <div
                      key={friend.id}
                      className="flex items-center bg-green-100 p-4 rounded-lg shadow-sm"
                    >
                      <FaUserPlus className="text-4xl text-green-500 mr-4" /> {/* Friend Icon */}
                      <div>
                        <h4 className="text-xl font-bold">{friend.username}</h4>
                        <p className="text-gray-600">{friend.email}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {friend.interests && friend.interests.length > 0 ? (
                            friend.interests.map((interest: string, i: number) => (
                              <span
                                key={i}
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
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Suggested Events Tab */}
        {activeTab === 'Suggested Events' && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-2xl font-semibold mb-4">Suggested Events for You</h3>

            {/* Loading Indicator */}
            {loadingEvents ? (
              <p className="text-gray-500">Fetching suggested events...</p>
            ) : (
              <>
                {/* Error Message */}
                {errorEvents && (
                  <p className="text-red-500 mb-4">{errorEvents}</p>
                )}

                {/* Suggested Events List */}
                {suggestedEvents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {suggestedEvents.map((event) => (
                      <div
                        key={event.id}
                        className="bg-gray-100 p-4 rounded-lg shadow-sm"
                      >
                        <img
                          src={`https://picsum.photos/seed/${event.id}/400/200`} // Random image based on event ID
                          alt={event.name}
                          className="w-full h-48 object-cover rounded-md mb-4"
                        />
                        <h4 className="text-xl font-bold">{event.name}</h4>
                        <p className="text-gray-600">{event.type} at {event.location}</p>
                        <p className="text-gray-600">Date: {event.date} ({event.day})</p>
                        <p className="text-gray-600">Time: {event.time}</p>
                        <p className="text-gray-700 mt-2">
                          {event.description || 'No description provided.'}
                        </p>
                        <button
                          onClick={() => handleAddFavoriteEvent(event)}
                          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                        >
                          <AiOutlinePlus className="mr-2" />
                          Add to Favorites
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No events found matching your interests.</p>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
