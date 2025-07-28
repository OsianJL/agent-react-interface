import { useState, useRef, useEffect } from 'react';

type Message = {
  role: 'user' | 'agent';
  content: string;
};

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    try {
      const res = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
    
      const data = await res.json();

      const content =
        typeof data.response === 'string'
          ? data.response
          : data.response?.output || JSON.stringify(data.response);

      const agentMessage: Message = {
        role: 'agent',
        content,
      };

      setMessages((prev) => [...prev, agentMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'agent',
          content: '❌ Error al contactar con el agente.',
        },
      ]);
    }
    
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div
      style={{
        backgroundColor: '#121212',
        color: '#e0e0e0',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
      }}
    >
      {/* Mensajes */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '2rem',
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              backgroundColor: msg.role === 'user' ? '#1f1f1f' : '#1a1a1a',
              padding: '1rem',
              marginBottom: '1rem',
              borderRadius: '0.75rem',
              whiteSpace: 'pre-wrap',
              boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
              border: msg.role === 'user' ? '1px solid #333' : '1px solid #2a2a2a',
            }}
          >
            <strong style={{ color: '#888', fontSize: '0.85rem' }}>
              {msg.role === 'user' ? 'Tú' : 'Agente'}
            </strong>
            <div style={{ marginTop: '0.25rem', fontSize: '1rem' }}>{msg.content}</div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        style={{
          background: 'rgba(18,18,18,0.95)',
          padding: '1rem',
          borderTop: '1px solid #2a2a2a',
          display: 'flex',
          gap: '0.75rem',
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe una instrucción..."
          style={{
            flexGrow: 1,
            backgroundColor: '#1e1e1e',
            color: '#fff',
            border: '1px solid #333',
            borderRadius: '0.75rem',
            padding: '0.75rem 1rem',
            fontSize: '1rem',
            outline: 'none',
          }}
        />
        <button
          type="submit"
          style={{
            backgroundColor: '#3f51b5',
            border: 'none',
            color: '#fff',
            borderRadius: '0.75rem',
            padding: '0.75rem 1.25rem',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          Enviar
        </button>
      </form>
    </div>
  );
}
