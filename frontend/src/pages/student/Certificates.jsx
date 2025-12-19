import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Award, Download, Share2, Eye, Lock, 
  Search, CheckCircle2, Calendar, ShieldCheck, X
} from 'lucide-react';

// --- Mock Data ---
const CERTIFICATES = [
  { 
    id: 1, 
    title: 'Python Fundamentals', 
    issuer: 'SkillForge Academy', 
    date: 'Dec 15, 2024', 
    grade: 'A+', 
    credentialId: 'SF-2024-PY-8821',
    status: 'earned',
    skills: ['Variables', 'Loops', 'Functions', 'Error Handling'],
    color: 'from-blue-500 to-cyan-500',
    icon: '🐍'
  },
  { 
    id: 2, 
    title: 'Web Development Basics', 
    issuer: 'SkillForge Academy', 
    date: 'Nov 20, 2024', 
    grade: 'A', 
    credentialId: 'SF-2024-WD-9932',
    status: 'earned',
    skills: ['HTML5', 'CSS3', 'Responsive Design', 'DOM'],
    color: 'from-orange-500 to-red-500',
    icon: '🌐'
  },
  { 
    id: 3, 
    title: 'Advanced React Patterns', 
    issuer: 'SkillForge Academy', 
    status: 'locked',
    progress: 75,
    requirement: 'Complete Level 6 Challenges',
    skills: ['Hooks', 'Context API', 'Performance'],
    color: 'from-indigo-500 to-purple-500',
    icon: '⚛️'
  },
  { 
    id: 4, 
    title: 'Data Structures Mastery', 
    issuer: 'SkillForge Academy', 
    status: 'locked',
    progress: 30,
    requirement: 'Complete Level 8 Boss Fight',
    skills: ['Trees', 'Graphs', 'Algorithms'],
    color: 'from-emerald-500 to-green-500',
    icon: '🌳'
  }
];

const Certificates = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCert, setSelectedCert] = useState(null);

  // Filter Logic
  const filteredCerts = CERTIFICATES.filter(cert => {
    const matchesTab = activeTab === 'all' 
      ? true 
      : activeTab === 'earned' 
        ? cert.status === 'earned' 
        : cert.status === 'locked';
    
    const matchesSearch = cert.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesTab && matchesSearch;
  });

  const earnedCount = CERTIFICATES.filter(c => c.status === 'earned').length;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans">
      
      {/* --- Page Header --- */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2 flex items-center gap-3">
              <Award className="text-brand-600" size={40} />
              My Credentials
            </h1>
            <p className="text-slate-500 text-lg">
              Showcase your achievements and verify your skills.
            </p>
          </div>

          {/* Mini Stats */}
          <div className="flex gap-4">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
              <div className="p-3 bg-green-100 text-green-600 rounded-xl">
                <ShieldCheck size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">{earnedCount}</div>
                <div className="text-xs text-slate-500 font-bold uppercase">Earned</div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
              <div className="p-3 bg-slate-100 text-slate-600 rounded-xl">
                <Lock size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">{CERTIFICATES.length - earnedCount}</div>
                <div className="text-xs text-slate-500 font-bold uppercase">Locked</div>
              </div>
            </div>
          </div>
        </div>

        {/* --- Controls Toolbar --- */}
        <div className="mt-10 flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Tabs */}
          <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm w-full md:w-auto">
            {['all', 'earned', 'locked'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-lg text-sm font-bold capitalize transition-all ${
                  activeTab === tab 
                    ? 'bg-brand-600 text-white shadow-md' 
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search certificates..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            />
          </div>
        </div>
      </div>

      {/* --- Certificates Grid --- */}
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredCerts.map((cert) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              key={cert.id}
              className={`group relative bg-white rounded-3xl border transition-all duration-300 overflow-hidden flex flex-col ${
                cert.status === 'locked' 
                  ? 'border-slate-200 opacity-80 hover:opacity-100' 
                  : 'border-slate-200 hover:border-brand-300 hover:shadow-2xl hover:-translate-y-1'
              }`}
            >
              {/* Card Preview Area */}
              <div className={`h-40 relative overflow-hidden flex items-center justify-center bg-gradient-to-br ${cert.color}`}>
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                
                {/* Icon/Badge */}
                <div className="relative z-10 bg-white/20 backdrop-blur-md p-4 rounded-full shadow-lg border border-white/30 transform transition-transform group-hover:scale-110">
                  <span className="text-4xl drop-shadow-md">{cert.icon}</span>
                </div>

                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  {cert.status === 'earned' ? (
                    <span className="bg-white/90 text-green-700 text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1 backdrop-blur-sm">
                      <CheckCircle2 size={12} /> Verified
                    </span>
                  ) : (
                    <span className="bg-slate-900/50 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1 backdrop-blur-sm">
                      <Lock size={12} /> Locked
                    </span>
                  )}
                </div>
              </div>

              {/* Content Area */}
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-slate-900 mb-1 leading-tight group-hover:text-brand-600 transition-colors">
                  {cert.title}
                </h3>
                <p className="text-sm text-slate-500 mb-4">{cert.issuer}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {cert.skills.slice(0, 3).map((skill, i) => (
                    <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-medium">
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="mt-auto">
                  {cert.status === 'earned' ? (
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setSelectedCert(cert)}
                        className="flex-1 bg-brand-600 hover:bg-brand-700 text-white py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-brand-600/20"
                      >
                        <Eye size={16} /> View
                      </button>
                      <button className="p-2.5 text-slate-500 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors" title="Download PDF">
                        <Download size={18} />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold text-slate-500">
                        <span>Progress</span>
                        <span>{cert.progress}%</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-slate-400 rounded-full" 
                          style={{ width: `${cert.progress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-brand-600 mt-2 font-medium flex items-center gap-1">
                        <Lock size={10} /> {cert.requirement}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* --- Certificate Detail Modal --- */}
      <AnimatePresence>
        {selectedCert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setSelectedCert(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center p-6 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-900">Certificate Details</h3>
                <button 
                  onClick={() => setSelectedCert(null)}
                  className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 bg-slate-50">
                {/* Certificate Preview Mock */}
                <div className="bg-white border-4 border-slate-200 p-8 rounded-xl shadow-sm text-center relative overflow-hidden mb-8">
                  <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${selectedCert.color}`}></div>
                  
                  <div className="w-16 h-16 mx-auto bg-brand-50 rounded-full flex items-center justify-center mb-4 text-3xl">
                    <Award className="text-brand-600" size={32} />
                  </div>
                  
                  <h2 className="text-2xl font-serif font-bold text-slate-900 mb-2">{selectedCert.title}</h2>
                  <p className="text-slate-500 text-sm mb-6">Presented to <span className="font-bold text-slate-900">Alex Johnson</span></p>
                  
                  <div className="flex justify-center gap-8 text-sm text-slate-600 mb-6">
                    <div>
                      <span className="block text-xs text-slate-400 uppercase">Date</span>
                      <span className="font-medium">{selectedCert.date}</span>
                    </div>
                    <div>
                      <span className="block text-xs text-slate-400 uppercase">Grade</span>
                      <span className="font-medium">{selectedCert.grade}</span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-400 font-mono">ID: {selectedCert.credentialId}</div>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                  <button className="flex-1 bg-brand-600 hover:bg-brand-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-brand-600/25">
                    <Download size={20} /> Download PDF
                  </button>
                  <button className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all">
                    <Share2 size={20} /> Share Link
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Certificates;