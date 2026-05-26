import { useContext, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import { AuthContext } from '../context/AuthContext';
import { MessageCircle, Send, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const BACKEND_URL = 'http://localhost:5000';

export default function Chat() {
  const { user, loading } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const socketRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    const socket = io(BACKEND_URL, {
      transports: ['websocket'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to chat server', socket.id);
    });

    socket.on('receiveMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on('connect_error', (error) => {
      console.error('Chat connection error:', error.message);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (event) => {
    event.preventDefault();
    const trimmed = messageText.trim();
    if (!trimmed || !socketRef.current) return;

    const outgoing = {
      message: trimmed,
      sender: user.name,
      senderId: user._id,
      createdAt: new Date().toISOString(),
    };

    socketRef.current.emit('sendMessage', outgoing);
    setMessages((prevMessages) => [...prevMessages, { ...outgoing, self: true }]);
    setMessageText('');
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500 font-bold">Loading chat...</div>;
  }

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center">
        <Card className="p-10 bg-white/90 border-slate-200 shadow-lg">
          <MessageCircle className="mx-auto mb-4 h-12 w-12 text-brand-600" />
          <h1 className="text-3xl font-extrabold text-ink mb-3">Real-time chat requires login</h1>
          <p className="text-slate-500 mb-6">Sign in to start chatting with other learners and tutors.</p>
          <div className="flex justify-center gap-4">
            <Link to="/login"><Button>Login</Button></Link>
            <Link to="/register"><Button variant="secondary">Create account</Button></Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-black text-ink">Learnify Chat</h1>
          <p className="text-slate-500 mt-2">Connect instantly with other students and tutors in real time.</p>
        </div>
        <Link to="/" className="inline-flex items-center gap-2 text-brand-600 font-bold hover:text-brand-700">
          <ArrowLeft className="w-4 h-4" /> Back to feed
        </Link>
      </div>

      <Card className="overflow-hidden border-slate-200 shadow-xl">
        <div className="border-b border-slate-200 bg-slate-50 px-6 py-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-bold text-ink">Logged in as</p>
              <p className="text-sm text-slate-500">{user.name} • {user.email}</p>
            </div>
            <span className="rounded-full bg-brand-100 px-3 py-1 text-sm font-semibold text-brand-700">Live</span>
          </div>
        </div>

        <div ref={scrollRef} className="min-h-[420px] max-h-[620px] overflow-y-auto bg-white px-6 py-5">
          {messages.length === 0 ? (
            <div className="text-center py-20 text-slate-400">No messages yet. Say hello to start the conversation.</div>
          ) : (
            <div className="space-y-4">
              {messages.map((message, index) => {
                const isSelf = message.senderId === user._id;
                return (
                  <div key={`${message.senderId}-${index}`} className={`flex ${isSelf ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-3xl p-4 shadow-sm ${isSelf ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-900'}`}>
                      <div className="flex items-center justify-between gap-3 text-sm font-semibold mb-1">
                        <span>{isSelf ? 'You' : message.sender || 'Guest'}</span>
                        <span className="text-slate-400 text-xs font-medium">{new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="whitespace-pre-wrap leading-relaxed">{message.message}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <form onSubmit={handleSend} className="border-t border-slate-200 bg-slate-50 px-6 py-5">
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={messageText}
              onChange={(event) => setMessageText(event.target.value)}
              placeholder="Type your message..."
              className="flex-1 rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            />
            <Button type="submit" className="w-full sm:w-auto px-8">
              <Send className="w-4 h-4 mr-2" /> Send
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
