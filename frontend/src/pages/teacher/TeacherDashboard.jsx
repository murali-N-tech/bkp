import React, { useState, useEffect } from "react";
import { 
  Plus, Copy, FileSpreadsheet, Users, Sparkles, Send, 
  BarChart3, LayoutDashboard, BookOpen, Search, Trash2, 
  TrendingUp, UserCheck 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import Navbar from "../../components/Navbar";

// Dummy Data for Student Performance
const PERFORMANCE_DATA = [
  { name: 'Week 1', score: 65, average: 60 },
  { name: 'Week 2', score: 72, average: 64 },
  { name: 'Week 3', score: 68, average: 66 },
  { name: 'Week 4', score: 85, average: 70 },
  { name: 'Week 5', score: 78, average: 72 },
  { name: 'Week 6', score: 90, average: 75 },
];

const STUDENT_LIST = [
  { id: 1, name: "Alex Johnson", email: "alex@example.com", lastScore: 92, progress: "+12%" },
  { id: 2, name: "Sarah Smith", email: "sarah@example.com", lastScore: 88, progress: "+5%" },
  { id: 3, name: "Michael Brown", email: "mike@example.com", lastScore: 76, progress: "-2%" },
  { id: 4, name: "Emily Davis", email: "emily@example.com", lastScore: 95, progress: "+8%" },
];

const TeacherDashboard = () => {
  const [subjects, setSubjects] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(STUDENT_LIST[0]);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      const userId = userData?.id || userData?._id;
      const res = await fetch(`http://localhost:9000/api/custom-domains/user/${userId}`);
      const result = await res.json();
      if (result.status === 'success') {
        setSubjects(result.data.filter(d => d.isAssignment));
      }
    } catch (e) { console.error(e); }
  };

  const handleCreate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      const userId = userData?.id || userData?._id;
      
      const res = await fetch('http://localhost:9000/api/custom-domains', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          name: prompt,
          userPrompt: prompt,
          isAssignment: true,
          questionLimit: 15
        }),
      });
      
      if (res.ok) {
        setShowPopup(false);
        setPrompt("");
        fetchSubjects();
      }
    } finally { setLoading(false); }
  };

  const copyInviteLink = (id) => {
    const link = `${window.location.origin}/assessment/take/${id}`;
    navigator.clipboard.writeText(link);
    alert("Invite Link Copied! Send this to your students.");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-6 py-8">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Active Subjects", value: subjects.length, icon: BookOpen, color: "text-blue-600" },
            { label: "Total Students", value: "48", icon: Users, color: "text-brand-600" },
            { label: "Avg. Performance", value: "78%", icon: TrendingUp, color: "text-green-600" },
            { label: "Tests Completed", value: "124", icon: UserCheck, color: "text-purple-600" },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
              <div className={`p-3 rounded-xl bg-slate-50 ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side: Performance Visualization */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Performance Analytics</h2>
                  <p className="text-sm text-slate-500">Tracking trend for {selectedStudent.name}</p>
                </div>
                <div className="flex bg-slate-100 p-1 rounded-lg">
                  <button className="px-3 py-1 text-xs font-bold bg-white shadow-sm rounded-md">Score Trend</button>
                  <button className="px-3 py-1 text-xs font-bold text-slate-500">Participation</button>
                </div>
              </div>

              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={PERFORMANCE_DATA}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#64748b', fontSize: 12}} 
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#64748b', fontSize: 12}}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#4f46e5" 
                      strokeWidth={4} 
                      dot={{ r: 6, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff' }}
                      activeDot={{ r: 8, strokeWidth: 0 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="average" 
                      stroke="#94a3b8" 
                      strokeWidth={2} 
                      strokeDasharray="5 5" 
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </section>

            {/* Student List Table */}
            <section className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-900">Student List</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search students..." 
                    className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm w-64 focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50 text-slate-500 text-sm">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Student Name</th>
                      <th className="px-6 py-4 font-semibold">Last Score</th>
                      <th className="px-6 py-4 font-semibold">Progress</th>
                      <th className="px-6 py-4 font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {STUDENT_LIST.map((student) => (
                      <tr 
                        key={student.id} 
                        className={`hover:bg-slate-50 cursor-pointer transition-colors ${selectedStudent.id === student.id ? 'bg-brand-50/50' : ''}`}
                        onClick={() => setSelectedStudent(student)}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold">
                              {student.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">{student.name}</p>
                              <p className="text-xs text-slate-500">{student.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-bold text-slate-700">{student.lastScore}%</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-sm font-bold ${student.progress.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>
                            {student.progress}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-brand-600 transition-all">
                            <Send size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* Right Side: Subjects & Creation */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-brand-600 to-brand-700 rounded-3xl p-6 text-white shadow-xl">
              <Sparkles className="mb-4" size={32} />
              <h3 className="text-xl font-bold mb-2">Create New Subject</h3>
              <p className="text-brand-100 text-sm mb-6 leading-relaxed">
                Generate a custom 15-question assessment by describing the topic for your students.
              </p>
              <button 
                onClick={() => setShowPopup(true)}
                className="w-full bg-white text-brand-700 font-bold py-3 rounded-xl shadow-lg hover:bg-brand-50 transition-all"
              >
                Launch Builder
              </button>
            </div>

            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 px-2">
              <BookOpen size={20} className="text-brand-600" /> My Subjects
            </h3>

            <div className="space-y-4">
              {subjects.map(sub => (
                <div key={sub._id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:border-brand-300 transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-bold text-slate-800 line-clamp-1">{sub.name}</h4>
                    <button className="text-slate-300 hover:text-red-500 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => copyInviteLink(sub._id)}
                      className="w-full bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold py-2 rounded-lg text-xs flex items-center justify-center gap-2 border border-slate-100"
                    >
                      <Copy size={14} /> Invite Students
                    </button>
                    <button 
                      onClick={() => window.open(`http://localhost:9000/api/quiz-sessions/export/${sub._id}`)}
                      className="w-full bg-green-50 hover:bg-green-100 text-green-700 font-bold py-2 rounded-lg text-xs flex items-center justify-center gap-2"
                    >
                      <FileSpreadsheet size={14} /> Export Results
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Subject Creator Popup */}
      <AnimatePresence>
        {showPopup && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[2rem] p-8 max-w-lg w-full shadow-2xl overflow-hidden relative"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-400 via-brand-600 to-brand-400" />
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-600">
                  <Sparkles size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Subject Builder</h2>
                  <p className="text-sm text-slate-500">AI-Powered Question Generation</p>
                </div>
              </div>
              
              <p className="text-slate-600 mb-6 text-sm">
                Enter a detailed prompt about the subject. Our AI will generate 15 specialized questions for this assignment.
              </p>

              <textarea 
                className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl mb-6 h-40 focus:ring-2 focus:ring-brand-500 outline-none resize-none transition-all placeholder:text-slate-400"
                placeholder="e.g., Fundamentals of React including Hooks, State Management, and Lifecycle methods for beginners..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />

              <div className="flex gap-4">
                <button 
                  onClick={() => setShowPopup(false)}
                  className="flex-1 py-4 text-slate-500 font-bold hover:bg-slate-50 rounded-2xl transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleCreate} 
                  disabled={loading || !prompt.trim()}
                  className="flex-1 bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-brand-500/20 disabled:opacity-50 transition-all"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin rounded-full" />
                  ) : (
                    <><Send size={18} /> Generate</>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeacherDashboard;