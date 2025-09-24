// FIX: Created DonationHistoryPage component to resolve "not a module" error in App.tsx.
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { MOCK_DONATION_HISTORY } from '../constants';
import { Donation, DonationStatus } from '../types';
import { BloodDropIcon } from '../components/icons/BloodDropIcon';
import { CalendarIcon } from '../components/icons/CalendarIcon';

const StatusBadge: React.FC<{ status: DonationStatus }> = ({ status }) => {
  const statusClasses = {
    [DonationStatus.COMPLETED]: 'bg-green-100 text-green-800',
    [DonationStatus.SCHEDULED]: 'bg-blue-100 text-blue-800',
    [DonationStatus.CANCELLED]: 'bg-red-100 text-red-800',
  };
  return (
    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${statusClasses[status]}`}>
      {status}
    </span>
  );
};

const DonationHistoryCard: React.FC<{ donation: Donation }> = ({ donation }) => {
  const formattedDate = new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(donation.date));
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div className="flex-grow">
            <div className="flex items-center mb-2">
                 <div className="flex-shrink-0 flex items-center justify-center bg-primary/10 text-primary rounded-full h-10 w-10 font-bold text-md mr-4">
                    {donation.bloodType.group}{donation.bloodType.rhFactor}
                </div>
                <div>
                    <h3 className="font-bold text-lg text-gray-800">{donation.location}</h3>
                    <div className="flex items-center text-gray-500 text-sm mt-1">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        <span>{formattedDate}</span>
                    </div>
                </div>
            </div>
        </div>
        <div className="flex flex-col items-start sm:items-end w-full sm:w-auto">
            <StatusBadge status={donation.status} />
            <p className="text-gray-700 mt-2 font-semibold">
                {donation.units} {donation.units > 1 ? 'Units' : 'Unit'}
            </p>
        </div>
    </div>
  );
};


const DonationHistoryPage: React.FC = () => {
  const { user } = useAuth();

  // In a real app, this would be a filtered API call
  const userDonations = MOCK_DONATION_HISTORY.filter(
    d => d.donorId === user.id
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-800">Donation History</h1>
        <p className="text-gray-600 mt-1">
          A record of your life-saving contributions. Thank you for your generosity!
        </p>
      </div>

      {userDonations.length > 0 ? (
        <div className="space-y-4">
          {userDonations.map(donation => (
            <DonationHistoryCard key={donation.id} donation={donation} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm">
          <BloodDropIcon className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-2 text-xl font-semibold text-gray-900">No Donations Yet</h3>
          <p className="mt-1 text-sm text-gray-500">Your donation history will appear here once you make your first donation.</p>
        </div>
      )}
    </div>
  );
};

export default DonationHistoryPage;