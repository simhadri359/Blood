
// FIX: Imported React to resolve namespace error for React.FC.
import React, { SVGProps } from 'react';

export enum UserRole {
  DONOR = 'DONOR',
  REQUESTER = 'REQUESTER',
}

export enum BloodGroup {
  A = 'A',
  B = 'B',
  AB = 'AB',
  O = 'O',
}

export enum RhFactor {
  POSITIVE = '+',
  NEGATIVE = '-',
}

export interface BloodType {
  group: BloodGroup;
  rhFactor: RhFactor;
}

export enum DonationStatus {
  SCHEDULED = 'Scheduled',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
}

export interface User {
  id: string;
  name: string;
  email: string;
  location: string;
  role: UserRole;
  bloodType?: BloodType;
  isAvailable?: boolean;
  deferralReason?: string | null;
  isVerified: boolean;
  badges?: string[];
  points: number;
}

export interface DonationRequest {
  id: string;
  requester: User;
  bloodType: BloodType;
  unitsRequired: number;
  location: string;
  urgency: 'Critical' | 'High' | 'Medium' | 'Low';
  createdAt: Date;
  note?: string;
  pointsOffered: number;
}

export interface BloodDriveEvent {
  id: string;
  title: string;
  description: string;
  location: string;
  date: Date;
  organizer: string;
}

export interface Donation {
  id: string;
  donorId: string;
  date: Date;
  location: string;
  bloodType: BloodType;
  units: number;
  status: DonationStatus;
}

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: React.FC<SVGProps<SVGSVGElement>>;
}

export interface ChatMessage {
    id: string;
    senderId: string;
    text: string;
    timestamp: Date;
}

export interface ChatSession {
    id: string;
    participants: User[];
    messages: ChatMessage[];
}