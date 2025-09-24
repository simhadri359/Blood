import React from 'react';
import { BloodDriveEvent } from '../types';
import { MapPinIcon } from './icons/MapPinIcon';
import { CalendarIcon } from './icons/CalendarIcon';
import Button from './common/Button';

interface EventCardProps {
  event: BloodDriveEvent;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(event.date));
  
  const formattedTime = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(event.date));


  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 flex flex-col hover:shadow-md transition-shadow duration-300">
      <div className="p-6 flex-grow">
        <p className="text-sm font-semibold text-primary">{event.organizer}</p>
        <h3 className="text-xl font-bold text-gray-800 mt-1">{event.title}</h3>
        
        <div className="mt-4 space-y-3 text-gray-700">
            <div className="flex items-center">
                <CalendarIcon className="h-5 w-5 mr-3 text-gray-400 flex-shrink-0" />
                <span className="text-sm">{formattedDate} at {formattedTime}</span>
            </div>
            <div className="flex items-center">
                <MapPinIcon className="h-5 w-5 mr-3 text-gray-400 flex-shrink-0" />
                <span className="text-sm">{event.location}</span>
            </div>
        </div>

        <p className="text-gray-600 mt-4 text-sm flex-grow">{event.description}</p>
        
      </div>
      <div className="p-6 bg-gray-50/70 border-t border-gray-200">
        <Button className="w-full">View Details & RSVP</Button>
      </div>
    </div>
  );
};

export default EventCard;