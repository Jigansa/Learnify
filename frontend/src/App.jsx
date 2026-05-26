import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';
import DoubtDetails from './pages/DoubtDetails';
import Leaderboard from './pages/Leaderboard';
import UserProfile from './pages/UserProfile';
import Tutors from './pages/Tutors';
import BookingsDashboard from './pages/BookingsDashboard';
import Chat from './pages/Chat';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* Soft Animated Pastel Gradient Background covering the whole screen natively behind content */}
        <div className="min-h-screen bg-slate-50 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sky-100 via-white to-brand-50 pt-24 pb-12 selection:bg-brand-200 selection:text-ink relative">
          
          <Navbar />
          <Toaster 
            position="bottom-center" 
            toastOptions={{
              className: 'font-sans font-bold shadow-soft rounded-xl border border-slate-100',
              style: { padding: '16px', color: '#0f172a' }
            }} 
          />
          
          <main className="relative z-10 w-full animate-fade-in px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/doubts/:id" element={<DoubtDetails />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/profile/:id" element={<UserProfile />} />
              <Route path="/tutors" element={<Tutors />} />
              <Route path="/bookings" element={<BookingsDashboard />} />
              <Route path="/chat" element={<Chat />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
