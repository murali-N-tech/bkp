import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Lightbulb, BookOpen, RotateCcw } from 'lucide-react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

const QuizInsightsSimple = ({ score = 72, totalQuestions = 15, correctAnswers = 10 }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine storageKey: prefer URL param `sessionId`, then location.state
  const params = useParams();
  const sessionIdParam = params?.sessionId;
  const storageKey = location?.state?.storageKey ?? (sessionIdParam ? `quiz_payload_${sessionIdParam}` : null);
  const raw = storageKey ? localStorage.getItem(storageKey) : null;

  // Fallback mock data used when no stored payload exists or API fails
  const initialData = {
    domain_name: '69440d1e956830933287a2d1',
    program_name: 'c-programming-fundamentals',
    level_id: 'L1',
    summary: {
      accuracy_percent: 60.0,
      avg_time_seconds: 3.0,
      speed_profile: 'Fast'
    },
    strong_topics: [
      { topic: 'pointers', confidence: 1.0 },
      { topic: 'dynamic memory allocation', confidence: 1.0 },
      { topic: 'structs', confidence: 1.0 },
      { topic: 'linked lists', confidence: 1.0 },
      { topic: 'const keyword', confidence: 1.0 }
    ],
    weak_topics: [
      { topic: 'volatile keyword', confidence: 0.0 },
      { topic: 'extern keyword', confidence: 0.0 },
      { topic: 'static keyword', confidence: 0.0 },
      { topic: 'binary search', confidence: 0.0 },
      { topic: 'hash tables', confidence: 0.0 },
      { topic: 'register keyword', confidence: 0.0 }
    ],
    recommendations: [
      'Review the concepts of volatile, extern, and static keywords to improve understanding.',
      'Practice problems on binary search and hash tables to improve accuracy.',
      'Focus on careful reading and understanding of questions to improve accuracy.'
    ],
    topic_breakdown: [
      { topic: 'pointers', question_count: 1, correct_count: 1 },
      { topic: 'dynamic memory allocation', question_count: 1, correct_count: 1 },
      { topic: 'structs', question_count: 1, correct_count: 1 },
      { topic: 'linked lists', question_count: 1, correct_count: 1 },
      { topic: 'const keyword', question_count: 1, correct_count: 1 },
      { topic: 'volatile keyword', question_count: 1, correct_count: 0 },
      { topic: 'extern keyword', question_count: 1, correct_count: 0 },
      { topic: 'static keyword', question_count: 1, correct_count: 0 },
      { topic: 'binary search', question_count: 1, correct_count: 0 },
      { topic: 'hash tables', question_count: 1, correct_count: 0 },
      { topic: 'register keyword', question_count: 1, correct_count: 0 }
    ]
  };

  const [data, setData] = useState(() => {
    try {
      return raw ? JSON.parse(raw) : initialData;
    } catch (e) {
      console.error('[QuizInsightsSimple] Failed to parse raw payload during init', e);
      return initialData;
    }
  });
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  // When a parsed payload exists, POST it to the statistics analyze endpoint
  // and replace `data` with the analysis result. Show spinner while fetching.
  useEffect(() => {
    const analyze = async () => {
      if (!raw) return;
      let stored = null;
      try {
        stored = JSON.parse(raw);
      } catch (e) {
        console.error('[QuizInsightsSimple] Failed to parse raw payload from localStorage', e);
        setFetchError(e);
        return;
      }

      // Prefer the analytics object if the quiz page stored it separately.
      let analyzeBody = stored.analytics || null;

      // If no analytics object, build a compliant body from the stored payload
      if (!analyzeBody) {
        const questions = (stored.questions || []).map((q) => ({
          question_id: q.question_id || q.id || null,
          question_text: q.question_text || q.question || null,
          options: q.options || [],
          correct_option_index: q.correct_option_index ?? q.correctIndex ?? null,
          user_answer_index: q.user_answer_index ?? q.userAnswerIndex ?? null,
          is_correct: typeof q.is_correct === 'boolean' ? q.is_correct : (q.user_answer_index == q.correct_option_index),
          time_taken_seconds: q.time_taken_seconds ?? q.timeTaken ?? null,
        }));

        const levelObj = stored.level && typeof stored.level === 'object' ? stored.level : {
          level_id: stored.level && typeof stored.level === 'string' ? stored.level : (stored.level ? `L${stored.level}` : 'L1'),
          level_name: stored.level_name || (stored.level ? `Level ${stored.level}` : 'Level 1'),
          difficulty_score: (stored.level && stored.level.difficulty_score) || (stored.level && typeof stored.level === 'number' ? Number(stored.level) : 1),
        };

        analyzeBody = {
          domain_name: stored.domain_name || stored.domainId || null,
          program_name: stored.program_name || stored.programId || null,
          level: {
            level_id: levelObj.level_id,
            level_name: levelObj.level_name,
            difficulty_score: levelObj.difficulty_score,
            questions,
          },
        };
      }

      // Validate minimal required fields before sending
      const missing = [];
      if (!analyzeBody.domain_name) missing.push('domain_name');
      if (!analyzeBody.program_name) missing.push('program_name');
      if (!analyzeBody.level || !analyzeBody.level.questions) missing.push('level.questions');
      if (missing.length) {
        const msg = `[QuizInsightsSimple] Analysis payload missing fields: ${missing.join(', ')}`;
        console.error(msg, analyzeBody);
        setFetchError(new Error(msg));
        setIsFetching(false);
        return;
      }

      // Log payload we're about to send for debugging
      console.log('[QuizInsightsSimple] ANALYZE PAYLOAD:', analyzeBody);

      setIsFetching(true);
      setFetchError(null);
      try {
        const res = await fetch('http://127.0.0.1:8000/statistics/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(analyzeBody),
        });
        if (!res.ok) {
          const text = await res.text().catch(() => '');
          console.error('[QuizInsightsSimple] Analysis API error body:', text);
          throw new Error(`Analysis API returned ${res.status}: ${text}`);
        }
        const json = await res.json();
        // Expect the API to return the analyzed structure; store it in data
        setData(json);
      } catch (err) {
        console.error('[QuizInsightsSimple] Analysis request failed', err);
        setFetchError(err);
      } finally {
        setIsFetching(false);
      }
    };

    analyze();
  }, [storageKey, raw]);

  // derive totals from data (fallback to props)
  const topicBreakdown = Array.isArray(data.topic_breakdown) ? data.topic_breakdown : [];
  const totalQuestionsFromData = topicBreakdown.reduce((acc, t) => acc + (t.question_count || 0), 0);
  const correctAnswersFromData = topicBreakdown.reduce((acc, t) => acc + (t.correct_count || 0), 0);

  const actualTotal = location.state?.totalQuestions ?? (totalQuestionsFromData || totalQuestions);
  const actualCorrect = location.state?.correctAnswers ?? (correctAnswersFromData || correctAnswers);
  const actualScore = location.state?.score ?? (data.summary?.accuracy_percent ? Math.round(data.summary.accuracy_percent) : (actualTotal ? Math.round((actualCorrect / actualTotal) * 100) : score));

  const shouldRetake = actualCorrect <= 6;

  const strongTopics = Array.isArray(data.strong_topics) ? data.strong_topics.map(t => t.topic) : [];
  const weakTopics = Array.isArray(data.weak_topics) ? data.weak_topics.map(t => t.topic) : [];
  const suggestions = Array.isArray(data.recommendations) ? data.recommendations : [];

  // Show spinner while fetching analysis
  if (isFetching) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Analyzing your quiz...</p>
        </div>
      </div>
    );
  }

  if (fetchError) {
    // Render a simple error state but still attempt to show whatever data we have
    console.error('[QuizInsightsSimple] fetchError', fetchError);
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl w-full bg-white rounded-2xl shadow-xl p-8"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Quiz Insights</h1>
          <div className="inline-flex items-center gap-3 bg-slate-100 rounded-lg px-6 py-3">
            <span className="text-slate-600">Score:</span>
            <span className="text-3xl font-bold text-brand-600">{actualScore}%</span>
            <span className="text-slate-500">({actualCorrect}/{actualTotal})</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="bg-green-50 border border-green-200 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="text-green-600" size={24} />
              <h2 className="text-xl font-bold text-slate-900">Strong Topics</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {strongTopics.map((topic, i) => (
                <span key={i} className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">{topic}</span>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingDown className="text-red-600" size={24} />
              <h2 className="text-xl font-bold text-slate-900">Weak Topics</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {weakTopics.map((topic, i) => (
                <span key={i} className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 text-red-800 text-sm font-medium">{topic}</span>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="text-blue-600" size={24} />
            <h2 className="text-xl font-bold text-slate-900">Suggestions</h2>
          </div>
          <ul className="space-y-2">
            {suggestions.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-slate-700 text-sm"><span className="text-blue-600 mt-1">•</span><span>{s}</span></li>
            ))}
          </ul>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-center">
          {shouldRetake ? (
            <button onClick={() => navigate('/quiz')} className="inline-flex items-center gap-2 bg-red-600 text-white font-bold py-3 px-10 rounded-lg hover:bg-red-700 transition-all shadow-md hover:shadow-lg active:scale-95">
              <RotateCcw size={20} /> Retake Quiz
            </button>
          ) : (
            <button onClick={() => navigate('/student/home')} className="inline-flex items-center gap-2 bg-brand-600 text-white font-bold py-3 px-10 rounded-lg hover:bg-brand-700 transition-all shadow-md hover:shadow-lg active:scale-95">
              <BookOpen size={20} /> Continue Learning
            </button>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default QuizInsightsSimple;
