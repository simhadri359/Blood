import React, { createContext, useState, ReactNode } from 'react';
import { UserRole, type User } from '../types';
import { MOCK_DONOR_USER, MOCK_REQUESTER_USER } from '../constants';

interface AuthContextType {
  user: User;
  updateUser: (updatedUser: Partial<User>) => void;
  switchRole: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize with a default user since there is no login flow.
  // Default to Requester to showcase chat features.
  const [user, setUser] = useState<User>(MOCK_REQUESTER_USER);

  const updateUser = (updatedFields: Partial<User>) => {
    setUser(prevUser => ({ ...prevUser, ...updatedFields }));
  };

  const switchRole = () => {
    setUser(currentUser =>
      currentUser.role === UserRole.DONOR ? MOCK_REQUESTER_USER : MOCK_DONOR_USER
    );
  };

  return (
    <AuthContext.Provider value={{ user, updateUser, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};