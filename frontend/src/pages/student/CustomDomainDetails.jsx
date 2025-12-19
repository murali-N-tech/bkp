import React, { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { ArrowLeft, BookOpen, Clock, Zap, Star, Heart, Award, Lock, Target } from "lucide-react";

const CustomDomainDetails = () => {
  const navigate = useNavigate();
  const { domainId } = useParams();
  const [customDomain, setCustomDomain] = useState(null);

  // Load custom domain from localStorage using URL parameter
  useEffect(() => {
    const loadCustomDomain = () => {
      if (!domainId) {
        navigate('/student/home');
        return;
      }

      const stored = localStorage.getItem('customDomains');
      if (stored) {
        try {
          const domains = JSON.parse(stored);
          const found = domains.find(d => d.id === domainId);
          if (found) {
            setCustomDomain(found);
          } else {
            console.error(`Custom domain with id ${domainId} not found`);
            navigate('/student/home');
          }
        } catch (e) {
          console.error('Failed to load custom domain:', e);
          navigate('/student/home');
        }
      } else {
        navigate('/student/home');
      }
    };

    loadCustomDomain();
  }, [domainId, navigate]);

  if (!customDomain) {
    return (
      <div className="flex h-screen bg-gray-50">
        <div className="flex-1 flex flex-col">
          <Navbar />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading...</h2>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const getDifficultyColor = (difficulty) => {
    if (difficulty <= 2) return 'bg-green-500 text-white';
    if (difficulty <= 3) return 'bg-yellow-500 text-white';
    if (difficulty <= 4) return 'bg-red-500 text-white';
    return 'bg-purple-500 text-white';
  };

  const getDifficultyLabel = (difficulty) => {
    if (difficulty <= 2) return 'BEGINNER';
    if (difficulty <= 3) return 'INTERMEDIATE';
    if (difficulty <= 4) return 'ADVANCED';
    return 'EXPERT';
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 overflow-y-auto">
          <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50">
            {/* Header Section */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Back Button */}
                <button
                  onClick={() => navigate('/student/home')}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 group"
                >
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" strokeWidth={2} />
                  <span className="font-medium">Back to Home</span>
                </button>

                {/* Domain Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                      <Heart className="w-9 h-9 text-amber-600 fill-amber-600" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">{customDomain.name}</h1>
                      <p className="text-gray-600">
                        Explore {customDomain.courses.length} programs to master {customDomain.name}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Courses List */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {customDomain.courses.map((course, index) => (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.03 }}
                      className="group"
                    >
                      <div className="bg-white rounded-lg border border-gray-200 hover:border-brand-400 hover:shadow-lg transition-all duration-200 overflow-hidden">
                        <div className="flex items-center gap-4 p-5">
                          {/* Number Badge */}
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-md">
                              <span className="text-white font-bold text-lg">{index + 1}</span>
                            </div>
                          </div>

                          {/* Course Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4 mb-2">
                              <div>
                                <h3 className="text-lg font-bold text-gray-900 group-hover:text-brand-600 transition-colors mb-1">
                                  {course.name}
                                </h3>
                                <p className="text-sm text-gray-600 line-clamp-1">{course.description}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-6 text-sm">
                              <div className={`px-2.5 py-0.5 rounded text-xs font-bold ${getDifficultyColor(course.difficulty)}`}>
                                {getDifficultyLabel(course.difficulty)}
                              </div>
                              <div className="flex items-center gap-1.5 text-gray-600">
                                <Clock className="w-4 h-4" strokeWidth={2} />
                                <span className="font-medium">{course.duration}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-gray-600">
                                <BookOpen className="w-4 h-4" strokeWidth={2} />
                                <span className="font-medium">{course.modules} modules</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-gray-600">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" strokeWidth={2} />
                                <span className="font-medium">{course.rating} ({course.reviews.toLocaleString()})</span>
                              </div>
                            </div>
                          </div>

                          {/* Action Button */}
                          <div className="flex items-center gap-4 flex-shrink-0">
                            <button
                              onClick={() => navigate('/student/roadmap', { 
                                state: { 
                                  program: course,
                                  domainTitle: customDomain.name,
                                  domainId: domainId,
                                  isCustomDomain: true
                                } 
                              })}
                              className="px-6 py-2.5 rounded-lg font-semibold transition-all flex items-center gap-2 shadow-sm bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white"
                            >
                              <Zap className="w-4 h-4" strokeWidth={2} />
                              Start Learning
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Domain Assessment */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: customDomain.courses.length * 0.03 }}
                className="group mt-8"
              >
                <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 hover:border-indigo-400 transition-all duration-300 p-6">
                  <div className="flex items-center gap-6">
                    {/* Icon Section */}
                    <div className="flex-shrink-0 relative">
                      <div className="w-20 h-20 rounded-2xl bg-indigo-100 flex items-center justify-center">
                        <Award className="w-10 h-10 text-indigo-600" strokeWidth={2} />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                        <Lock className="w-4 h-4 text-white" strokeWidth={2.5} />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="mb-3">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {customDomain.name} Final Assessment
                        </h3>
                        <p className="text-sm text-gray-600">
                          Complete all {customDomain.courses.length} programs to unlock this test
                        </p>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-6 text-sm text-gray-700">
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4 text-gray-400" strokeWidth={2} />
                          <span>50 Questions</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" strokeWidth={2} />
                          <span>60 Minutes</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-gray-400" strokeWidth={2} />
                          <span>Certificate Available</span>
                        </div>
                      </div>
                    </div>

                    {/* Action */}
                    <div className="flex-shrink-0">
                      <button
                        disabled
                        className="px-6 py-3 rounded-lg font-semibold bg-gray-100 text-gray-400 cursor-not-allowed flex items-center gap-2"
                      >
                        <Lock className="w-4 h-4" strokeWidth={2} />
                        Locked
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CustomDomainDetails;
