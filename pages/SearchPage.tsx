import React, { useState, useMemo } from 'react';
import { MOCK_DONORS, MOCK_CHAT_SESSIONS } from '../constants';
import { User, BloodGroup, RhFactor, DonationStatus, ChatSession, ChatMessage } from '../types';
import DonorCard from '../components/DonorCard';
import AppointmentModal from '../components/AppointmentModal';
import Alert from '../components/common/Alert';
import { MOCK_DONATION_HISTORY } from '../constants';
import { useAuth } from '../hooks/useAuth';
import ChatModal from '../components/ChatModal';
import { generateSmartReplies } from '../services/geminiService';


const SearchPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [donors, setDonors] = useState<User[]>(MOCK_DONORS);
  const [filters, setFilters] = useState({
    bloodGroup: '',
    rhFactor: '',
    location: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState<User | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string; title: string } | null>(null);

  // Chat state
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [activeChatSession, setActiveChatSession] = useState<ChatSession | null>(null);
  const [chatError, setChatError] = useState<string | null>(null);
  const [smartReplies, setSmartReplies] = useState<string[]>([]);
  const [isGeneratingReplies, setIsGeneratingReplies] = useState(false);


  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setFeedback(null); // Clear feedback on new search
  };

  const filteredDonors = useMemo(() => {
    return donors.filter(donor => {
      const bloodTypeMatch = 
        (!filters.bloodGroup || donor.bloodType?.group === filters.bloodGroup) &&
        (!filters.rhFactor || donor.bloodType?.rhFactor === filters.rhFactor);
      const locationMatch = !filters.location || donor.location.toLowerCase().includes(filters.location.toLowerCase());
      return bloodTypeMatch && locationMatch;
    });
  }, [filters, donors]);

  const handleScheduleClick = (donor: User) => {
    setSelectedDonor(donor);
    setIsModalOpen(true);
    setFeedback(null);
  };
  
  const handleChatClick = (donor: User) => {
    // Find an existing chat session or create a new one
    let session = MOCK_CHAT_SESSIONS.find(s => 
      s.participants.some(p => p.id === currentUser.id) &&
      s.participants.some(p => p.id === donor.id)
    );

    if (!session) {
      session = {
        id: `chat-${Date.now()}`,
        participants: [currentUser, donor],
        messages: [],
      };
      MOCK_CHAT_SESSIONS.push(session);
    }
    
    setSelectedDonor(donor);
    setActiveChatSession(session);
    setIsChatModalOpen(true);
    setSmartReplies([]); // Clear previous replies
  };

  const handleSendMessage = (text: string) => {
    if (!activeChatSession || !selectedDonor) return;

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      text,
      timestamp: new Date(),
    };

    const updatedSession = {
      ...activeChatSession,
      messages: [...activeChatSession.messages, newMessage],
    };
    setActiveChatSession(updatedSession);
    setSmartReplies([]); // Clear smart replies after sending a message

    // Simulate a reply from the donor
    setTimeout(() => {
      const replyMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        senderId: selectedDonor.id,
        text: "Thanks for reaching out! I'll get back to you shortly.",
        timestamp: new Date(),
      };
       setActiveChatSession(prev => prev ? { ...prev, messages: [...prev.messages, replyMessage] } : null);
    }, 2000);
  };
  
  const handleGenerateReplies = async () => {
      if (!activeChatSession || !selectedDonor) return;
      setIsGeneratingReplies(true);
      setSmartReplies([]);
      try {
        const replies = await generateSmartReplies(activeChatSession.messages, currentUser.name, selectedDonor.name);
        setSmartReplies(replies);
      } catch (error) {
        setChatError("Could not generate smart replies.");
      } finally {
        setIsGeneratingReplies(false);
      }
  };


  const handleScheduleSubmit = async (details: { date: string; time: string; notes: string }) => {
    if (!selectedDonor) return;
    
    setIsModalOpen(false);

    try {
      // Simulate API call that can fail
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() > 0.5) {
            resolve('Success');
          } else {
            reject(new Error('Network error. Could not reach server.'));
          }
        }, 1000);
      });

      const newAppointment = {
        id: `hist-${Date.now()}`,
        donorId: 'donor-123', // Assuming current user is Jane Doe for demo
        date: new Date(`${details.date}T${details.time}`),
        location: `Appointment with ${selectedDonor.name}`,
        bloodType: selectedDonor.bloodType!,
        units: 1,
        status: DonationStatus.SCHEDULED,
      };
      MOCK_DONATION_HISTORY.unshift(newAppointment);

      // Mark donor as unavailable
      setDonors(prevDonors => prevDonors.map(d => 
        d.id === selectedDonor.id ? { ...d, isAvailable: false, deferralReason: 'Appointment Scheduled' } : d
      ));

      setFeedback({
        type: 'success',
        title: 'Request Sent!',
        message: `Your donation request to ${selectedDonor.name} has been successfully sent. You can track this in your donation history.`
      });

    } catch (error) {
      console.error("Failed to schedule appointment:", error);
      setFeedback({
        type: 'error',
        title: 'Scheduling Failed',
        message: 'There was a problem sending your request. Please check your connection and try again.'
      });
    } finally {
        setSelectedDonor(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-800">Find a Donor</h1>
        <p className="text-gray-600 mt-1">Search for available blood donors in your area.</p>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="md:col-span-1">
            <label htmlFor="bloodGroup" className="block text-sm font-medium text-gray-700">Blood Group</label>
            <select id="bloodGroup" name="bloodGroup" value={filters.bloodGroup} onChange={handleFilterChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md">
              <option value="">Any</option>
              {Object.values(BloodGroup).map(group => <option key={group} value={group}>{group}</option>)}
            </select>
          </div>
          <div className="md:col-span-1">
            <label htmlFor="rhFactor" className="block text-sm font-medium text-gray-700">Rh Factor</label>
            <select id="rhFactor" name="rhFactor" value={filters.rhFactor} onChange={handleFilterChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md">
              <option value="">Any</option>
              {Object.values(RhFactor).map(factor => <option key={factor} value={factor}>{factor === '+' ? 'Positive (+)' : 'Negative (-)'}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
            <input type="text" id="location" name="location" value={filters.location} onChange={handleFilterChange} placeholder="e.g., Metropolis" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"/>
          </div>
        </div>
      </div>
      
      {feedback && (
        <Alert
          type={feedback.type}
          title={feedback.title}
          message={feedback.message}
          onClose={() => setFeedback(null)}
        />
      )}

      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          {filteredDonors.length} Donors Found
        </h3>
        {filteredDonors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDonors.map(donor => (
              <DonorCard key={donor.id} donor={donor} onScheduleClick={handleScheduleClick} onChatClick={handleChatClick} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500">No donors match your criteria. Please try broadening your search.</p>
          </div>
        )}
      </div>

      {selectedDonor && (
        <AppointmentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          donorName={selectedDonor.name}
          onSchedule={handleScheduleSubmit}
        />
      )}
      
      {activeChatSession && selectedDonor && (
        <ChatModal
          isOpen={isChatModalOpen}
          onClose={() => setIsChatModalOpen(false)}
          chatSession={activeChatSession}
          currentUser={currentUser}
          chatTargetName={selectedDonor.name}
          onSendMessage={handleSendMessage}
          error={chatError}
          onGenerateReplies={handleGenerateReplies}
          smartReplies={smartReplies}
          isGeneratingReplies={isGeneratingReplies}
        />
      )}
    </div>
  );
};

export default SearchPage;