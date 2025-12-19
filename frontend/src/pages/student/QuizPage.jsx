import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Trophy, Target, Clock, Zap, Activity } from "lucide-react";
import { motion } from "framer-motion";
import QuizModal from "../../components/QuizModal";
import QuizProgressSidebar from "../../components/QuizProgressSidebar";
import QUIZ_DATA from "../../utils/quizData";

const QuizPage = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(Array(QUIZ_DATA.length).fill(null));
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showResults, setShowResults] = useState(false);

  // Timer
  useEffect(() => {
    if (!showResults) {
      const timer = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [showResults]);

  const handleAnswerSelect = (index) => {
    if (isAnswered) return;

    setSelectedAnswer(index);
    setIsAnswered(true);

    const newAnswers = [...answers];
    newAnswers[currentQuestion] = index;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < QUIZ_DATA.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(answers[currentQuestion + 1]);
      setIsAnswered(answers[currentQuestion + 1] !== null);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(answers[currentQuestion - 1]);
      setIsAnswered(answers[currentQuestion - 1] !== null);
    }
  };

  const handleQuestionClick = (index) => {
    setCurrentQuestion(index);
    setSelectedAnswer(answers[index]);
    setIsAnswered(answers[index] !== null);
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const calculateScore = () => {
    let correct = 0;
    answers.forEach((answer, index) => {
      if (answer === QUIZ_DATA[index].correctIndex) {
        correct++;
      }
    });
    return correct;
  };

  if (showResults) {
    const score = calculateScore();
    const percentage = ((score / QUIZ_DATA.length) * 100).toFixed(1);
    const performanceLevel = 
      percentage >= 90 ? "Outstanding! 🌟" : 
      percentage >= 70 ? "Great Job! 🎯" : 
      percentage >= 50 ? "Good Effort! 💪" : 
      "Keep Practicing! 📚";

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-brand-900 to-slate-900 flex items-center justify-center p-6">
        {/* Animated Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-600/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-3xl w-full bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 rounded-3xl shadow-2xl p-12 text-center border border-brand-500/30"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-8"
          >
            <div className="w-32 h-32 bg-gradient-to-br from-green-500 to-brand-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-green-500/50 animate-pulse">
              <Trophy className="text-white" size={60} />
            </div>
            <h1 className="text-5xl font-bold text-white mb-3 animate-in fade-in slide-in-from-bottom duration-700 delay-300">
              Quiz Complete!
            </h1>
            <p className="text-2xl text-green-400 font-semibold animate-in fade-in slide-in-from-bottom duration-700 delay-400">
              {performanceLevel}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-3 gap-6 mb-10"
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-gradient-to-br from-brand-600 to-brand-700 rounded-2xl p-8 transition-all shadow-lg hover:shadow-2xl hover:shadow-brand-500/50"
            >
              <Target className="text-white mx-auto mb-3" size={28} />
              <p className="text-sm text-brand-100 font-semibold mb-2">Score</p>
              <p className="text-4xl font-bold text-white">
                {score}/{QUIZ_DATA.length}
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-8 transition-all shadow-lg hover:shadow-2xl hover:shadow-green-500/50"
            >
              <Activity className="text-white mx-auto mb-3" size={28} />
              <p className="text-sm text-green-100 font-semibold mb-2">Percentage</p>
              <p className="text-4xl font-bold text-white">{percentage}%</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 transition-all shadow-lg hover:shadow-2xl hover:shadow-blue-500/50"
            >
              <Clock className="text-white mx-auto mb-3" size={28} />
              <p className="text-sm text-blue-100 font-semibold mb-2">Time Taken</p>
              <p className="text-4xl font-bold text-white tabular-nums">
                {Math.floor(timeElapsed / 60)}:
                {(timeElapsed % 60).toString().padStart(2, "0")}
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-8 p-6 bg-slate-700/50 rounded-xl border border-slate-600"
          >
            <p className="text-slate-300 text-lg font-semibold">
              {percentage >= 90 && "You're a medical expert! Keep up the excellent work! 🚀"}
              {percentage >= 70 && percentage < 90 && "Very impressive performance! A few more reviews and you'll be perfect! 📖"}
              {percentage >= 50 && percentage < 70 && "Good progress! Review the concepts and try again to improve! 💡"}
              {percentage < 50 && "Don't worry! Use this as a learning opportunity. Study and retake! 📚"}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex gap-4 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.reload()}
              className="px-8 py-4 bg-gradient-to-r from-brand-600 to-brand-700 text-white rounded-lg font-bold text-lg hover:from-brand-700 hover:to-brand-800 transition-all shadow-lg hover:shadow-2xl hover:shadow-brand-500/50"
            >
              Retake Quiz
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <div className="relative z-10 pt-6 px-6 pb-12">
        <div className="max-w-7xl mx-auto">

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Left: Question Component */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-2"
            >
              <QuizModal
                question={QUIZ_DATA[currentQuestion]}
                currentIndex={currentQuestion}
                totalQuestions={QUIZ_DATA.length}
                onAnswerSelect={handleAnswerSelect}
                selectedAnswer={selectedAnswer}
                isAnswered={isAnswered}
              />

              {/* Navigation Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex justify-between mt-6 gap-4"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                  className="flex items-center gap-2 px-6 py-3 border-2 border-brand-600 text-brand-600 rounded-lg font-bold hover:bg-brand-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg"
                >
                  <ChevronLeft size={20} />
                  Previous
                </motion.button>

                {currentQuestion === QUIZ_DATA.length - 1 ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSubmit}
                    className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-brand-600 to-brand-700 text-white font-bold rounded-lg hover:from-brand-700 hover:to-brand-800 transition-all shadow-lg hover:shadow-2xl hover:shadow-brand-500/50"
                  >
                    <Zap size={20} />
                    Submit Quiz
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleNext}
                    disabled={!isAnswered}
                    className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-brand-600 to-brand-700 text-white font-bold rounded-lg hover:from-brand-700 hover:to-brand-800 transition-all shadow-lg hover:shadow-2xl hover:shadow-brand-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <ChevronRight size={20} />
                  </motion.button>
                )}
              </motion.div>
            </motion.div>

            {/* Right: Progress Sidebar Component */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-1"
            >
              <QuizProgressSidebar
                questions={QUIZ_DATA}
                answers={answers}
                currentQuestion={currentQuestion}
                onQuestionClick={handleQuestionClick}
                timeElapsed={timeElapsed}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;