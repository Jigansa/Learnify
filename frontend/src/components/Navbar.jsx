import { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { BookOpen, LogOut, Home, User as UserIcon, Calendar, Trophy, Users, MessageCircle } from 'lucide-react';
import Button from './ui/Button';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinkClass = (path) => `flex items-center font-bold px-3 py-2 rounded-lg transition-spring text-sm ${location.pathname === path ? 'bg-white shadow-sm text-ink' : 'text-slate-500 hover:text-ink hover:bg-white/50'}`;

  return (
    <div className="fixed top-0 left-0 w-full z-50 p-4 transition-all pointer-events-none">
      <nav className="max-w-6xl mx-auto glass rounded-2xl pointer-events-auto">
        <div className="flex justify-between h-16 items-center px-4 md:px-6">
          <Link to="/" className="flex items-center space-x-2 text-ink hover:scale-105 transition-spring shrink-0">
            <BookOpen className="h-7 w-7 text-brand-600" />
            <span className="font-display font-black text-xl tracking-tight hidden sm:block">Learnify</span>
          </Link>

          <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto scroolbar-hide">
            {user ? (
              <>
                <Link to="/" className={navLinkClass('/')}>
                  <Home className="h-4 w-4 sm:mr-1.5" /><span className="hidden lg:block">Feed</span>
                </Link>
                <Link to="/leaderboard" className={navLinkClass('/leaderboard')}>
                  <Trophy className="h-4 w-4 sm:mr-1.5" /><span className="hidden lg:block">Rankings</span>
                </Link>
                <Link to="/tutors" className={navLinkClass('/tutors')}>
                  <Users className="h-4 w-4 sm:mr-1.5" /><span className="hidden lg:block">Tutors</span>
                </Link>
                <Link to="/bookings" className={navLinkClass('/bookings')}>
                  <Calendar className="h-4 w-4 sm:mr-1.5" /><span className="hidden lg:block">Bookings</span>
                </Link>
                <Link to="/chat" className={navLinkClass('/chat')}>
                  <MessageCircle className="h-4 w-4 sm:mr-1.5" /><span className="hidden lg:block">Chat</span>
                </Link>
                <div className="w-px h-6 bg-slate-200 mx-1 sm:mx-2 shrink-0"></div>
                <Link to={`/profile/${user._id}`} className="flex items-center text-ink hover:opacity-80 font-bold px-2 py-2 text-sm transition-spring sm:mr-2 shrink-0">
                  <UserIcon className="h-5 w-5 sm:mr-1.5" />
                  <span className="hidden md:block">{user.name.split(' ')[0]}</span>
                </Link>
                <Button onClick={handleLogout} variant="ghost" size="sm" className="hidden sm:flex text-red-500 hover:bg-red-50 hover:text-red-600 shrink-0">
                  <LogOut className="h-4 w-4 mr-1" /> Logout
                </Button>
              </>
            ) : (
              <div className="flex gap-2">
                <Link to="/login"><Button variant="ghost" size="sm">Login</Button></Link>
                <Link to="/register"><Button variant="primary" size="sm">Sign up</Button></Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}
