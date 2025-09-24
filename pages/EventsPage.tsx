import React, { useState } from 'react';
import { MOCK_EVENTS } from '../constants';
import { BloodDriveEvent } from '../types';
import EventCard from '../components/EventCard';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { generateEventDescription } from '../services/geminiService';

const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<BloodDriveEvent[]>(MOCK_EVENTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    theme: '',
    description: '',
    location: '',
    date: '',
    organizer: '',
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerateDescription = async () => {
    if (!newEvent.theme) {
      alert("Please enter a theme to generate a description.");
      return;
    }
    setIsGenerating(true);
    try {
      const description = await generateEventDescription(newEvent.theme);
      setNewEvent(prev => ({ ...prev, description }));
    } catch (error) {
      console.error("Failed to generate description:", error);
      alert("Failed to generate description. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.description || !newEvent.location || !newEvent.date || !newEvent.organizer) {
        alert("Please fill out all fields.");
        return;
    }
    const createdEvent: BloodDriveEvent = {
      id: `event-${Date.now()}`,
      title: newEvent.title,
      description: newEvent.description,
      location: newEvent.location,
      date: new Date(newEvent.date),
      organizer: newEvent.organizer,
    };
    setEvents(prev => [createdEvent, ...prev]);
    setIsModalOpen(false);
    // Reset form
    setNewEvent({
      title: '',
      theme: '',
      description: '',
      location: '',
      date: '',
      organizer: '',
    });
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Blood Drive Events</h1>
          <p className="text-gray-600 mt-1">Find an upcoming blood drive or create your own to support the community.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>Create Event</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map(event => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create a New Blood Drive Event">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Event Title</label>
            <input type="text" id="title" name="title" value={newEvent.title} onChange={handleInputChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary" />
          </div>

          <div className="space-y-2">
            <label htmlFor="theme" className="block text-sm font-medium text-gray-700">Event Theme (for AI Description)</label>
            <div className="flex items-center space-x-2">
                 <input type="text" id="theme" name="theme" value={newEvent.theme} onChange={handleInputChange} placeholder="e.g., Superhero Day, Holiday Spirit" className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary" />
                 <Button type="button" variant="secondary" onClick={handleGenerateDescription} isLoading={isGenerating}>
                    Generate
                </Button>
            </div>
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea id="description" name="description" value={newEvent.description} onChange={handleInputChange} required rows={3} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"></textarea>
            {isGenerating && <p className="text-sm text-gray-500 mt-1 animate-pulse">Generating with AI...</p>}
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
            <input type="text" id="location" name="location" value={newEvent.location} onChange={handleInputChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary" />
          </div>

           <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date & Time</label>
              <input type="datetime-local" id="date" name="date" value={newEvent.date} onChange={handleInputChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary" />
            </div>
            <div>
              <label htmlFor="organizer" className="block text-sm font-medium text-gray-700">Organizer</label>
              <input type="text" id="organizer" name="organizer" value={newEvent.organizer} onChange={handleInputChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary" />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-2 border-t border-gray-200 mt-6">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Create Event</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default EventsPage;