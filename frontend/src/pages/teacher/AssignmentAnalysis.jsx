import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  Mail,
  User,
  Award,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import * as XLSX from "xlsx";
import Navbar from "../../components/Navbar";

// Mock detailed student data
const DETAILED_STUDENT_DATA = [
  {
    id: 1,
    name: "Rajesh Kumar",
    email: "rajesh.kumar@college.edu",
    score: 75,
    questionsAnswered: 12,
    accuracy: "62.5%",
    timeSpent: "45 min",
    status: "Completed",
  },
  {
    id: 2,
    name: "Priya Sharma",
    email: "priya.sharma@college.edu",
    score: 82,
    questionsAnswered: 15,
    accuracy: "73.3%",
    timeSpent: "52 min",
    status: "Completed",
  },
  {
    id: 3,
    name: "Amit Patel",
    email: "amit.patel@college.edu",
    score: 65,
    questionsAnswered: 10,
    accuracy: "55.0%",
    timeSpent: "38 min",
    status: "Completed",
  },
  {
    id: 4,
    name: "Sneha Reddy",
    email: "sneha.reddy@college.edu",
    score: 88,
    questionsAnswered: 16,
    accuracy: "81.3%",
    timeSpent: "58 min",
    status: "Completed",
  },
  {
    id: 5,
    name: "Vikram Singh",
    email: "vikram.singh@college.edu",
    score: 71,
    questionsAnswered: 13,
    accuracy: "61.5%",
    timeSpent: "42 min",
    status: "Completed",
  },
  {
    id: 6,
    name: "Ananya Iyer",
    email: "ananya.iyer@college.edu",
    score: 79,
    questionsAnswered: 14,
    accuracy: "69.6%",
    timeSpent: "48 min",
    status: "Completed",
  },
];

// Performance data for chart
const PERFORMANCE_DATA = DETAILED_STUDENT_DATA.map((student) => ({
  name: student.name.split(" ")[0],
  score: student.score,
  questions: student.questionsAnswered,
}));

// Topic-wise performance
const TOPIC_PERFORMANCE = [
  { topic: "Roux", accuracy: 20, reliability: "High" },
  { topic: "Sous Vide", accuracy: 66.7, reliability: "Medium" },
  { topic: "Blanching", accuracy: 66.7, reliability: "High" },
  { topic: "Emulsification", accuracy: 75, reliability: "Medium" },
  { topic: "Fermentation", accuracy: 45, reliability: "Low" },
  { topic: "Caramelization", accuracy: 80, reliability: "High" },
];

const AssignmentAnalysis = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const [selectedView, setSelectedView] = useState("overview");

  // Mock assignment data - in real app, fetch based on assignmentId
  const assignmentName = "Introduction to Cooking";
  const totalStudents = DETAILED_STUDENT_DATA.length;
  const avgScore = (
    DETAILED_STUDENT_DATA.reduce((sum, s) => sum + s.score, 0) / totalStudents
  ).toFixed(1);
  const totalQuestions = DETAILED_STUDENT_DATA.reduce(
    (sum, s) => sum + s.questionsAnswered,
    0
  );

  /* ---------------- Export All Data to Excel ---------------- */
  const handleExportAll = () => {
    const ws = XLSX.utils.json_to_sheet(
      DETAILED_STUDENT_DATA.map((student) => ({
        Name: student.name,
        Email: student.email,
        Score: student.score,
        "Questions Answered": student.questionsAnswered,
        Accuracy: student.accuracy,
        "Time Spent": student.timeSpent,
        Status: student.status,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Student Data");
    XLSX.writeFile(wb, `${assignmentName}_Analysis.xlsx`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-blue-50">
      <Navbar />

      {/* ============= HEADER ============= */}
      <div className="border-b bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-8 py-6">
          <button
            onClick={() => navigate("/teacher/dashboard")}
            className="flex items-center gap-2 text-brand-600 hover:text-brand-700 mb-4 font-semibold transition-all hover:gap-3"
          >
            <ArrowLeft size={20} /> Back to Dashboard
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                {assignmentName}
              </h1>
              <p className="text-slate-600">Detailed Assignment Analysis</p>
            </div>
            <button
              onClick={handleExportAll}
              className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-xl font-bold transition-all duration-200 hover:shadow-lg"
            >
              <Download size={20} /> Export All Data
            </button>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-8 py-8">
        {/* ============= STATS OVERVIEW ============= */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-brand-500 to-brand-600 text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-2">
              <Users size={28} />
              <div className="bg-white/20 rounded-lg p-2">
                <TrendingUp size={18} />
              </div>
            </div>
            <p className="text-sky-100 text-sm mb-1">Total Students</p>
            <p className="text-4xl font-bold">{totalStudents}</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-2">
              <Award size={28} />
              <div className="bg-white/20 rounded-lg p-2">
                <TrendingUp size={18} />
              </div>
            </div>
            <p className="text-green-100 text-sm mb-1">Average Score</p>
            <p className="text-4xl font-bold">{avgScore}%</p>
          </div>

          <div className="bg-gradient-to-br from-brand-600 to-brand-700 text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">{" "}
            <div className="flex items-center justify-between mb-2">
              <Target size={28} />
              <div className="bg-white/20 rounded-lg p-2">
                <TrendingUp size={18} />
              </div>
            </div>
            <p className="text-sky-100 text-sm mb-1">Questions Answered</p>
            <p className="text-4xl font-bold">{totalQuestions}</p>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp size={28} />
              <div className="bg-white/20 rounded-lg p-2">
                <TrendingDown size={18} />
              </div>
            </div>
            <p className="text-orange-100 text-sm mb-1">Completion Rate</p>
            <p className="text-4xl font-bold">100%</p>
          </div>
        </div>

        {/* ============= VIEW TABS ============= */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setSelectedView("overview")}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${
              selectedView === "overview"
                ? "bg-brand-600 text-white shadow-lg"
                : "bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            Performance Overview
          </button>
          <button
            onClick={() => setSelectedView("students")}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${
              selectedView === "students"
                ? "bg-brand-600 text-white shadow-lg"
                : "bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            Student Details
          </button>
          <button
            onClick={() => setSelectedView("topics")}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${
              selectedView === "topics"
                ? "bg-brand-600 text-white shadow-lg"
                : "bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            Topic Analysis
          </button>
        </div>

        {/* ============= PERFORMANCE OVERVIEW ============= */}
        {selectedView === "overview" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Student Performance Trends
              </h2>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={PERFORMANCE_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12, fill: "#64748b" }}
                      stroke="#94a3b8"
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: "#64748b" }}
                      stroke="#94a3b8"
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "none",
                        borderRadius: "12px",
                        color: "#f1f5f9",
                        padding: "12px",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#0284c7"
                      strokeWidth={3}
                      dot={{ fill: "#0284c7", r: 6 }}
                      activeDot={{ r: 8 }}
                      name="Score"
                    />
                    <Line
                      type="monotone"
                      dataKey="questions"
                      stroke="#0ea5e9"
                      strokeWidth={3}
                      dot={{ fill: "#0ea5e9", r: 6 }}
                      activeDot={{ r: 8 }}
                      name="Questions"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* ============= STUDENT DETAILS TABLE ============= */}
        {selectedView === "students" && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-brand-600 to-brand-700 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-bold">Student</th>
                    <th className="px-6 py-4 text-left font-bold">Email</th>
                    <th className="px-6 py-4 text-center font-bold">Score</th>
                    <th className="px-6 py-4 text-center font-bold">
                      Questions
                    </th>
                    <th className="px-6 py-4 text-center font-bold">
                      Accuracy
                    </th>
                    <th className="px-6 py-4 text-center font-bold">
                      Time Spent
                    </th>
                    <th className="px-6 py-4 text-center font-bold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {DETAILED_STUDENT_DATA.map((student, idx) => (
                    <tr
                      key={student.id}
                      className={`border-b hover:bg-sky-50 transition-all ${
                        idx % 2 === 0 ? "bg-slate-50" : "bg-white"
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-brand-600 flex items-center justify-center text-white font-bold">
                            {student.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">
                              {student.name}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Mail size={16} />
                          {student.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-block px-4 py-2 rounded-lg font-bold ${
                            student.score >= 80
                              ? "bg-green-100 text-green-700"
                              : student.score >= 60
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {student.score}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center font-semibold text-slate-700">
                        {student.questionsAnswered}
                      </td>
                      <td className="px-6 py-4 text-center font-semibold text-slate-700">
                        {student.accuracy}
                      </td>
                      <td className="px-6 py-4 text-center font-semibold text-slate-700">
                        {student.timeSpent}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-block px-4 py-2 rounded-lg font-bold bg-green-100 text-green-700">
                          {student.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============= TOPIC ANALYSIS ============= */}
        {selectedView === "topics" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Topic-wise Performance
              </h2>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={TOPIC_PERFORMANCE}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      dataKey="topic"
                      tick={{ fontSize: 12, fill: "#64748b" }}
                      stroke="#94a3b8"
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: "#64748b" }}
                      stroke="#94a3b8"
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "none",
                        borderRadius: "12px",
                        color: "#f1f5f9",
                        padding: "12px",
                      }}
                    />
                    <Bar
                      dataKey="accuracy"
                      fill="#0284c7"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {TOPIC_PERFORMANCE.map((topic, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-brand-600 hover:shadow-xl transition-all"
                >
                  <h3 className="text-lg font-bold text-slate-900 mb-3">
                    {topic.topic}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Accuracy</span>
                      <span className="font-bold text-brand-600">
                        {topic.accuracy}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Reliability</span>
                      <span
                        className={`px-3 py-1 rounded-lg font-bold text-xs ${
                          topic.reliability === "High"
                            ? "bg-green-100 text-green-700"
                            : topic.reliability === "Medium"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {topic.reliability}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 bg-slate-100 rounded-lg h-2 overflow-hidden">
                    <div
                      className="bg-brand-600 h-full rounded-lg transition-all duration-500"
                      style={{ width: `${topic.accuracy}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AssignmentAnalysis;
