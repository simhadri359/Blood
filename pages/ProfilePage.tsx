import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import type { User } from '../types';
import { UserRole } from '../types';
import { MOCK_BADGES } from '../constants';
import { useNavigate } from 'react-router-dom';
import { ShieldCheckIcon } from '../components/icons/ShieldCheckIcon';
import { BloodDropIcon } from '../components/icons/BloodDropIcon';
import { MapPinIcon } from '../components/icons/MapPinIcon';
import { UserIcon } from '../components/icons/UserIcon';
import { HeartIcon } from '../components/icons/HeartIcon';
import { TrophyIcon } from '../components/icons/TrophyIcon';
import Button from '../components/common/Button';
import EditProfileModal from '../components/EditProfileModal';
import VerificationModal from '../components/VerificationModal';
import Alert from '../components/common/Alert';

const ProfilePage: React.FC = () => {
    const { user, updateUser } = useAuth();
    const navigate = useNavigate();
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isVerifyModalOpen, setVerifyModalOpen] = useState(false);
    const [verificationStatus, setVerificationStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [verificationError, setVerificationError] = useState<string | null>(null);

    const handleSaveProfile = (updatedUser: Partial<User>) => {
        updateUser(updatedUser);
    };

    const handleVerify = async () => {
        setVerificationError(null);
        try {
            await new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (Math.random() > 0.5) resolve('Success');
                    else reject(new Error('Document could not be processed.'));
                }, 1500);
            });

            setVerificationStatus('success');
            setTimeout(() => {
                updateUser({ isVerified: true });
                setVerifyModalOpen(false);
                setTimeout(() => setVerificationStatus('idle'), 500);
            }, 1500);

        } catch (error) {
            setVerificationError("Failed to verify. Please try again.");
        }
    };

    const userBadges = MOCK_BADGES.filter(badge => user.badges?.includes(badge.id));

    const InfoCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center mb-4">
                {icon}
                <h2 className="text-xl font-bold text-gray-800">{title}</h2>
            </div>
            {children}
        </div>
    );

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-1 space-y-8">
                <InfoCard title="Profile" icon={<UserIcon className="h-6 w-6 mr-3 text-gray-400"/>}>
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-800">{user.name}</h3>
                            <p className="text-gray-500">{user.email}</p>
                        </div>
                        <div className="flex items-center text-gray-700">
                            <MapPinIcon className="h-5 w-5 mr-3 text-gray-400"/>
                            <span>{user.location}</span>
                        </div>
                        {user.role === UserRole.DONOR && user.bloodType && (
                            <div className="flex items-center text-gray-700">
                                <BloodDropIcon className="h-5 w-5 mr-3 text-gray-400"/>
                                <span>Blood Type: <strong>{user.bloodType.group}{user.bloodType.rhFactor}</strong></span>
                            </div>
                        )}
                        <Button onClick={() => setEditModalOpen(true)} className="w-full mt-2">Edit Profile</Button>
                    </div>
                </InfoCard>

                 {user.role === UserRole.DONOR && (
                    <InfoCard title="Donation Status" icon={<HeartIcon className="h-6 w-6 mr-3 text-gray-400"/>}>
                        <div className="space-y-4">
                            {user.isAvailable ? (
                                <Alert type="success" title="Available to Donate" message="Your status is set to available. Thank you for being ready to save a life!" />
                            ) : (
                                <Alert type="warning" title="Currently Deferred" message={user.deferralReason || 'You are marked as unavailable for donation.'} />
                            )}
                            <Button variant="secondary" onClick={() => navigate('/health-check')} className="w-full">
                                Update via Health Check
                            </Button>
                        </div>
                    </InfoCard>
                )}
            </div>

            {/* Right Column */}
            <div className="lg:col-span-2 space-y-8">
                 {user.role === UserRole.DONOR && (
                    <InfoCard title="Achievements" icon={<TrophyIcon className="h-6 w-6 mr-3 text-gray-400"/>}>
                        <div className="text-center mb-6">
                            <p className="text-sm text-gray-500 uppercase font-medium">Total Points</p>
                            <p className="text-6xl font-bold text-primary">{user.points}</p>
                        </div>

                        <hr className="my-4" />
                        
                        <h3 className="font-semibold text-gray-700 mb-3 text-center">Earned Badges</h3>
                        {userBadges.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {userBadges.map(badge => (
                                    <div key={badge.id} className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                                        <badge.icon className="h-8 w-8 text-primary mr-4"/>
                                        <div>
                                            <p className="font-bold text-gray-800">{badge.name}</p>
                                            <p className="text-sm text-gray-600">{badge.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-gray-500">Start donating to earn badges!</p>
                        )}
                    </InfoCard>
                )}

                <InfoCard title="Verification" icon={<ShieldCheckIcon className="h-6 w-6 mr-3 text-gray-400"/>}>
                    {user.isVerified ? (
                        <Alert type="success" title="Profile Verified" message="Your identity and blood type have been confirmed, building a trusted community." />
                    ) : (
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
                            <div>
                                <h4 className="font-semibold text-blue-800">Get Verified</h4>
                                <p className="text-sm text-blue-700 mt-1">Increase trust by verifying your profile.</p>
                            </div>
                            <Button size="md" variant="secondary" onClick={() => { setVerifyModalOpen(true); setVerificationError(null); }}>Verify Now</Button>
                        </div>
                    )}
                </InfoCard>
            </div>
            
            <EditProfileModal isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)} user={user} onSave={handleSaveProfile} />
            <VerificationModal isOpen={isVerifyModalOpen} onClose={() => setVerifyModalOpen(false)} onVerify={handleVerify} status={verificationStatus} error={verificationError} />
        </div>
    );
};

export default ProfilePage;