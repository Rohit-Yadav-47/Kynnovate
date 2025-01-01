import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, Tag, Loader2, AlertTriangle, CheckCircle } from 'lucide-react';
import axios from 'axios';

export default function EventDetailPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/events/${id}`);
        if (response.data) {
          setEvent(response.data);
        } else {
          setError('Event not found');
        }
      } catch (error) {
        setError(error.message || 'An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventDetails();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin text-blue-600 w-12 h-12" />
        <span className="ml-4 text-xl text-gray-700">Loading event details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <AlertTriangle className="text-red-500 w-12 h-12" />
        <span className="ml-4 text-xl text-red-500">Error: {error}</span>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CheckCircle className="text-gray-500 w-12 h-12" />
        <span className="ml-4 text-xl text-gray-500">No event details available.</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl my-24 mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="relative">
          <img 
            src={event.image_url} 
            alt={event.name}
            className="w-full h-96 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-50"></div>
          <div className="absolute bottom-0 left-0 p-4">
            <h1 className="text-3xl font-bold text-white">{event.name}</h1>
          </div>
        </div>
        
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6 text-blue-600" />
              <div>
                <h3 className="text-sm text-gray-500">Date</h3>
                <p className="text-md font-medium text-gray-700">{event.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6 text-blue-600" />
              <div>
                <h3 className="text-sm text-gray-500">Time</h3>
                <p className="text-md font-medium text-gray-700">{event.time}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-6 h-6 text-blue-600" />
              <div>
                <h3 className="text-sm text-gray-500">Location</h3>
                <p className="text-md font-medium text-gray-700">{event.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-blue-600" />
              <div>
                <h3 className="text-sm text-gray-500">Capacity</h3>
                <p className="text-md font-medium text-gray-700">{event.capacity} people</p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">About This Event</h2>
            <p className="text-gray-700 leading-relaxed">{event.description}</p>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {event.tags && event.tags.length > 0 ? (
                event.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))
              ) : (
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">No tags available</span>
              )}
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button
              className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Book Now
            </button>
            <button
              className="flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
            >
              <MapPin className="w-5 h-5 mr-2" />
              Contact Organizer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
