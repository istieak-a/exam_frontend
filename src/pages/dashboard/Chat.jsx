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
  const [hasMore, setHasMore] = useState(true);
  const scrollContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [isFetchingOld, setIsFetchingOld] = useState(false);

  // Initial load
  useEffect(() => {
    if (!user) return;
    
    // Reset state on user change
    setMessages([]);
    setHasMore(true);
    
    let isMounted = true;
    
    const initializeChat = async () => {
      try {
        setIsLoading(true);
        setIsConnecting(true);
        setConnectionStatus('connecting');

        // Load historical messages from REST API
        // Backend returns Newest -> Oldest. We want to display Oldest -> Newest.
        const historicalMessages = await chatService.getGlobalMessages(50);
        
        if (isMounted) {
          // Reverse to show oldest first
          const validMessages = historicalMessages.map(transformMessage).reverse();
          setMessages(validMessages);
          setHasMore(historicalMessages.length >= 50);
        }

        await websocketService.connect(user);
        
        if (isMounted) {
          setConnectionStatus('connected');
          setIsConnecting(false);
          // Scroll to bottom on initial load
          setTimeout(scrollToBottom, 100);
        }

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

    // Setup listeners
    const unsubscribeGlobal = websocketService.onGlobalMessage((chatMessage) => {
      if (!isMounted) return;
      const newMessage = { ...transformMessage(chatMessage), isNew: true };
      
      setMessages(prev => {
        // Prevent duplicates
        if (prev.some(m => m.id === newMessage.id)) return prev;
        return [...prev, newMessage];
      });
      
      // Auto-scroll to bottom for new messages
      setTimeout(scrollToBottom, 100);

      // Remove "new" flag
      setTimeout(() => {
        setMessages(prev => prev.map(msg => 
          msg.id === newMessage.id ? { ...msg, isNew: false } : msg
        ));
      }, 300);
    });

    const unsubscribeConnect = websocketService.onConnect(() => {
      if (isMounted) {
        setConnectionStatus('connected');
        setIsConnecting(false);
      }
    });

    const unsubscribeDisconnect = websocketService.onDisconnect(() => {
      if (isMounted) {
        setConnectionStatus('disconnected');
      }
    });

    return () => {
      isMounted = false;
      unsubscribeGlobal();
      unsubscribeConnect();
      unsubscribeDisconnect();
    };
  }, [user]);

  const transformMessage = (msg) => ({
    id: msg.id || `${msg.timestamp}-${msg.senderId}`,
    user: {
      name: msg.senderName,
      role: msg.senderRole?.toLowerCase() || 'student'
    },
    text: msg.content,
    time: formatTime(msg.timestamp),
    isOwn: msg.senderId === user.id,
    timestamp: msg.timestamp
  });

  const loadMoreMessages = async () => {
    if (isFetchingOld || !hasMore || messages.length === 0) return;

    try {
      setIsFetchingOld(true);
      const oldestMessage = messages[0];
      const olderMessages = await chatService.getGlobalMessages(50, oldestMessage.timestamp);
      
      if (olderMessages.length < 50) {
        setHasMore(false);
      }

      if (olderMessages.length > 0) {
        const container = scrollContainerRef.current;
        const oldScrollHeight = container.scrollHeight;
        
        // Reverse to maintain Oldest -> Newest order in the list
        const newMessages = olderMessages.map(transformMessage).reverse();
        
        setMessages(prev => [...newMessages, ...prev]);
        
        // Restore scroll position
        requestAnimationFrame(() => {
          if (container) {
            const newScrollHeight = container.scrollHeight;
            container.scrollTop = newScrollHeight - oldScrollHeight;
          }
        });
      }
    } catch (error) {
      console.error("Failed to load older messages", error);
    } finally {
      setIsFetchingOld(false);
    }
  };

  const handleScroll = (e) => {
    const { scrollTop } = e.target;
    if (scrollTop === 0 && hasMore) {
      loadMoreMessages();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !websocketService.isConnected()) return;
    
    try {
      websocketService.sendGlobalMessage(messageInput, user);
      setMessageInput('');
      setTimeout(scrollToBottom, 100);
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
        <div 
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 space-y-6 overflow-y-auto p-4 bg-slate-50"
        >
          {isFetchingOld && (
             <div className="flex justify-center py-2">
               <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-primary"></div>
             </div>
          )}
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center text-center">
              <div className="max-w-sm rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-100">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <span className="material-symbols-outlined text-3xl text-primary">chat_bubble</span>
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Welcome to Global Chat!</h3>
                <p className="mt-2 text-sm text-slate-500">
                  This is the place to connect with everyone. Say hello and start a conversation!
                </p>
                <button 
                  onClick={() => document.querySelector('input[type="text"]')?.focus()}
                  className="mt-6 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/90 transition-colors"
                >
                  Start chatting
                </button>
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
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white shadow-sm ring-2 ring-white ${
                         message.isOwn 
                          ? 'bg-primary' 
                          : message.user.role === 'teacher' ? 'bg-indigo-500' : 'bg-blue-400'
                      }`}>
                        {message.user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                      </div>
                    </div>

                    <div className={`flex flex-col ${message.isOwn ? 'items-end' : 'items-start'}`}>
                      {/* Name - only show for first message in group of received messages */}
                      {!message.isOwn && (index === 0 || messages[index - 1].user.name !== message.user.name) && (
                        <div className="mb-1 ml-1 flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-700">{message.user.name}</span>
                          {message.user.role === 'teacher' && (
                            <span className="rounded-full bg-indigo-50 px-1.5 py-0.5 text-[10px] font-medium text-indigo-600 ring-1 ring-inset ring-indigo-500/10">
                              Teacher
                            </span>
                          )}
                        </div>
                      )}

                      {/* Message Bubble */}
                      <div
                        className={`group relative px-4 py-2.5 shadow-sm transition-all hover:shadow-md ${
                          message.isOwn
                            ? 'bg-primary text-white rounded-2xl rounded-tr-sm'
                            : 'bg-white text-slate-700 ring-1 ring-slate-200/50 rounded-2xl rounded-tl-sm'
                        } ${message.isNew ? 'scale-95 opacity-0 animate-in zoom-in-50 duration-200' : ''}`}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                        <p
                          className={`mt-1 text-[10px] opacity-0 transition-opacity group-hover:opacity-100 ${
                            message.isOwn ? 'text-white/80' : 'text-slate-400'
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
