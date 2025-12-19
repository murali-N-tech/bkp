import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Trophy,
  Target,
  Clock,
  Zap,
  Activity,
} from "lucide-react";
import { motion } from "framer-motion";

import QuizModal from "../../components/QuizModal";
import QuizProgressSidebar from "../../components/QuizProgressSidebar";

const QuizPage = () => {
  const { domainId } = useParams();
  const [searchParams] = useSearchParams();
  const studentEmail = searchParams.get("email");

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);

  /* ---------------- Fetch Questions ---------------- */
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch(
          `http://localhost:9000/api/custom-domains/${domainId}`
        );
        const result = await res.json();

        if (result.status === "success") {
          const qs = result.data.questions || [];
          setQuestions(qs);
          setAnswers(Array(qs.length).fill(null));
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [domainId]);

  /* ---------------- Timer ---------------- */
  useEffect(() => {
    if (!showResults) {
      const timer = setInterval(() => {
        setTimeElapsed((t) => t + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [showResults]);

  /* ---------------- Handlers ---------------- */
  const handleAnswerSelect = (index) => {
    if (isAnswered) return;

    const updated = [...answers];
    updated[currentQuestion] = index;
    setAnswers(updated);

    setSelectedAnswer(index);
    setIsAnswered(true);
  };

  const handleNext = () => {
    const next = currentQuestion + 1;
    if (next < questions.length) {
      setCurrentQuestion(next);
      setSelectedAnswer(answers[next]);
      setIsAnswered(answers[next] !== null);
    }
  };

  const handlePrevious = () => {
    const prev = currentQuestion - 1;
    if (prev >= 0) {
      setCurrentQuestion(prev);
      setSelectedAnswer(answers[prev]);
      setIsAnswered(answers[prev] !== null);
    }
  };

  const handleQuestionClick = (index) => {
    setCurrentQuestion(index);
    setSelectedAnswer(answers[index]);
    setIsAnswered(answers[index] !== null);
  };

  const calculateScore = () => {
    let score = 0;
    answers.forEach((ans, i) => {
      if (ans === questions[i].correctIndex) score++;
    });
    return score;
  };

  const handleSubmit = async () => {
    const score = calculateScore();
    const percentage = ((score / questions.length) * 100).toFixed(1);

    try {
      await fetch("http://localhost:9000/api/quiz-sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: studentEmail,
          domainId,
          sessionId: `session_${Date.now()}`,
          payload: {
            score: parseFloat(percentage),
            correct: score,
            total: questions.length,
            status: "Completed",
          },
        }),
      });
    } catch (error) {
      console.error("Error saving quiz session:", error);
    }

    setShowResults(true);
  };

  /* ---------------- Loading / Empty ---------------- */
  if (loading)
    return <div className="p-10 text-center text-lg">Loading Questions...</div>;

  if (questions.length === 0)
    return (
      <div className="p-10 text-center text-lg">
        No questions found for this assessment.
      </div>
    );

  /* ======================= RESULTS ======================= */
  if (showResults) {
    const score = calculateScore();
    const percentage = ((score / questions.length) * 100).toFixed(1);

    const performance =
      percentage >= 90
        ? "Outstanding! 🌟"
        : percentage >= 70
        ? "Great Job! 🎯"
        : percentage >= 50
        ? "Good Effort! 💪"
        : "Keep Practicing! 📚";

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-brand-900 to-slate-900 flex items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-3xl w-full bg-slate-900 rounded-3xl p-12 text-center shadow-2xl border border-brand-500/30"
        >
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-green-500 to-brand-600 rounded-full flex items-center justify-center mb-6">
              <Trophy size={60} className="text-white" />
            </div>
            <h1 className="text-5xl font-bold text-white mb-3">
              Quiz Complete!
            </h1>
            <p className="text-2xl text-green-400 font-semibold">
              {performance}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-10">
            <StatCard
              icon={<Target size={28} />}
              label="Score"
              value={`${score}/${questions.length}`}
            />
            <StatCard
              icon={<Activity size={28} />}
              label="Percentage"
              value={`${percentage}%`}
            />
            <StatCard
              icon={<Clock size={28} />}
              label="Time"
              value={`${Math.floor(timeElapsed / 60)}:${String(
                timeElapsed % 60
              ).padStart(2, "0")}`}
            />
          </div>

          <button
            onClick={() => window.location.reload()}
            className="px-8 py-4 bg-brand-600 text-white rounded-lg font-bold hover:scale-105 transition"
          >
            Retake Quiz
          </button>
        </motion.div>
      </div>
    );
  }

  /* ======================= QUIZ UI ======================= */
  return (
    <div className="min-h-screen bg-white px-6 pt-6 pb-12 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <QuizModal
            question={questions[currentQuestion]}
            currentIndex={currentQuestion}
            totalQuestions={questions.length}
            onAnswerSelect={handleAnswerSelect}
            selectedAnswer={selectedAnswer}
            isAnswered={isAnswered}
          />

          <div className="flex justify-between mt-6 gap-4">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="btn-outline"
            >
              <ChevronLeft size={18} /> Previous
            </button>

            {currentQuestion === questions.length - 1 ? (
              <button onClick={handleSubmit} className="btn-primary">
                <Zap size={18} /> Submit Quiz
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={!isAnswered}
                className="btn-primary"
              >
                Next <ChevronRight size={18} />
              </button>
            )}
          </div>
        </div>

        <QuizProgressSidebar
          questions={questions}
          answers={answers}
          currentQuestion={currentQuestion}
          onQuestionClick={handleQuestionClick}
          timeElapsed={timeElapsed}
        />
      </div>
    </div>
  );
};

/* ---------------- Stat Card ---------------- */
const StatCard = ({ icon, label, value }) => (
  <div className="bg-brand-600 rounded-2xl p-8 text-center text-white shadow-lg">
    <div className="mb-2">{icon}</div>
    <p className="text-sm font-semibold opacity-90">{label}</p>
    <p className="text-4xl font-bold">{value}</p>
  </div>
);

export default QuizPage;
