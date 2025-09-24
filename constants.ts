// FIX: Created constants file with mock data to resolve multiple "not a module" and "Cannot find name" errors across the application.
import {
  User,
  UserRole,
  BloodGroup,
  RhFactor,
  DonationRequest,
  BloodDriveEvent,
  Donation,
  DonationStatus,
  Badge,
  ChatSession,
} from './types';
import { MedalIcon } from './components/icons/MedalIcon';
import { StarIcon } from './components/icons/StarIcon';
import { HeartIcon } from './components/icons/HeartIcon';

export const MOCK_DONOR_USER: User = {
  id: 'donor-123',
  name: 'Jane Doe',
  email: 'jane.doe@example.com',
  location: 'Metropolis',
  role: UserRole.DONOR,
  bloodType: { group: BloodGroup.O, rhFactor: RhFactor.POSITIVE },
  isAvailable: true,
  isVerified: true,
  badges: ['first-donation', 'five-donations'],
  points: 250,
};

export const MOCK_REQUESTER_USER: User = {
  id: 'requester-456',
  name: 'Metropolis General Hospital',
  email: 'contact@mgh.org',
  location: 'Metropolis',
  role: UserRole.REQUESTER,
  isVerified: true,
  points: 0,
};

export const MOCK_DONORS: User[] = [
  MOCK_DONOR_USER,
  {
    id: 'donor-2',
    name: 'John Smith',
    email: 'john.smith@example.com',
    location: 'Metropolis',
    role: UserRole.DONOR,
    bloodType: { group: BloodGroup.A, rhFactor: RhFactor.NEGATIVE },
    isAvailable: true,
    isVerified: true,
    points: 500,
    badges: ['first-donation', 'five-donations', 'ten-donations'],
  },
  {
    id: 'donor-3',
    name: 'Emily Johnson',
    email: 'emily.j@example.com',
    location: 'Gotham City',
    role: UserRole.DONOR,
    bloodType: { group: BloodGroup.B, rhFactor: RhFactor.POSITIVE },
    isAvailable: false,
    deferralReason: 'Recently traveled',
    isVerified: false,
    points: 50,
    badges: ['first-donation'],
  },
  {
    id: 'donor-4',
    name: 'Michael Brown',
    email: 'michael.b@example.com',
    location: 'Metropolis',
    role: UserRole.DONOR,
    bloodType: { group: BloodGroup.AB, rhFactor: RhFactor.POSITIVE },
    isAvailable: true,
    isVerified: true,
    points: 100,
    badges: ['first-donation'],
  },
];

export const MOCK_REQUESTS: DonationRequest[] = [
  {
    id: 'req-1',
    requester: MOCK_REQUESTER_USER,
    bloodType: { group: BloodGroup.O, rhFactor: RhFactor.NEGATIVE },
    unitsRequired: 2,
    location: 'Metropolis General Hospital',
    urgency: 'Critical',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    note: 'Emergency surgery for a trauma patient. O-negative blood is urgently needed.',
    pointsOffered: 150,
  },
  {
    id: 'req-2',
    requester: { ...MOCK_REQUESTER_USER, name: 'City Blood Bank' },
    bloodType: { group: BloodGroup.A, rhFactor: RhFactor.POSITIVE },
    unitsRequired: 5,
    location: 'City Blood Bank',
    urgency: 'High',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    note: 'Stock levels for A+ are critically low. All donors are welcome.',
    pointsOffered: 100,
  },
  {
    id: 'req-3',
    requester: MOCK_REQUESTER_USER,
    bloodType: { group: BloodGroup.B, rhFactor: RhFactor.NEGATIVE },
    unitsRequired: 1,
    location: 'Metropolis General Hospital',
    urgency: 'Medium',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    pointsOffered: 75,
  },
];

export const MOCK_EVENTS: BloodDriveEvent[] = [
  {
    id: 'event-1',
    title: 'Community Heroes Blood Drive',
    description: 'Join us and be a hero! Every donation saves lives. We will have snacks and music.',
    location: 'Metropolis City Hall',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
    organizer: 'Metropolis Red Cross',
  },
  {
    id: 'event-2',
    title: 'University Challenge Blood Drive',
    description: 'Support your university and save lives! The college with the most donations wins bragging rights.',
    location: 'Metropolis University Campus',
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
    organizer: 'Metropolis University',
  },
];

export let MOCK_DONATION_HISTORY: Donation[] = [
  {
    id: 'hist-1',
    donorId: 'donor-123',
    date: new Date('2024-05-20T10:00:00'),
    location: 'Metropolis General Hospital',
    bloodType: { group: BloodGroup.O, rhFactor: RhFactor.POSITIVE },
    units: 1,
    status: DonationStatus.COMPLETED,
  },
  {
    id: 'hist-2',
    donorId: 'donor-123',
    date: new Date('2024-01-15T14:30:00'),
    location: 'City Blood Bank',
    bloodType: { group: BloodGroup.O, rhFactor: RhFactor.POSITIVE },
    units: 1,
    status: DonationStatus.COMPLETED,
  },
  {
    id: 'hist-3',
    donorId: 'donor-123',
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    location: 'Appointment with John Smith',
    bloodType: { group: BloodGroup.A, rhFactor: RhFactor.NEGATIVE },
    units: 1,
    status: DonationStatus.SCHEDULED,
  },
];

export const MOCK_BADGES: Badge[] = [
    {
        id: 'first-donation',
        name: 'First Drop',
        description: 'You made your first donation!',
        icon: MedalIcon,
    },
    {
        id: 'five-donations',
        name: 'Life Saver',
        description: 'You have donated 5 times.',
        icon: StarIcon,
    },
    {
        id: 'ten-donations',
        name: 'Community Hero',
        description: 'You have donated 10 times.',
        icon: HeartIcon,
    }
];

export const MOCK_CHAT_SESSIONS: ChatSession[] = [
  {
    id: 'chat-session-1',
    participants: [MOCK_REQUESTER_USER, MOCK_DONOR_USER],
    messages: [
      {
        id: 'msg-1',
        senderId: 'requester-456',
        text: 'Hello Jane, we have an urgent need for O+ blood at Metropolis General. Would you be available to donate today?',
        timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 mins ago
      },
      {
        id: 'msg-2',
        senderId: 'donor-123',
        text: 'Hi there! I am available. What time would be best?',
        timestamp: new Date(Date.now() - 8 * 60 * 1000), // 8 mins ago
      },
       {
        id: 'msg-3',
        senderId: 'requester-456',
        text: 'That\'s wonderful to hear. Anytime before 5 PM would be a great help to the patient.',
        timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 mins ago
      },
    ]
  }
];
