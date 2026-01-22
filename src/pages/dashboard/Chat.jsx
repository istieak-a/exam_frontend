'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

// Mock global messages - replace with real backend data
const mockGlobalMessages = [
  {
    id: 1,
    user: { name: 'Dr. Johnson', role: 'teacher' },
    text: 'Welcome everyone! Feel free to ask any questions about the upcoming exam.',
    time: '10:30 AM',
    isOwn: false,
  },
  {
    id: 2,
    user: { name: 'Sarah Williams', role: 'student' },
    text: 'What topics will be covered in the exam?',
    time: '10:35 AM',
    isOwn: false,
  },
  {
    id: 3,
    user: { name: 'Dr. Johnson', role: 'teacher' },
    text: 'We will cover chapters 1-5, with a focus on problem-solving techniques.',
    time: '10:37 AM',
    isOwn: false,
  },
  {
    id: 4,
    user: { name: 'John Doe', role: 'student' },
    text: 'Is the study guide available?',
    time: '10:40 AM',
    isOwn: false,
  },
];

export default function Chat() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [onlineCount] = useState(42); // Mock online count

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setMessages(mockGlobalMessages);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    
    const newMessage = {
      id: Date.now(),
      user: { name: user?.name || 'You', role: user?.role || 'student' },
      text: messageInput,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      isOwn: true,
      isNew: true,
    };
    
    setMessages([...messages, newMessage]);
    setMessageInput('');
    
    // Remove the "new" flag after animation
    setTimeout(() => {
      setMessages(prev => prev.map(msg => ({ ...msg, isNew: false })));
    }, 300);
    // In a real app, this would send the message to the backend
  };

  if (isLoading) {
    return <PageSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Global Chat</h1>
        <p className="mt-1 text-sm text-slate-600">
          Connect with everyone in the community
        </p>
      </div>

      {/* Global Chat Container */}
      <div className="flex h-[700px] flex-col rounded-2xl bg-white shadow-lg ring-1 ring-slate-200/80 overflow-hidden">
        {/* Chat Header */}
        <div className="flex items-center gap-3 border-b border-slate-200/80 bg-gradient-to-r from-[#F0F9FF] to-white p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary shadow-sm">
            <span className="material-symbols-outlined text-xl text-white">groups</span>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-slate-900">Community Chat</h3>
            <p className="text-xs text-slate-500">
              {onlineCount} participants
            </p>
          </div>
          <button className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600">
            <span className="material-symbols-outlined">more_vert</span>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex animate-in fade-in slide-in-from-bottom-4 duration-300 ${message.isOwn ? 'justify-end' : 'justify-start'}`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className={`flex gap-3 max-w-[80%] ${message.isOwn ? 'flex-row-reverse' : ''}`}>
                {!message.isOwn && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-blue-400 text-xs font-bold text-white shadow-sm">
                    {message.user.name.split(' ').map(n => n[0]).join('')}
                  </div>
                )}
                <div>
                  {!message.isOwn && (
                    <p className="mb-1 text-xs font-medium text-slate-700">
                      {message.user.name}
                      <span className={`ml-1.5 inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium ${
                        message.user.role === 'teacher' 
                          ? 'bg-primary/10 text-primary' 
                          : 'bg-blue-50 text-blue-600'
                      }`}>
                        {message.user.role === 'teacher' ? '👨‍🏫 Teacher' : '👨‍🎓 Student'}
                      </span>
                    </p>
                  )}
                  <div
                    className={`rounded-2xl px-4 py-2.5 shadow-sm transition-all ${
                      message.isOwn
                        ? 'bg-primary text-white'
                        : 'bg-[#F0F9FF] text-slate-900 border border-blue-100'
                    } ${message.isNew ? 'scale-95 opacity-0 animate-in' : ''}`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p
                      className={`mt-1 text-xs ${
                        message.isOwn ? 'text-primary-foreground/70' : 'text-slate-500'
                      }`}
                    >
                      {message.time}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <form onSubmit={handleSendMessage} className="border-t border-slate-200/80 p-4">
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Type a message to everyone..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
            <button
              type="submit"
              disabled={!messageInput.trim()}
              className="flex items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-medium text-white shadow-sm transition-all hover:bg-primary/90 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-sm"
            >
              <span className="material-symbols-outlined text-xl">send</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function PageSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-8 w-48 rounded bg-slate-200 animate-pulse" />
        <div className="mt-2 h-4 w-64 rounded bg-slate-200 animate-pulse" />
      </div>
      <div className="h-[700px] rounded-2xl bg-slate-200 animate-pulse" />
    </div>
  );
}
