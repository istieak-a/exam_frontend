'use client';

import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { chatMessages, chatUsers } from '../../data/mockData';

const seedThread = chatMessages['user-001'] || [];
const seedUserLookup = Object.fromEntries(chatUsers.map((u) => [u.id, u]));

const buildSeedMessages = (currentUserId) =>
  seedThread.map((m, index) => {
    const senderInfo = seedUserLookup[m.sender];
    return {
      id: m.id || `seed-${index}`,
      user: {
        name: senderInfo?.name || (m.isOwn ? 'You' : 'Member'),
        role: senderInfo?.role || 'student',
      },
      text: m.text,
      time: m.time,
      isOwn: m.isOwn,
      timestamp: Date.now() - (seedThread.length - index) * 60_000,
      isNew: false,
      ownerId: m.isOwn ? currentUserId : m.sender,
    };
  });

export default function Chat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState(() => buildSeedMessages(user?.id));
  const [messageInput, setMessageInput] = useState('');
  const scrollContainerRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, []);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    const timestamp = Date.now();
    const newMessage = {
      id: `local-${timestamp}`,
      user: {
        name: user?.fullName || user?.name || 'You',
        role: (user?.role || 'student').toLowerCase(),
      },
      text: messageInput.trim(),
      time: formatTime(timestamp),
      isOwn: true,
      timestamp,
      isNew: true,
      ownerId: user?.id,
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessageInput('');
    setTimeout(scrollToBottom, 100);
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) => (msg.id === newMessage.id ? { ...msg, isNew: false } : msg)),
      );
    }, 300);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-[32px] leading-tight tracking-[-0.02em] text-ink">Global Chat</h1>
        <p className="mt-1 text-sm text-body">Connect with everyone in the community</p>
      </div>

      {/* Global Chat Container */}
      <div className="flex h-[700px] flex-col rounded-lg bg-canvas shadow-lg border border-hairline overflow-hidden">
        {/* Chat Header */}
        <div className="flex items-center gap-3 border-b border-hairline/80 bg-surface-soft p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary shadow-sm">
            <span className="material-symbols-outlined text-xl text-on-primary">groups</span>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-ink">Community Chat</h3>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-success" />
              <p className="text-xs text-muted">Connected</p>
            </div>
          </div>
          <button className="rounded-lg p-2 text-muted-soft transition-colors hover:bg-surface-card hover:text-body">
            <span className="material-symbols-outlined">more_vert</span>
          </button>
        </div>

        {/* Messages */}
        <div
          ref={scrollContainerRef}
          className="flex-1 space-y-6 overflow-y-auto p-4 bg-surface-soft"
        >
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center text-center">
              <div className="max-w-sm rounded-lg bg-canvas p-8 border border-hairline-soft">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <span className="material-symbols-outlined text-3xl text-primary">chat_bubble</span>
                </div>
                <h3 className="font-display text-[20px] leading-tight tracking-[-0.015em] text-ink">Welcome to Global Chat!</h3>
                <p className="mt-2 text-sm text-muted">
                  This is the place to connect with everyone. Say hello and start a conversation!
                </p>
              </div>
            </div>
          ) : (
            messages.map((message, index) => {
              const isLastInGroup = index === messages.length - 1 || messages[index + 1].user.name !== message.user.name;

              return (
                <div
                  key={message.id}
                  className={`flex animate-in fade-in slide-in-from-bottom-2 duration-300 ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-3 max-w-[85%] ${message.isOwn ? 'flex-row-reverse' : ''}`}>
                    {/* Avatar */}
                    <div className={`flex-shrink-0 flex flex-col justify-end ${!isLastInGroup ? 'invisible' : ''}`}>
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium text-on-primary shadow-sm ring-1 ring-canvas ${
                         message.isOwn
                          ? 'bg-primary'
                          : message.user.role === 'teacher' ? 'bg-accent-teal' : 'bg-accent-teal/60'
                      }`}>
                        {message.user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                      </div>
                    </div>

                    <div className={`flex flex-col ${message.isOwn ? 'items-end' : 'items-start'}`}>
                      {/* Name - only show for first message in group of received messages */}
                      {!message.isOwn && (index === 0 || messages[index - 1].user.name !== message.user.name) && (
                        <div className="mb-1 ml-1 flex items-center gap-2">
                          <span className="text-xs font-semibold text-body-strong">{message.user.name}</span>
                          {message.user.role === 'teacher' && (
                            <span className="rounded-full bg-accent-teal/10 px-1.5 py-0.5 text-[10px] font-medium text-accent-teal ring-1 ring-inset border-accent-teal/15">
                              Teacher
                            </span>
                          )}
                        </div>
                      )}

                      {/* Message Bubble */}
                      <div
                        className={`group relative px-4 py-2.5 shadow-sm transition-all hover:shadow-md ${
                          message.isOwn
                            ? 'bg-primary text-on-primary rounded-lg rounded-tr-sm'
                            : 'bg-canvas text-body-strong border border-hairline rounded-lg rounded-tl-sm'
                        } ${message.isNew ? 'scale-95 opacity-0 animate-in zoom-in-50 duration-200' : ''}`}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                        <p
                          className={`mt-1 text-[10px] opacity-0 transition-opacity group-hover:opacity-100 ${
                            message.isOwn ? 'text-on-primary/80' : 'text-muted-soft'
                          }`}
                        >
                          {message.time}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <form onSubmit={handleSendMessage} className="border-t border-hairline/80 p-4">
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Type a message to everyone..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              className="flex-1 rounded-xl border border-hairline bg-canvas px-4 py-3 text-sm text-ink placeholder:text-muted-soft focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
            <button
              type="submit"
              disabled={!messageInput.trim()}
              className="flex items-center justify-center rounded-md bg-primary px-5 text-sm font-medium text-on-primary transition-colors hover:bg-primary-active disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="material-symbols-outlined text-xl">send</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
