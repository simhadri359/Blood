import React from 'react';
import { DonationRequest } from '../types';
import { BloodDropIcon } from './icons/BloodDropIcon';
import { MapPinIcon } from './icons/MapPinIcon';
import Button from './common/Button';
import { StarIcon } from './icons/StarIcon';

interface BloodRequestCardProps {
  request: DonationRequest;
  onRespond: (requestId: string) => void;
}

const UrgencyBadge: React.FC<{ urgency: 'Critical' | 'High' | 'Medium' | 'Low' }> = ({ urgency }) => {
    const urgencyClasses = {
        Critical: 'bg-red-100 text-red-800 border-red-200',
        High: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        Medium: 'bg-blue-100 text-blue-800 border-blue-200',
        Low: 'bg-green-100 text-green-800 border-green-200',
    };
    return (
        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${urgencyClasses[urgency]}`}>
            {urgency}
        </span>
    );
};

const BloodRequestCard: React.FC<BloodRequestCardProps> = ({ request, onRespond }) => {
  const timeSince = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 flex flex-col hover:shadow-md transition-shadow duration-300">
      <div className="p-6 flex-grow">
        <div className="flex justify-between items-start">
            <div className="flex-shrink-0 flex items-center justify-center bg-primary/10 text-primary rounded-full h-16 w-16 font-bold text-2xl border-4 border-white ring-2 ring-primary/20">
                {request.bloodType.group}{request.bloodType.rhFactor}
            </div>
            <div className="text-right">
                <UrgencyBadge urgency={request.urgency} />
                <p className="text-xs text-gray-500 mt-2">
                    {timeSince(request.createdAt)}
                </p>
            </div>
        </div>

        <div className="mt-4">
            <h3 className="text-lg font-bold text-gray-800">
                {request.requester.name}
            </h3>
            <div className="flex items-center text-gray-600 mt-1">
                <MapPinIcon className="h-4 w-4 mr-2 text-gray-400" />
                <span className="text-sm">{request.location}</span>
            </div>
        </div>
        
        {request.note && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">{request.note}</p>
            </div>
        )}
      </div>

        <div className="px-6 pb-6 mt-auto">
            <div className="space-y-2">
                <div className="flex items-center justify-between bg-yellow-50 p-3 rounded-lg">
                    <div className="flex items-center">
                        <StarIcon className="h-5 w-5 mr-2 text-yellow-500" />
                        <span className="text-sm text-gray-800 font-medium">Potential Reward:</span>
                    </div>
                    <span className="font-bold text-yellow-600 text-lg">{request.pointsOffered} Points</span>
                </div>
                <div className="flex items-center justify-between bg-red-50 p-3 rounded-lg">
                    <div className="flex items-center">
                        <BloodDropIcon className="h-5 w-5 mr-2 text-primary" />
                        <span className="text-sm text-gray-800 font-medium">Units Required:</span>
                    </div>
                    <span className="font-bold text-primary text-lg">{request.unitsRequired}</span>
                </div>
            </div>
             <Button className="w-full mt-4" onClick={() => onRespond(request.id)}>
                I Can Donate
            </Button>
        </div>
    </div>
  );
};

export default BloodRequestCard;