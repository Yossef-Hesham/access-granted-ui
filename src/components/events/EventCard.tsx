
import React from 'react';
import { Link } from 'react-router-dom';
import { Event } from '@/services/eventService';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';
import { Check, Calendar, MapPin } from 'lucide-react';

interface EventCardProps {
  event: Event;
  isBooked?: boolean;
  onBookEvent?: (event: Event) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, isBooked = false, onBookEvent }) => {
  const { t } = useLanguage();
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  };
  
  const truncateDescription = (text: string, maxLength = 100) => {
    return text.length > maxLength
      ? text.substring(0, maxLength - 3) + '...'
      : text;
  };

  const handleBookClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (onBookEvent) {
      onBookEvent(event);
    }
  };

  return (
    <div className="event-card">
      <Link to={`/events/${event.id}`}>
        <img
          src={event.image || 'https://via.placeholder.com/400x200?text=Event'}
          alt={event.name}
          className="event-card-image"
        />
        <div className="p-4">
          <h3 className="font-bold text-lg">{event.name}</h3>
          
          <div className="flex items-center text-muted-foreground mt-2">
            <Calendar className="h-4 w-4 mr-1" />
            <span className="text-sm">{formatDate(event.date)}</span>
          </div>
          
          <div className="flex items-center text-muted-foreground mt-1">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-sm">{event.venue}</span>
          </div>
          
          <p className="mt-2 text-muted-foreground">
            {truncateDescription(event.description)}
          </p>
          
          <div className="flex justify-between items-center mt-4">
            <div className="font-bold">{event.price.toFixed(2)} $</div>
            
            {isBooked ? (
              <Button variant="outline" className="pointer-events-none opacity-75" disabled>
                <Check className="h-4 w-4 mr-2" />
                {t('events.booked')}
              </Button>
            ) : (
              <Button onClick={handleBookClick}>
                {t('events.book_now')}
              </Button>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default EventCard;
