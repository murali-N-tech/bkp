import { Clock } from 'lucide-react';

const QuizProgressSidebar = ({ questions, answers, currentQuestion, onQuestionClick, timeElapsed }) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const answeredCount = answers.filter(a => a !== null).length;
  const progressPercentage = (answeredCount / questions.length) * 100;

  return (
    <div className="bg-white rounded-xl shadow-lg p-5 sticky top-24 hover:shadow-xl transition-shadow duration-300">
      {/* Timer */}
      <div className="mb-5 p-3 bg-gradient-to-r from-brand-50 to-brand-100 rounded-lg hover:from-brand-100 hover:to-brand-200 transition-all duration-300">
        <div className="flex items-center gap-2 text-brand-700 mb-1">
          <Clock size={18} className="animate-pulse" />
          <span className="font-semibold text-sm">Time Elapsed</span>
        </div>
        <p className="text-2xl font-bold text-brand-900">{formatTime(timeElapsed)}</p>
      </div>

      {/* Progress */}
      <div className="mb-5">
        <div className="flex justify-between mb-2">
          <span className="text-xs font-semibold text-slate-700">Progress</span>
          <span className="text-xs font-semibold text-brand-600">
            {answeredCount}/{questions.length}
          </span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden shadow-inner">
          <div 
            className="h-full bg-gradient-to-r from-brand-600 to-brand-700 transition-all duration-500 ease-out shadow-sm"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Question Grid */}
      <div>
        <h3 className="text-xs font-semibold text-slate-700 mb-2.5">Questions</h3>
        <div className="grid grid-cols-5 gap-1.5">
          {questions.map((_, index) => {
            const isAnswered = answers[index] !== null;
            const isCurrent = currentQuestion === index;

            return (
              <button
                key={index}
                onClick={() => onQuestionClick(index)}
                className={`
                  aspect-square rounded-md font-semibold text-xs transition-all duration-200
                  hover:scale-110 active:scale-95
                  ${isCurrent ? 'ring-2 ring-brand-600 ring-offset-1 shadow-md' : ''}
                  ${isAnswered 
                    ? 'bg-brand-600 text-white hover:bg-brand-700 shadow-sm hover:shadow-md' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:shadow-sm'
                  }
                `}
              >
                {index + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-5 pt-4 border-t border-slate-200">
        <div className="space-y-1.5 text-xs">
          <div className="flex items-center gap-2 group cursor-default">
            <div className="w-5 h-5 rounded bg-brand-600 group-hover:scale-110 transition-transform"></div>
            <span className="text-slate-600">Answered</span>
          </div>
          <div className="flex items-center gap-2 group cursor-default">
            <div className="w-5 h-5 rounded bg-slate-100 group-hover:scale-110 transition-transform"></div>
            <span className="text-slate-600">Not Answered</span>
          </div>
          <div className="flex items-center gap-2 group cursor-default">
            <div className="w-5 h-5 rounded border-2 border-brand-600 group-hover:scale-110 transition-transform"></div>
            <span className="text-slate-600">Current</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizProgressSidebar;