'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import websocketService from '../../services/websocketService';
import { chatService } from '../../services';

export default function Chat() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('disconnected'); // 'disconnected', 'connecting', 'connected', 'error'
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!user) return;

    let unsubscribeGlobal;
    let unsubscribeConnect;
    let unsubscribeDisconnect;
    let isMounted = true;

    const initializeChat = async () => {
      try {
        setIsLoading(true);
        setIsConnecting(true);
        setConnectionStatus('connecting');

        // Load historical messages from REST API
        const historicalMessages = await chatService.getGlobalMessages();
        
        if (isMounted) {
          setMessages(historicalMessages.map(msg => ({
            id: msg.id || `${msg.timestamp}-${msg.senderId}`,
            user: {
              name: msg.senderName,
              role: msg.senderRole?.toLowerCase() || 'student'
            },
            text: msg.content,
            time: formatTime(msg.timestamp),
            isOwn: msg.senderId === user.id,
            timestamp: msg.timestamp
          })));
        }

        // Connect to WebSocket
        await websocketService.connect(user);
        
        if (isMounted) {
          setConnectionStatus('connected');
          setIsConnecting(false);
        }

        // Subscribe to global messages
        unsubscribeGlobal = websocketService.onGlobalMessage((chatMessage) => {
          if (!isMounted) return;
          
          const newMessage = {
            id: chatMessage.id || `${chatMessage.timestamp}-${chatMessage.senderId}`,
            user: {
              name: chatMessage.senderName,
              role: chatMessage.senderRole?.toLowerCase() || 'student'
            },
            text: chatMessage.content,
            time: formatTime(chatMessage.timestamp),
            isOwn: chatMessage.senderId === user.id,
            isNew: true,
            timestamp: chatMessage.timestamp
          };

          setMessages(prev => [...prev, newMessage]);
          
          // Remove the "new" flag after animation
          setTimeout(() => {
            setMessages(prev => prev.map(msg => 
              msg.id === newMessage.id ? { ...msg, isNew: false } : msg
            ));
          }, 300);
        });

        // Connection status handlers
        unsubscribeConnect = websocketService.onConnect(() => {
          if (isMounted) {
            setConnectionStatus('connected');
            setIsConnecting(false);
          }
        });

        unsubscribeDisconnect = websocketService.onDisconnect(() => {
          if (isMounted) {
            setConnectionStatus('disconnected');
          }
        });

      } catch (error) {
        console.error('Failed to initialize chat:', error);
        if (isMounted) {
          setConnectionStatus('error');
          setIsConnecting(false);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initializeChat();

    // Cleanup on unmount
    return () => {
      isMounted = false;
      if (unsubscribeGlobal) unsubscribeGlobal();
      if (unsubscribeConnect) unsubscribeConnect();
      if (unsubscribeDisconnect) unsubscribeDisconnect();
      // Don't disconnect here as other components might be using it
    };
  }, [user]);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !websocketService.isConnected()) return;
    
    try {
      // Send message via WebSocket
      websocketService.sendGlobalMessage(messageInput, user);
      setMessageInput('');
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message. Please check your connection.');
    }
  };

  const reconnect = async () => {
    try {
      setIsConnecting(true);
      setConnectionStatus('connecting');
      await websocketService.connect(user);
      setConnectionStatus('connected');
    } catch (error) {
      console.error('Reconnection failed:', error);
      setConnectionStatus('error');
    } finally {
      setIsConnecting(false);
    }
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
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${
                connectionStatus === 'connected' ? 'bg-green-500' :
                connectionStatus === 'connecting' ? 'bg-yellow-500 animate-pulse' :
                connectionStatus === 'error' ? 'bg-red-500' : 'bg-slate-400'
              }`} />
              <p className="text-xs text-slate-500">
                {connectionStatus === 'connected' ? 'Connected' :
                 connectionStatus === 'connecting' ? 'Connecting...' :
                 connectionStatus === 'error' ? 'Connection error' : 'Disconnected'}
              </p>
            </div>
          </div>
          {connectionStatus === 'error' && (
            <button
              onClick={reconnect}
              disabled={isConnecting}
              className="rounded-lg px-3 py-1.5 text-xs font-medium bg-primary text-white hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              Reconnect
            </button>
          )}
          <button className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600">
            <span className="material-symbols-outlined">more_vert</span>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center text-center">
              <div>
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                  <span className="material-symbols-outlined text-3xl text-slate-400">chat_bubble</span>
                </div>
                <p className="text-sm font-medium text-slate-600">No messages yet</p>
                <p className="text-xs text-slate-400 mt-1">Be the first to say something!</p>
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
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
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <form onSubmit={handleSendMessage} className="border-t border-slate-200/80 p-4">
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder={connectionStatus === 'connected' ? "Type a message to everyone..." : "Connecting to chat..."}
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              disabled={connectionStatus !== 'connected'}
              className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={!messageInput.trim() || connectionStatus !== 'connected'}
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
