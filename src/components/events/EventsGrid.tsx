
import React from 'react';
import EventCard from './EventCard';
import { Event } from '@/services/eventService';

interface EventsGridProps {
  events: Event[];
  bookedEventIds?: (string | number)[];
  onBookEvent?: (event: Event) => void;
  isLoading?: boolean;
}

const EventsGrid: React.FC<EventsGridProps> = ({
  events,
  bookedEventIds = [],
  onBookEvent,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="event-card animate-pulse">
            <div className="bg-muted h-48 w-full"></div>
            <div className="p-4">
              <div className="h-6 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded mt-2 w-1/2"></div>
              <div className="h-4 bg-muted rounded mt-1 w-1/3"></div>
              <div className="h-16 bg-muted rounded mt-2"></div>
              <div className="flex justify-between mt-4">
                <div className="h-6 bg-muted rounded w-16"></div>
                <div className="h-10 bg-muted rounded w-24"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!events.length) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No events available</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          isBooked={bookedEventIds.includes(event.id)}
          onBookEvent={onBookEvent}
        />
      ))}
    </div>
  );
};

export default EventsGrid;
