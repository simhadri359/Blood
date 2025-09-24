// FIX: Implemented the AppointmentModal component to resolve reference errors.
import React, { useState } from 'react';
import Modal from './common/Modal';
import Button from './common/Button';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  donorName: string;
  onSchedule: (details: { date: string; time: string; notes: string }) => void;
}

const AppointmentModal: React.FC<AppointmentModalProps> = ({ isOpen, onClose, donorName, onSchedule }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time) {
      alert('Please select a date and time.');
      return;
    }
    onSchedule({ date, time, notes });
    // Reset fields after submission
    setDate('');
    setTime('');
    setNotes('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Request Donation from ${donorName}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            Preferred Date
          </label>
          <input
            type="date"
            name="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
            min={new Date().toISOString().split("T")[0]}
          />
        </div>
        <div>
          <label htmlFor="time" className="block text-sm font-medium text-gray-700">
            Preferred Time
          </label>
          <input
            type="time"
            name="time"
            id="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
          />
        </div>
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Additional Notes (Optional)
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
            placeholder={`e.g., Urgency, contact information, specific hospital.`}
          ></textarea>
        </div>
        <div className="flex justify-end space-x-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            Send Request
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AppointmentModal;