
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white mt-auto">
      <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} VitalFlow. All rights reserved. Saving lives, one drop at a time.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
