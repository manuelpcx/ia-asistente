
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChatMessage, Appointment, AppointmentDetails } from '../../types';
import ChatMessageBubble from './ChatMessageBubble';
import ChatInput from './ChatInput';
import { getAppointmentDetailsFromText } from '../../services/geminiService';

interface ChatAssistantProps {
  onScheduleAppointment: (newAppointment: Omit<Appointment, 'id' | 'category' | 'description'>) => Promise<void>;
}

const ChatAssistant: React.FC<ChatAssistantProps> = ({ onScheduleAppointment }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'init', text: "Hello! I'm your scheduling assistant. I can add events to your Google Calendar. How can I help?", sender: 'ai' },
  ]);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isAiTyping]);

  const addAiMessage = useCallback((text: string) => {
    const aiMessage: ChatMessage = { id: `ai_${Date.now()}`, text, sender: 'ai' };
    setMessages(prev => [...prev, aiMessage]);
    setIsAiTyping(false);
  }, []);

  const handleSendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    const userMessage: ChatMessage = { id: `user_${Date.now()}`, text, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setIsAiTyping(true);

    const result = await getAppointmentDetailsFromText(text);
    
    if ('error' in result) {
        addAiMessage(result.error);
        return;
    } 
    
    const details: AppointmentDetails = result;
    if (details.isReadyToSchedule && details.title && details.date && details.time) {
        const newAppointment = {
            title: details.title,
            date: `${details.date}T${details.time}`,
            attendees: details.attendees || [],
        };
        try {
            await onScheduleAppointment(newAppointment);
            addAiMessage(`Great! I've added "${details.title}" to your Google Calendar for ${details.date} at ${details.time}.`);
        } catch (error) {
            const errorMessage = error instanceof Error 
                ? error.message 
                : "Sorry, I couldn't schedule the appointment. An unknown error occurred.";
            addAiMessage(errorMessage);
        }
    } else if (details.clarificationQuestion) {
        addAiMessage(details.clarificationQuestion);
    } else {
        addAiMessage("I'm not sure how to help with that. Could you please provide appointment details like a title, date, and time?");
    }

  }, [onScheduleAppointment, addAiMessage]);

  return (
    <div className="flex flex-col h-full bg-slate-800 rounded-lg">
       <div className="p-4 border-b border-slate-700">
            <h2 className="text-xl font-semibold text-white">Scheduling Assistant</h2>
            <p className="text-sm text-slate-400">Chat via simulated WhatsApp</p>
        </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-cover bg-center" style={{backgroundImage: "url('https://i.pinimg.com/736x/8c/98/99/8c98994518b575bfd8c949e91d20548b.jpg')"}}>
        {messages.map((msg) => (
          <ChatMessageBubble key={msg.id} message={msg} />
        ))}
        {isAiTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-700 rounded-lg px-4 py-2 text-white max-w-sm">
                <div className="flex items-center justify-center space-x-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
                </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-2 border-t border-slate-700">
        <ChatInput onSendMessage={handleSendMessage} disabled={isAiTyping} />
      </div>
    </div>
  );
};

export default ChatAssistant;