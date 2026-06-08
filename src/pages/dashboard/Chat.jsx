'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useAuth } from '../../context/AuthContext';
import { authApi, chatApi } from '../../services/api';

const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getInitials(name = '') {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || '?';
}

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function formatConvTime(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  return isToday
    ? d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function normalizeMsg(m, currentUserId) {
  return {
    id: m.id,
    senderId: String(m.senderId),
    receiverId: m.receiverId ? String(m.receiverId) : null,
    senderName: m.senderName || 'Unknown',
    senderRole: (m.senderRole || 'STUDENT').toLowerCase(),
    text: m.content,
    timestamp: m.timestamp || Date.now(),
    isOwn: String(m.senderId) === String(currentUserId),
    type: m.type || 'GLOBAL',
  };
}

// Build a conversations list from getConversations() API result
function buildConversations(rawMsgs, myId) {
  const map = new Map();
  const myIdStr = String(myId);

  (rawMsgs || []).forEach((m) => {
    const isFromMe = String(m.senderId) === myIdStr;
    const partnerId = String(isFromMe ? m.receiverId : m.senderId);
    const partnerName = isFromMe ? (m.receiverName || 'Unknown') : (m.senderName || 'Unknown');
    const partnerRole = isFromMe ? null : (m.senderRole || '').toLowerCase();

    if (!map.has(partnerId) || m.timestamp > map.get(partnerId).timestamp) {
      map.set(partnerId, {
        userId: partnerId,
        userName: partnerName,
        userRole: partnerRole,
        lastMessage: m.content,
        timestamp: m.timestamp,
        unread: false,
      });
    }
  });

  return Array.from(map.values()).sort((a, b) => b.timestamp - a.timestamp);
}

// ─── New Message Modal ────────────────────────────────────────────────────────

function NewMessageModal({ teachers, onSelect, onClose }) {
  const [query, setQuery] = useState('');
  const filtered = teachers.filter((t) =>
    (t.fullName || t.name || t.username || '').toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4" onClick={onClose}>
      <div
        className="w-full max-w-sm rounded-xl border border-hairline bg-canvas shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-hairline px-5 py-4">
          <h3 className="font-semibold text-ink">New Message</h3>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted transition-colors hover:bg-surface-soft hover:text-ink"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <div className="p-4">
          <p className="mb-3 text-sm text-body">Select a teacher to start a private conversation</p>
          <div className="relative mb-3">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-lg text-muted">search</span>
            <input
              autoFocus
              type="text"
              placeholder="Search teachers…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-lg border border-hairline bg-surface-soft py-2 pl-9 pr-3 text-sm text-ink placeholder:text-muted-soft focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="max-h-60 overflow-y-auto space-y-1">
            {filtered.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted">No teachers found</p>
            ) : (
              filtered.map((t) => {
                const name = t.fullName || t.name || t.username || 'Teacher';
                return (
                  <button
                    key={t.id}
                    onClick={() => onSelect({ userId: String(t.id), userName: name, userRole: 'teacher' })}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-surface-soft"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-teal/15 text-sm font-semibold text-accent-teal">
                      {getInitials(name)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-ink">{name}</p>
                      <p className="text-xs text-muted">{t.email || 'Teacher'}</p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Conversation List Item ───────────────────────────────────────────────────

function ConvItem({ conv, isActive, onClick }) {
  const isGlobal = conv.userId === 'global';
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
        isActive ? 'bg-surface-card' : 'hover:bg-surface-soft'
      }`}
    >
      <div className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-on-primary ${
        isGlobal ? 'bg-primary' : conv.userRole === 'teacher' ? 'bg-accent-teal' : 'bg-primary/70'
      }`}>
        {isGlobal ? (
          <span className="material-symbols-outlined text-xl">groups</span>
        ) : (
          getInitials(conv.userName)
        )}
        {conv.unread && (
          <span className="absolute right-0 top-0 h-2.5 w-2.5 rounded-full bg-error ring-2 ring-canvas" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-1">
          <p className={`truncate text-sm font-medium ${isActive ? 'text-ink' : 'text-body-strong'}`}>
            {conv.userName}
          </p>
          {conv.timestamp && (
            <span className="shrink-0 text-[10px] text-muted">{formatConvTime(conv.timestamp)}</span>
          )}
        </div>
        {conv.lastMessage && (
          <p className="mt-0.5 truncate text-xs text-muted">{conv.lastMessage}</p>
        )}
      </div>
    </button>
  );
}

// ─── Message Bubble ───────────────────────────────────────────────────────────

function MessageBubble({ message, prevMessage }) {
  const showHeader = !prevMessage || prevMessage.senderId !== message.senderId;
  return (
    <div className={`flex gap-3 ${message.isOwn ? 'justify-end' : 'justify-start'}`}>
      {!message.isOwn && (
        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-on-primary self-end ${
          message.senderRole === 'teacher' ? 'bg-accent-teal' : 'bg-primary/70'
        } ${!showHeader ? 'invisible' : ''}`}>
          {getInitials(message.senderName)}
        </div>
      )}

      <div className={`flex max-w-[78%] flex-col ${message.isOwn ? 'items-end' : 'items-start'}`}>
        {!message.isOwn && showHeader && (
          <div className="mb-1 ml-1 flex items-center gap-1.5">
            <span className="text-xs font-semibold text-body-strong">{message.senderName}</span>
            {message.senderRole === 'teacher' && (
              <span className="rounded-full bg-accent-teal/10 px-1.5 py-0.5 text-[10px] font-medium text-accent-teal">
                Teacher
              </span>
            )}
          </div>
        )}

        <div className={`group relative px-4 py-2.5 shadow-sm ${
          message.isOwn
            ? 'rounded-lg rounded-tr-sm bg-primary text-on-primary'
            : 'rounded-lg rounded-tl-sm border border-hairline bg-canvas text-body-strong'
        }`}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
          <p className={`mt-1 text-[10px] opacity-0 transition-opacity group-hover:opacity-100 ${
            message.isOwn ? 'text-on-primary/70' : 'text-muted-soft'
          }`}>
            {formatTime(message.timestamp)}
          </p>
        </div>
      </div>

      {message.isOwn && (
        <div className="h-8 w-8 shrink-0" />
      )}
    </div>
  );
}

// ─── Main Chat Component ──────────────────────────────────────────────────────

const GLOBAL_CONV = {
  userId: 'global',
  userName: 'Global Chat',
  userRole: null,
  lastMessage: 'Chat with everyone',
  timestamp: null,
  unread: false,
};

export default function Chat() {
  const { user, isStudent } = useAuth();

  const [conversations, setConversations] = useState([GLOBAL_CONV]);
  const [activeConv, setActiveConv] = useState(GLOBAL_CONV);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [connected, setConnected] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [showNewMsg, setShowNewMsg] = useState(false);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  // Mobile: show conversation list vs active chat
  const [mobileView, setMobileView] = useState('list');

  const messagesEndRef = useRef(null);
  const stompClientRef = useRef(null);
  const activeConvRef = useRef(activeConv);

  useEffect(() => { activeConvRef.current = activeConv; }, [activeConv]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Load conversations list + teacher list on mount
  useEffect(() => {
    chatApi.getConversations()
      .then((data) => {
        const convs = buildConversations(data || [], user?.id);
        setConversations([GLOBAL_CONV, ...convs]);
      })
      .catch(() => {});

    if (isStudent) {
      authApi.getTeachers()
        .then((data) => setTeachers(Array.isArray(data) ? data : []))
        .catch(() => {});
    }
  }, [user?.id, isStudent]);

  // Load messages for the active conversation
  useEffect(() => {
    if (!activeConv) return;
    setLoadingMsgs(true);
    setMessages([]);

    const load = activeConv.userId === 'global'
      ? chatApi.getGlobal(0, 100).then((d) => {
          const raw = d?.content || d || [];
          return raw.map((m) => normalizeMsg(m, user?.id)).reverse();
        })
      : chatApi.getPrivate(activeConv.userId).then((d) =>
          (Array.isArray(d) ? d : []).map((m) => normalizeMsg(m, user?.id))
        );

    load
      .then((msgs) => {
        setMessages(msgs);
        setTimeout(scrollToBottom, 80);
      })
      .catch(() => {})
      .finally(() => setLoadingMsgs(false));
  }, [activeConv?.userId, user?.id, scrollToBottom]);

  // WebSocket connection
  useEffect(() => {
    if (!user?.id) return;

    const client = new Client({
      webSocketFactory: () => new SockJS(`${BASE}/ws?userId=${user.id}`),
      reconnectDelay: 5000,
      onConnect: () => {
        setConnected(true);

        // Global topic
        client.subscribe('/topic/global', (frame) => {
          try {
            const msg = normalizeMsg(JSON.parse(frame.body), user.id);
            if (activeConvRef.current?.userId === 'global') {
              setMessages((prev) => [...prev, msg]);
              setTimeout(scrollToBottom, 80);
            }
            // Update global conversation last message
            setConversations((prev) =>
              prev.map((c) =>
                c.userId === 'global'
                  ? { ...c, lastMessage: msg.text, timestamp: msg.timestamp }
                  : c
              )
            );
          } catch { /* ignore */ }
        });

        // Private messages
        client.subscribe('/user/queue/messages', (frame) => {
          try {
            const msg = normalizeMsg(JSON.parse(frame.body), user.id);
            const partnerId = msg.isOwn ? msg.receiverId : msg.senderId;

            if (String(activeConvRef.current?.userId) === String(partnerId)) {
              setMessages((prev) => [...prev, msg]);
              setTimeout(scrollToBottom, 80);
            } else {
              // Mark unread for conversation not currently open
              setConversations((prev) => {
                const exists = prev.find((c) => String(c.userId) === String(partnerId));
                if (exists) {
                  return prev.map((c) =>
                    String(c.userId) === String(partnerId)
                      ? { ...c, unread: true, lastMessage: msg.text, timestamp: msg.timestamp }
                      : c
                  );
                }
                // New conversation — prepend it
                return [
                  GLOBAL_CONV,
                  {
                    userId: String(partnerId),
                    userName: msg.isOwn ? (msg.receiverName || 'User') : msg.senderName,
                    userRole: msg.isOwn ? null : msg.senderRole,
                    lastMessage: msg.text,
                    timestamp: msg.timestamp,
                    unread: true,
                  },
                  ...prev.filter((c) => c.userId !== 'global' && String(c.userId) !== String(partnerId)),
                ];
              });
            }
          } catch { /* ignore */ }
        });
      },
      onDisconnect: () => setConnected(false),
      onStompError: () => setConnected(false),
    });

    client.activate();
    stompClientRef.current = client;

    return () => { client.deactivate(); };
  }, [user?.id, scrollToBottom]);

  const switchConversation = (conv) => {
    setActiveConv(conv);
    setMobileView('chat');
    // Clear unread badge
    setConversations((prev) =>
      prev.map((c) => (c.userId === conv.userId ? { ...c, unread: false } : c))
    );
  };

  const openNewConversation = (partnerInfo) => {
    setShowNewMsg(false);
    // Add to list if not present
    setConversations((prev) => {
      const exists = prev.find((c) => c.userId === partnerInfo.userId);
      if (exists) return prev;
      return [GLOBAL_CONV, { ...partnerInfo, lastMessage: '', timestamp: null, unread: false },
        ...prev.filter((c) => c.userId !== 'global')];
    });
    switchConversation({ ...partnerInfo, lastMessage: '', timestamp: null, unread: false });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    const text = messageInput.trim();
    if (!text) return;
    setMessageInput('');

    try {
      if (activeConv.userId === 'global') {
        await chatApi.sendGlobal(text);
        if (!connected) {
          const optimistic = {
            id: `opt-${Date.now()}`, senderId: String(user.id), receiverId: null,
            senderName: user?.name || user?.fullName || 'You', senderRole: (user?.role || '').toLowerCase(),
            text, timestamp: Date.now(), isOwn: true, type: 'GLOBAL',
          };
          setMessages((prev) => [...prev, optimistic]);
          setTimeout(scrollToBottom, 80);
        }
      } else {
        const result = await chatApi.sendPrivate(activeConv.userId, text);
        // HTTP fallback: backend echoes to both users via WS, but if not connected add optimistically
        if (!connected) {
          const optimistic = {
            id: `opt-${Date.now()}`, senderId: String(user.id), receiverId: String(activeConv.userId),
            senderName: user?.name || user?.fullName || 'You', senderRole: (user?.role || '').toLowerCase(),
            text, timestamp: Date.now(), isOwn: true, type: 'PRIVATE',
          };
          setMessages((prev) => [...prev, optimistic]);
          setTimeout(scrollToBottom, 80);
        }
        // Update conversations list last message
        setConversations((prev) =>
          prev.map((c) =>
            c.userId === activeConv.userId
              ? { ...c, lastMessage: text, timestamp: Date.now() }
              : c
          )
        );
      }
    } catch {
      setMessageInput(text);
    }
  };

  const isGlobal = activeConv?.userId === 'global';

  return (
    <div className="flex h-[calc(100vh-5rem)] flex-col gap-0">
      {/* Page title — only visible on desktop */}
      <div className="mb-4 hidden lg:block">
        <h1 className="font-display text-[32px] leading-tight tracking-[-0.02em] text-ink">Messages</h1>
        <p className="mt-1 text-sm text-body">Global chat and private conversations</p>
      </div>

      <div className="flex flex-1 overflow-hidden rounded-xl border border-hairline bg-canvas shadow-sm">
        {/* ── Left panel: conversation list ── */}
        <aside className={`flex w-full flex-col border-r border-hairline bg-canvas lg:w-72 lg:flex ${
          mobileView === 'list' ? 'flex' : 'hidden'
        }`}>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-hairline px-4 py-3">
            <h2 className="font-semibold text-ink">Conversations</h2>
            {isStudent && (
              <button
                onClick={() => setShowNewMsg(true)}
                title="New message"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-on-primary transition-colors hover:bg-primary-active"
              >
                <span className="material-symbols-outlined text-lg">edit_square</span>
              </button>
            )}
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
            {conversations.map((conv) => (
              <ConvItem
                key={conv.userId}
                conv={conv}
                isActive={activeConv?.userId === conv.userId}
                onClick={() => switchConversation(conv)}
              />
            ))}
          </div>

          {/* Connection status */}
          <div className="border-t border-hairline px-4 py-2.5 flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${connected ? 'bg-success' : 'bg-muted-soft'}`} />
            <span className="text-xs text-muted">{connected ? 'Connected' : 'Connecting…'}</span>
          </div>
        </aside>

        {/* ── Right panel: messages ── */}
        <div className={`flex flex-1 flex-col overflow-hidden lg:flex ${
          mobileView === 'chat' ? 'flex' : 'hidden'
        }`}>
          {/* Conversation header */}
          <div className="flex items-center gap-3 border-b border-hairline bg-surface-soft px-4 py-3">
            {/* Mobile back button */}
            <button
              onClick={() => setMobileView('list')}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-body transition-colors hover:bg-canvas lg:hidden"
            >
              <span className="material-symbols-outlined text-xl">arrow_back</span>
            </button>

            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-on-primary ${
              isGlobal ? 'bg-primary' : activeConv?.userRole === 'teacher' ? 'bg-accent-teal' : 'bg-primary/70'
            }`}>
              {isGlobal
                ? <span className="material-symbols-outlined text-xl">groups</span>
                : getInitials(activeConv?.userName || '')}
            </div>

            <div className="flex-1 min-w-0">
              <p className="truncate font-semibold text-ink">{activeConv?.userName}</p>
              <p className="text-xs text-muted">
                {isGlobal ? 'Visible to everyone' : activeConv?.userRole === 'teacher' ? 'Teacher' : 'Student'}
              </p>
            </div>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto space-y-3 bg-surface-soft p-4">
            {loadingMsgs ? (
              <div className="flex h-full items-center justify-center">
                <div className="h-7 w-7 animate-spin rounded-full border-2 border-hairline border-t-primary" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex h-full items-center justify-center">
                <div className="max-w-xs rounded-xl border border-hairline bg-canvas p-8 text-center shadow-sm">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                    <span className="material-symbols-outlined text-3xl text-primary">
                      {isGlobal ? 'chat_bubble' : 'forum'}
                    </span>
                  </div>
                  <h3 className="font-display text-[18px] leading-tight tracking-tight text-ink">
                    {isGlobal ? 'No messages yet' : 'Start the conversation'}
                  </h3>
                  <p className="mt-1.5 text-sm text-muted">
                    {isGlobal
                      ? 'Be the first to say something!'
                      : `Send a message to ${activeConv?.userName}`}
                  </p>
                </div>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <MessageBubble key={msg.id} message={msg} prevMessage={messages[idx - 1] || null} />
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="border-t border-hairline bg-canvas p-4">
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder={isGlobal ? 'Message everyone…' : `Message ${activeConv?.userName}…`}
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                className="flex-1 rounded-xl border border-hairline bg-surface-soft px-4 py-3 text-sm text-ink placeholder:text-muted-soft focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
              <button
                type="submit"
                disabled={!messageInput.trim()}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-on-primary transition-colors hover:bg-primary-active disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-xl">send</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* New Message Modal */}
      {showNewMsg && (
        <NewMessageModal
          teachers={teachers}
          onSelect={openNewConversation}
          onClose={() => setShowNewMsg(false)}
        />
      )}
    </div>
  );
}
