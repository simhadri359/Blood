import React from 'react';
import { User } from '../types';
import { MapPinIcon } from './icons/MapPinIcon';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';
import Button from './common/Button';
import { ChatBubbleIcon } from './icons/ChatBubbleIcon';

interface DonorCardProps {
  donor: User;
  onScheduleClick: (donor: User) => void;
  onChatClick: (donor: User) => void;
}

const DonorCard: React.FC<DonorCardProps> = ({ donor, onScheduleClick, onChatClick }) => {
  const isAvailable = donor.isAvailable && !donor.deferralReason;

  return (
    <div className={`bg-white rounded-xl shadow-sm border overflow-hidden transition-all duration-300 ${isAvailable ? 'border-gray-200 hover:shadow-md' : 'border-gray-300 bg-gray-50 opacity-80'}`}>
        <div className="p-6">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-xl font-bold text-gray-800 flex items-center">
                        {donor.name}
                        {donor.isVerified && <ShieldCheckIcon className="h-5 w-5 ml-2 text-green-500" title="Verified Donor" />}
                    </h3>
                     <div className="flex items-center text-gray-600 mt-1">
                        <MapPinIcon className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="text-sm">{donor.location}</span>
                    </div>
                </div>
                {donor.bloodType && (
                    <div className="flex-shrink-0 flex items-center justify-center bg-primary/10 text-primary rounded-full h-14 w-14 font-bold text-xl border-4 border-white ring-2 ring-primary/20">
                        {donor.bloodType.group}{donor.bloodType.rhFactor}
                    </div>
                )}
            </div>

            <div className="mt-6">
                 {isAvailable ? (
                    <div className="flex items-center space-x-2">
                        <Button 
                            className="flex-grow"
                            onClick={() => onScheduleClick(donor)}
                        >
                            Send Donation Request
                        </Button>
                        <Button
                            variant="secondary"
                            size="md"
                            className="px-3"
                            onClick={() => onChatClick(donor)}
                            aria-label={`Chat with ${donor.name}`}
                        >
                            <ChatBubbleIcon className="h-6 w-6" />
                        </Button>
                    </div>
                ) : (
                    <div className="text-center p-3 bg-yellow-100 text-yellow-800 text-sm rounded-lg border border-yellow-200">
                        <p className="font-semibold">Currently Unavailable</p>
                        {donor.deferralReason && <p className="text-xs mt-1">{donor.deferralReason}</p>}
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default DonorCard;
