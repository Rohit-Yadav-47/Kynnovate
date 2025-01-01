import React from 'react';
import { Event } from '../../types';
import EventCard from './EventCard';

interface EventGridProps {
  events: Event[];
}

export default function EventGrid({ events }: EventGridProps) {
  if (!events || events.length === 0) {
    return <p>No events available.</p>; // Handle empty events array
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event, index) => (
        <EventCard key={index} event={event} />
      ))}
    </div>
  );
}