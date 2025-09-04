
import React from 'react';
import { ChatMessage } from '../../types';

interface ChatMessageBubbleProps {
  message: ChatMessage;
}

const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  
  const bubbleClasses = isUser
    ? 'bg-[#005C4B] text-white self-end'
    : 'bg-slate-700 text-slate-200 self-start';

  const containerClasses = isUser ? 'flex justify-end' : 'flex justify-start';

  return (
    <div className={containerClasses}>
      <div className={`rounded-xl px-4 py-2 max-w-sm md:max-w-md shadow-md ${bubbleClasses}`}>
        <p className="text-sm whitespace-pre-wrap">{message.text}</p>
      </div>
    </div>
  );
};

export default ChatMessageBubble;
