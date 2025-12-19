import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Trophy,
  Target,
  Clock,
} from "lucide-react";

import QuizModal from "../components/QuizModal";
import QuizProgressSidebar from "../components/QuizProgressSidebar";
import {
  MotivationBoostModal,
  ConfidenceBuilderModal,
  StreakCelebrationModal,
  GentleEncouragementModal,
  ReassuranceModal,
} from "../components/QuizFeedbackModals";

/* -------------------- API CONFIG -------------------- */
const QUIZ_API_URL = "http://localhost:8000/quiz";
const CUSTOM_DOMAIN_API_URL = "http://localhost:9000/api/custom-domains";
const QUIZ_SESSION_API_URL = "http://localhost:9000/api/quiz-session";

const QuizPage = () => {
  const { domainId, programId, level } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  /* -------------------- EMAIL HANDLING -------------------- */
  const queryParams = new URLSearchParams(location.search);
  const assignmentEmail = queryParams.get("email"); // from AssignmentTake

  const [userEmail, setUserEmail] = useState(null);
  const finalEmail = userEmail || assignmentEmail;

  /* -------------------- SAFE LEVEL -------------------- */
  const quizLevel = level || "1";

  /* -------------------- QUIZ STATE -------------------- */
  const [domainName, setDomainName] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(Array(15).fill(null));
  const [history, setHistory] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);

  /* -------------------- FEEDBACK STATE -------------------- */
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [currentFeedbackModal, setCurrentFeedbackModal] = useState(null);
  const [streak, setStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [currentExplanation, setCurrentExplanation] = useState("");

  /* -------------------- LOAD USER EMAIL -------------------- */
  useEffect(() => {
    try {
      const raw = localStorage.getItem("userData");
      if (raw) {
        const parsed = JSON.parse(raw);
        setUserEmail(parsed?.email || null);
      }
    } catch {
      console.warn("No logged-in user email");
    }
  }, []);

  /* -------------------- FETCH DOMAIN NAME -------------------- */
  useEffect(() => {
    const fetchDomain = async () => {
      try {
        const res = await fetch(`${CUSTOM_DOMAIN_API_URL}/${domainId}`);
        const json = await res.json();
        setDomainName(json?.data?.name || domainId);
      } catch {
        setDomainName(domainId);
      }
    };
    fetchDomain();
  }, [domainId]);

  /* -------------------- INIT QUESTIONS -------------------- */
  useEffect(() => {
    if (!domainName) return;

    const placeholders = Array(15).fill({
      isPlaceholder: true,
    });

    setQuestions(placeholders);
    fetchQuestion(null, [], 0);
  }, [domainName]);

  /* -------------------- TIMER -------------------- */
  useEffect(() => {
    const t = setInterval(() => setTimeElapsed((p) => p + 1), 1000);
    return () => clearInterval(t);
  }, []);

  /* -------------------- FETCH QUESTION -------------------- */
  const fetchQuestion = async (currentSessionId, historyData, index) => {
    setIsLoading(true);
    const payload = {
      domain_name: domainName,
      program_name: programId || "assignment",
      level: parseInt(quizLevel),
      session_id: currentSessionId,
      history: historyData,
    };

    const res = await fetch(QUIZ_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    if (result.status === "success") {
      setSessionId(result.session_id);

      const q = {
        ...result.data,
        isPlaceholder: false,
      };

      setQuestions((prev) => {
        const updated = [...prev];
        updated[index] = q;
        return updated;
      });

      setSelectedAnswer(null);
      setIsAnswered(false);
    }
    setIsLoading(false);
  };

  /* -------------------- ANSWER SELECT -------------------- */
  const handleAnswerSelect = (idx) => {
    if (isAnswered) return;

    setSelectedAnswer(idx);
    setIsAnswered(true);

    const correct =
      idx === questions[currentQuestion].correctIndex;

    setAnswers((prev) => {
      const updated = [...prev];
      updated[currentQuestion] = idx;
      return updated;
    });

    if (correct) {
      setStreak((s) => s + 1);
      setCorrectCount((c) => c + 1);
      setCurrentFeedbackModal("motivation");
    } else {
      setStreak(0);
      setWrongCount((w) => w + 1);
      setCurrentFeedbackModal("encouragement");
    }

    setCurrentExplanation(questions[currentQuestion].explanation || "");
    setShowFeedbackModal(true);
  };

  /* -------------------- NEXT -------------------- */
  const handleNext = () => {
    const q = questions[currentQuestion];

    const entry = {
      question_text: q.question,
      was_correct: answers[currentQuestion] === q.correctIndex,
    };

    const updatedHistory = [...history, entry];
    setHistory(updatedHistory);

    const next = currentQuestion + 1;
    setCurrentQuestion(next);

    if (questions[next]?.isPlaceholder) {
      fetchQuestion(sessionId, updatedHistory, next);
    }
  };

  /* -------------------- SUBMIT -------------------- */
  const handleSubmit = () => {
    const payloadSessionId = sessionId || `local_${Date.now()}`;

    const payload = {
      sessionId: payloadSessionId,
      domainId,
      questions,
      answers,
      attemptedAt: new Date().toISOString(),
    };

    if (finalEmail) {
      fetch(QUIZ_SESSION_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: finalEmail,
          domainId,
          sessionId: payloadSessionId,
          payload,
          attemptedAt: payload.attemptedAt,
        }),
      });
    }

    localStorage.setItem(
      `quiz_payload_${payloadSessionId}`,
      JSON.stringify(payload)
    );

    navigate(`/quiz-insights/${payloadSessionId}`);
  };

  /* -------------------- UI -------------------- */
  return (
    <div className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <QuizModal
            question={questions[currentQuestion]}
            currentIndex={currentQuestion}
            totalQuestions={15}
            onAnswerSelect={handleAnswerSelect}
            selectedAnswer={selectedAnswer}
            isAnswered={isAnswered}
          />

          <div className="flex justify-between mt-6">
            <button
              disabled={currentQuestion === 0}
              onClick={() => setCurrentQuestion((p) => p - 1)}
              className="btn-outline"
            >
              <ChevronLeft /> Previous
            </button>

            {currentQuestion === 14 ? (
              <button onClick={handleSubmit} className="btn-primary">
                Submit
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={!isAnswered || isLoading}
                className="btn-primary"
              >
                Next <ChevronRight />
              </button>
            )}
          </div>
        </div>

        <QuizProgressSidebar
          questions={questions}
          answers={answers}
          currentQuestion={currentQuestion}
          totalQuestions={15}
        />
      </div>

      {/* Feedback Modals */}
      <MotivationBoostModal
        isOpen={showFeedbackModal && currentFeedbackModal === "motivation"}
        onClose={() => setShowFeedbackModal(false)}
        explanation={currentExplanation}
      />

      <GentleEncouragementModal
        isOpen={showFeedbackModal && currentFeedbackModal === "encouragement"}
        onClose={() => setShowFeedbackModal(false)}
        explanation={currentExplanation}
      />
    </div>
  );
};

export default QuizPage;
