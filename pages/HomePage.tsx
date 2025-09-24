import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types';
import { MOCK_REQUESTS } from '../constants';
import { useNavigate } from 'react-router-dom';
import BloodRequestCard from '../components/BloodRequestCard';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import HealthQuestionnaireModal from '../components/HealthQuestionnaireModal';
import { AnimatedHeartIcon } from '../components/icons/AnimatedHeartIcon';

const HomePage: React.FC = () => {
    const { user, updateUser } = useAuth();
    const navigate = useNavigate();
    const [isHealthModalOpen, setHealthModalOpen] = useState(false);
    const [healthCheckResult, setHealthCheckResult] = useState<{ eligible: boolean, message: string } | null>(null);
    const [isMounted, setIsMounted] = useState(false); // For animation

    useEffect(() => {
        const timer = setTimeout(() => setIsMounted(true), 100); // Trigger animation after component mounts
        return () => clearTimeout(timer);
    }, []);


    const handleRespondToRequest = (requestId: string) => {
        console.log(`Responding to request ${requestId}`);
        if (user && !user.isAvailable) {
            setHealthModalOpen(true);
        } else {
             alert("You are eligible to donate! Your response has been noted. (Demo)");
        }
    };

    const handleHealthCheckComplete = (result: { eligible: boolean; reason: string | null }) => {
        setHealthModalOpen(false);
        if (result.eligible) {
            updateUser({ isAvailable: true, deferralReason: null });
            setHealthCheckResult({ eligible: true, message: "You're eligible to donate! You can now respond to requests." });
        } else {
            updateUser({ isAvailable: false, deferralReason: result.reason });
            setHealthCheckResult({ eligible: false, message: `You are temporarily deferred. Reason: ${result.reason}` });
        }
        setTimeout(() => setHealthCheckResult(null), 6000);
    };

    // Filter data for display
    const recentRequests = MOCK_REQUESTS.slice(0, 3);

    const renderDonorDashboard = () => (
        <div className="space-y-8">
            {healthCheckResult && (
                <Alert
                    type={healthCheckResult.eligible ? 'success' : 'warning'}
                    title={healthCheckResult.eligible ? 'Health Check Complete' : 'Health Check Result'}
                    message={healthCheckResult.message}
                    onClose={() => setHealthCheckResult(null)}
                />
            )}
            
            <div className={`bg-white p-6 rounded-xl shadow-sm border border-gray-200 transition-all duration-700 ease-out ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
                <div className="flex justify-between items-center flex-wrap gap-4">
                    <div className="flex items-center space-x-4">
                        <AnimatedHeartIcon className="h-12 w-12 text-primary/70 animate-pulse-heart hidden sm:block" />
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Welcome back, {user.name}!</h1>
                            <p className="text-gray-600 mt-1">Ready to be a hero today?</p>
                        </div>
                    </div>
                    {user.isAvailable ? (
                        <div className="text-right">
                           <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 ring-1 ring-inset ring-green-600/20">
                                Available to Donate
                            </span>
                        </div>
                    ) : (
                        <Button onClick={() => navigate('/health-check')}>Check Eligibility</Button>
                    )}
                </div>
            </div>

            <div className={`transition-all duration-700 ease-out delay-150 ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Urgent Requests</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recentRequests.map((request, index) => (
                        <div 
                            key={request.id} 
                            className={`transition-all duration-500 ease-out ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                            style={{ transitionDelay: `${150 + index * 100}ms`}}
                        >
                            <BloodRequestCard request={request} onRespond={handleRespondToRequest} />
                        </div>
                    ))}
                </div>
            </div>

             <HealthQuestionnaireModal 
                isOpen={isHealthModalOpen} 
                onClose={() => setHealthModalOpen(false)}
                onComplete={handleHealthCheckComplete} 
            />
        </div>
    );
    
    const renderRequesterDashboard = () => (
         <div className="space-y-8">
            <div className={`bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center transition-all duration-700 ease-out ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
                 <AnimatedHeartIcon className="h-16 w-16 text-primary/80 mx-auto animate-pulse-heart mb-4" />
                 <h1 className="text-3xl font-bold text-gray-800">Welcome, {user.name}</h1>
                <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
                    Find available blood donors in your area quickly and efficiently. Your next search could save a life.
                </p>
                 <Button size="lg" className="mt-6" onClick={() => navigate('/search')}>
                    Find a Donor Now
                </Button>
            </div>
            
            <div className={`transition-all duration-700 ease-out delay-150 ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Active Requests</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {MOCK_REQUESTS.filter(r => r.requester.id === user.id || user.id === 'requester-456').slice(0,3).map((request, index) => (
                       <div 
                           key={request.id} 
                           className={`bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition-shadow transition-all duration-500 ease-out ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                           style={{ transitionDelay: `${150 + index * 100}ms`}}
                        >
                           <div className="flex justify-between items-center">
                            <p className="font-bold text-lg text-primary">{request.bloodType.group}{request.bloodType.rhFactor}</p>
                            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">{request.urgency}</span>
                           </div>
                           <p className="font-semibold mt-2">{request.unitsRequired} {request.unitsRequired > 1 ? 'Units' : 'Unit'} Needed</p>
                           <p className="text-sm text-gray-600 mt-1">{request.location}</p>
                       </div>
                   ))}
                </div>
            </div>
        </div>
    );

    return (
        <>
            {user.role === UserRole.DONOR ? renderDonorDashboard() : renderRequesterDashboard()}
        </>
    );
};

export default HomePage;