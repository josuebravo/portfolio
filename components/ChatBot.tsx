'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/components/ThemeProvider';

// ─── Types ────────────────────────────────────────────────────────────────────

type Role    = 'user' | 'bot';
type Message = { id: string; role: Role; content: string };

// ─── Tokens ───────────────────────────────────────────────────────────────────

const DARK = {
  panelBg:    'rgba(10, 6, 28, 0.82)',
  border:     'rgba(255,255,255,0.10)',
  shadow:     '0 24px 80px rgba(0,0,0,0.60), 0 1px 0 rgba(255,255,255,0.07) inset',
  msgUser:    'rgba(255,255,255,0.07)',
  msgBot:     'transparent',
  textMain:   '#EEEEEC',
  textDim:    'rgba(238,238,236,0.44)',
  inputBg:    'rgba(255,255,255,0.05)',
  inputBorder:'rgba(255,255,255,0.10)',
  btnBg:      'var(--project-accent)',
  divider:    'rgba(255,255,255,0.07)',
};

const LIGHT = {
  panelBg:    'rgba(255,255,255,0.82)',
  border:     'rgba(20,18,42,0.08)',
  shadow:     '0 24px 80px rgba(20,18,42,0.14), 0 1px 0 rgba(255,255,255,1) inset',
  msgUser:    'rgba(20,18,42,0.05)',
  msgBot:     'transparent',
  textMain:   '#14122A',
  textDim:    'rgba(20,18,42,0.44)',
  inputBg:    'rgba(20,18,42,0.04)',
  inputBorder:'rgba(20,18,42,0.10)',
  btnBg:      'var(--project-accent)',
  divider:    'rgba(20,18,42,0.07)',
};

// ─── Typing indicator ─────────────────────────────────────────────────────────

function TypingDots({ color }: { color: string }) {
  return (
    <span style={{ display: 'inline-flex', gap: '4px', alignItems: 'center' }}>
      {[0, 1, 2].map(i => (
        <span
          key={i}
          style={{
            display:      'block',
            width:        '5px',
            height:       '5px',
            borderRadius: '50%',
            background:   color,
            animation:    `chat-dot 1.1s ease-in-out ${i * 0.18}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes chat-dot {
          0%, 80%, 100% { opacity: 0.25; transform: scale(0.8); }
          40%            { opacity: 1;    transform: scale(1);   }
        }
      `}</style>
    </span>
  );
}

// ─── ChatBot ─────────────────────────────────────────────────────────────────

export default function ChatBot() {
  const { theme } = useTheme();
  const isDark    = theme === 'dark';
  const t         = isDark ? DARK : LIGHT;

  const [open,     setOpen]     = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id:      'welcome',
      role:    'bot',
      content: "Hi! I'm Josue's AI assistant. Ask me anything about his work, skills, or approach.",
    },
  ]);
  const [input,   setInput]   = useState('');
  const [loading, setLoading] = useState(false);

  const endRef   = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom on new message
  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading, open]);

  // Focus input when panel opens
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 320);
  }, [open]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const history = messages
      .filter(m => m.id !== 'welcome')
      .map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.content }));

    try {
      const res = await fetch('/api/chat', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ message: text, history }),
      });
      const data = await res.json();
      const reply = data.reply ?? data.error ?? 'Something went wrong.';
      setMessages(prev => [
        ...prev,
        { id: Date.now().toString() + '_bot', role: 'bot', content: reply },
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        { id: Date.now().toString() + '_err', role: 'bot', content: 'Network error. Try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <>
      {/* ── Chat panel ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0,  scale: 1 }}
            exit={{    opacity: 0, y: 14, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26, mass: 0.9 }}
            style={{
              position:          'fixed',
              bottom:            84,
              right:             20,
              zIndex:            60,
              width:             'min(380px, calc(100vw - 32px))',
              height:            'min(520px, calc(100svh - 120px))',
              borderRadius:      20,
              background:        t.panelBg,
              backdropFilter:    'blur(32px) saturate(160%)',
              WebkitBackdropFilter: 'blur(32px) saturate(160%)',
              border:            `1px solid ${t.border}`,
              boxShadow:         t.shadow,
              display:           'flex',
              flexDirection:     'column',
              overflow:          'hidden',
            }}
          >
            {/* Header */}
            <div style={{
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'space-between',
              padding:        '14px 16px 13px',
              borderBottom:   `1px solid ${t.divider}`,
              flexShrink:     0,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                <span className="avail-dot" style={{ flexShrink: 0 }} />
                <span style={{
                  fontFamily:    'Geist, sans-serif',
                  fontSize:      '13px',
                  fontWeight:    500,
                  color:         t.textMain,
                  letterSpacing: '-0.01em',
                }}>
                  Ask about Josue
                </span>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                style={{
                  display:        'flex',
                  alignItems:     'center',
                  justifyContent: 'center',
                  width:          28,
                  height:         28,
                  borderRadius:   8,
                  border:         'none',
                  background:     'transparent',
                  cursor:         'pointer',
                  color:          t.textDim,
                  fontSize:       '18px',
                  lineHeight:     1,
                  padding:        0,
                  transition:     'color 0.15s ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = t.textMain)}
                onMouseLeave={e => (e.currentTarget.style.color = t.textDim)}
              >
                ×
              </button>
            </div>

            {/* Messages */}
            <div style={{
              flex:       1,
              overflowY:  'auto',
              padding:    '12px 14px',
              display:    'flex',
              flexDirection: 'column',
              gap:        '8px',
            }}>
              {messages.map(msg => (
                <div
                  key={msg.id}
                  style={{
                    display:   'flex',
                    justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  }}
                >
                  <div style={{
                    maxWidth:     '82%',
                    padding:      '8px 12px',
                    borderRadius: msg.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                    background:   msg.role === 'user' ? t.msgUser : t.msgBot,
                    border:       msg.role === 'bot' ? `1px solid ${t.border}` : 'none',
                    fontFamily:   'Geist, sans-serif',
                    fontSize:     '13px',
                    lineHeight:   1.55,
                    color:        t.textMain,
                    letterSpacing:'-0.005em',
                    whiteSpace:   'pre-wrap',
                    wordBreak:    'break-word',
                  }}>
                    {msg.content}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {loading && (
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <div style={{
                    padding:      '10px 14px',
                    borderRadius: '14px 14px 14px 4px',
                    border:       `1px solid ${t.border}`,
                  }}>
                    <TypingDots color={t.textDim} />
                  </div>
                </div>
              )}

              <div ref={endRef} />
            </div>

            {/* Input */}
            <div style={{
              borderTop: `1px solid ${t.divider}`,
              padding:   '10px 12px',
              display:   'flex',
              gap:       '8px',
              alignItems: 'flex-end',
              flexShrink: 0,
            }}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Ask anything…"
                rows={1}
                style={{
                  flex:          1,
                  resize:        'none',
                  border:        `1px solid ${t.inputBorder}`,
                  borderRadius:  10,
                  background:    t.inputBg,
                  color:         t.textMain,
                  fontFamily:    'Geist, sans-serif',
                  fontSize:      '13px',
                  lineHeight:    1.5,
                  padding:       '8px 11px',
                  outline:       'none',
                  maxHeight:     '96px',
                  overflowY:     'auto',
                  letterSpacing: '-0.005em',
                  transition:    'border-color 0.18s ease',
                }}
                onFocus={e  => (e.currentTarget.style.borderColor = 'var(--project-accent)')}
                onBlur={e   => (e.currentTarget.style.borderColor = t.inputBorder)}
                onInput={e  => {
                  const el = e.currentTarget;
                  el.style.height = 'auto';
                  el.style.height = Math.min(el.scrollHeight, 96) + 'px';
                }}
              />
              <button
                onClick={send}
                disabled={!input.trim() || loading}
                aria-label="Send message"
                style={{
                  display:        'flex',
                  alignItems:     'center',
                  justifyContent: 'center',
                  width:          36,
                  height:         36,
                  borderRadius:   10,
                  border:         'none',
                  background:     'var(--project-accent)',
                  cursor:         input.trim() && !loading ? 'pointer' : 'not-allowed',
                  opacity:        input.trim() && !loading ? 1 : 0.4,
                  flexShrink:     0,
                  transition:     'opacity 0.18s ease',
                  color:          '#fff',
                  fontSize:       '16px',
                  padding:        0,
                }}
              >
                ↑
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FAB button ── */}
      <motion.button
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Close chat' : 'Chat with Josue\'s AI'}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, type: 'spring', stiffness: 300, damping: 22 }}
        whileHover={{ scale: 1.07 }}
        whileTap={{  scale: 0.94 }}
        style={{
          position:       'fixed',
          bottom:         20,
          right:          20,
          zIndex:         60,
          width:          52,
          height:         52,
          borderRadius:   '50%',
          border:         `1px solid ${t.border}`,
          background:     open
            ? (isDark ? 'rgba(255,255,255,0.07)' : 'rgba(20,18,42,0.06)')
            : 'var(--project-accent)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow:      open
            ? t.shadow
            : '0 8px 32px rgba(0,200,160,0.30), 0 2px 8px rgba(0,0,0,0.20)',
          cursor:         'pointer',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          color:          open ? t.textDim : '#fff',
          fontSize:       '20px',
          transition:     'background 0.22s ease, box-shadow 0.22s ease, color 0.22s ease',
          padding:        0,
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={open ? 'close' : 'chat'}
            initial={{ opacity: 0, rotate: -20, scale: 0.7 }}
            animate={{ opacity: 1, rotate: 0,   scale: 1   }}
            exit={{    opacity: 0, rotate:  20,  scale: 0.7 }}
            transition={{ duration: 0.15 }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}
          >
            {open ? '×' : '✦'}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </>
  );
}
