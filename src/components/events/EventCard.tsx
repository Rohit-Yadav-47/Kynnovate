import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Tag } from 'lucide-react';
import { Event } from '../../types';

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  if (!event) {
    return null;
  }

  return (
    <Link to={`/events/${event.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        {event.image_url && (
          <img 
            src={event.image_url} 
            alt={event.name}
            className="w-full h-48 object-cover"
          />
        )}
        <div className="p-4">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-lg">{event.name}</h3>
            {/* Conditionally render price if it exists */}
            {event.price && (
              <span className="text-blue-600 font-semibold">${event.price}</span>
            )}
          </div>
          
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{event.time}</span>
            </div>
          </div>

          {event.tags && event.tags.length > 0 && (
            <div className="mt-4 flex gap-2">
              {event.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
