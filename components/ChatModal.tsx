import React, { useState, useRef, useEffect } from 'react';
import Modal from './common/Modal';
import Button from './common/Button';
import { ChatSession, User } from '../types';
import { PaperAirplaneIcon } from './icons/PaperAirplaneIcon';
import { SparklesIcon } from './icons/SparklesIcon';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  chatSession: ChatSession;
  currentUser: User;
  chatTargetName: string;
  onSendMessage: (text: string) => void;
  error?: string | null;
  onGenerateReplies: () => void;
  smartReplies: string[];
  isGeneratingReplies: boolean;
}

const ChatModal: React.FC<ChatModalProps> = ({ 
    isOpen, 
    onClose, 
    chatSession, 
    currentUser, 
    chatTargetName,
    onSendMessage, 
    error,
    onGenerateReplies,
    smartReplies,
    isGeneratingReplies
}) => {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [chatSession.messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };
  
  const handleSmartReplyClick = (reply: string) => {
    setMessage(reply);
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Chat with ${chatTargetName}`}>
      <div className="flex flex-col h-[60vh]">
        <div className="flex-grow overflow-y-auto p-4 bg-gray-100 rounded-md space-y-4">
          {chatSession.messages.map((msg) => {
            const isCurrentUser = msg.senderId === currentUser.id;
            return (
              <div key={msg.id} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-xl ${
                    isCurrentUser ? 'bg-primary text-white rounded-br-lg' : 'bg-white text-gray-800 shadow-sm rounded-bl-lg'
                }`}>
                  <p className="text-sm">{msg.text}</p>
                  <p className="text-xs text-right mt-1 opacity-75">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="pt-2 mt-2 border-t">
          {isGeneratingReplies && (
              <p className="text-sm text-center text-gray-500 animate-pulse">Generating smart replies...</p>
          )}
          {smartReplies.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
                {smartReplies.map((reply, index) => (
                    <button key={index} onClick={() => handleSmartReplyClick(reply)} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200 transition-colors">
                        {reply}
                    </button>
                ))}
            </div>
          )}
        </div>

        <div className="mt-auto">
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <Button type="button" variant="ghost" size="md" onClick={onGenerateReplies} disabled={isGeneratingReplies} aria-label="Generate Smart Replies">
                <SparklesIcon className="h-5 w-5 text-secondary" />
            </Button>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-grow border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
              autoFocus
            />
            <Button type="submit" size="md">
                <PaperAirplaneIcon className="h-5 w-5" />
                <span className="sr-only">Send</span>
            </Button>
          </form>
          {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
        </div>
      </div>
    </Modal>
  );
};

export default ChatModal;
