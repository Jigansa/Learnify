import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import CreateDoubt from '../components/CreateDoubt';
import { AuthContext } from '../context/AuthContext';
import { MessageCircle, Award, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

export default function Home() {
  const [doubts, setDoubts] = useState([]);
  const { user } = useContext(AuthContext);

  const fetchDoubts = async () => {
    try {
      const { data } = await api.get('/doubts');
      setDoubts(data);
    } catch (error) {
      toast.error('Failed to load feed');
    }
  };

  useEffect(() => {
    fetchDoubts();
  }, []);

  return (
    <div className="max-w-3xl mx-auto py-4">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-black text-ink mb-2">Knowledge Feed</h1>
        <p className="text-slate-500 font-medium text-lg">Explore questions, provide answers, grow together.</p>
      </div>

      {user ? <CreateDoubt onDoubtCreated={fetchDoubts} /> : (
        <Card className="mb-8 bg-gradient-to-r from-brand-500 to-indigo-600 text-white border-0 shadow-xl overflow-hidden relative">
          <div className="relative z-10">
            <h3 className="text-2xl font-bold flex items-center mb-2"><Sparkles className="w-6 h-6 mr-2" /> Join the Community!</h3>
            <p className="mb-6 font-medium text-brand-100">Sign in to ask questions, earn points, and book top tutors natively.</p>
            <div className="flex gap-4">
               <Link to="/login"><Button className="bg-brand-800 text-white hover:bg-brand-900 border-none shadow-none">Log in</Button></Link>
               <Link to="/register"><Button className="bg-brand-800 text-white hover:bg-brand-900 border-none shadow-none">Sign up</Button></Link>
            </div>
          </div>
        </Card>
      )}

      <div className="space-y-8">
        {doubts.map((doubt) => (
          <Card key={doubt._id} interactive noPadding className="overflow-hidden bg-white/70">
            <div className="p-6 sm:p-8">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <Link to={`/profile/${doubt.user?._id}`}>
                    <div className="h-12 w-12 bg-gradient-to-br from-brand-100 to-indigo-200 rounded-full flex items-center justify-center text-brand-800 font-black text-xl shadow-sm hover:scale-110 transition-spring border-2 border-white">
                      {doubt.user?.name?.charAt(0) || '?'}
                    </div>
                  </Link>
                  <div>
                    <Link to={`/profile/${doubt.user?._id}`} className="text-base font-bold text-ink hover:text-brand-600">
                      {doubt.user?.name || 'Unknown User'}
                    </Link>
                    <div className="flex items-center mt-1 gap-2 flex-wrap">
                      <span className="text-xs uppercase tracking-widest font-black text-slate-400">{doubt.user?.role || 'user'}</span>
                      {doubt.user?.badges?.slice(0,1).map((b,i) => <Badge key={i} variant="success" icon={Award}>{b}</Badge>)}
                    </div>
                  </div>
                </div>
                {doubt.status === 'resolved' ? <Badge variant="success">Resolved</Badge> : <Badge variant="warning">Open</Badge>}
              </div>

              <Link to={`/doubts/${doubt._id}`} className="block group">
                <h4 className="text-2xl sm:text-3xl font-black text-ink mb-3 group-hover:text-brand-600 transition-colors leading-tight">
                  {doubt.title}
                </h4>
                <p className="text-slate-600 whitespace-pre-line line-clamp-3 leading-relaxed mb-4 text-sm sm:text-base font-medium">
                  {doubt.description}
                </p>
                
                {doubt.imageUrls && doubt.imageUrls.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 gap-3 mb-4">
                    {doubt.imageUrls.map((img, i) => (
                      <div key={i} className="relative rounded-xl overflow-hidden border border-slate-200 aspect-video shadow-sm">
                        <img src={img} alt="Attachment" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                      </div>
                    ))}
                  </div>
                )}
              </Link>

              <div className="pt-4 border-t border-slate-200/60 flex items-center justify-between text-sm">
                <div className="flex items-center text-slate-500 font-bold space-x-6">
                  <div className="flex items-center bg-slate-100 px-3 py-1.5 rounded-lg">
                    <MessageCircle className="w-4 h-4 mr-1.5 text-brand-600" />
                    <span className="text-ink">{doubt.answers?.length || 0} Answers</span>
                  </div>
                  <span className="text-slate-400 font-bold hidden sm:block">Posted {new Date(doubt.createdAt).toLocaleDateString()}</span>
                </div>
                <Link to={`/doubts/${doubt._id}`}>
                  <Button variant="ghost" size="sm" className="font-bold border border-slate-200/60">Contribute &rarr;</Button>
                </Link>
              </div>
            </div>
          </Card>
        ))}
        {doubts.length === 0 && (
          <div className="text-center py-20">
             <div className="inline-flex w-20 h-20 bg-slate-100 text-slate-400 rounded-full items-center justify-center mb-4 shadow-inner">
               <Sparkles className="w-10 h-10" />
             </div>
             <h3 className="text-2xl font-bold text-ink">Quiet in here...</h3>
             <p className="text-slate-500 mt-2 font-medium">Be the first to post a question on Learnify!</p>
          </div>
        )}
      </div>
    </div>
  );
}
