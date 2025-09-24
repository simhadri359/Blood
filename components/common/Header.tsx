import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { BloodDropIcon } from '../icons/BloodDropIcon';
import { UserIcon } from '../icons/UserIcon';
import { UserRole } from '../../types';
import Button from './Button';

const Header: React.FC = () => {
  const { user, switchRole } = useAuth();

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `text-gray-600 hover:text-primary transition-colors font-medium pb-1 ${isActive ? 'text-primary border-b-2 border-primary' : 'border-b-2 border-transparent'}`;

  return (
    <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <NavLink to="/" className="flex items-center space-x-2">
            <BloodDropIcon className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-gray-800">VitalFlow</span>
          </NavLink>
          <nav className="hidden md:flex items-center space-x-8 h-full">
            <NavLink to="/" className={navLinkClasses} end>Home</NavLink>
            {user.role === UserRole.REQUESTER &&
                <NavLink to="/search" className={navLinkClasses}>Find Donors</NavLink>
            }
            <NavLink to="/events" className={navLinkClasses}>Events</NavLink>
            {user.role === UserRole.DONOR &&
                <NavLink to="/donation-history" className={navLinkClasses}>History</NavLink>
            }
          </nav>
          <div className="flex items-center space-x-4">
            <NavLink to="/profile" className="flex items-center space-x-3 text-gray-700 hover:text-primary transition-colors group">
              <span className="font-medium hidden sm:inline text-gray-600 group-hover:text-primary">{user.name}</span>
              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center ring-2 ring-transparent group-hover:ring-primary/50 transition-all">
                  <UserIcon className="h-6 w-6 text-gray-500" />
              </div>
            </NavLink>
            <Button variant="ghost" size="sm" onClick={switchRole}>Switch Role</Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;