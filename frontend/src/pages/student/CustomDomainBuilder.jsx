import React, { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { Send, Sparkles, Zap, BookOpen, Brain, Code2, Award, Clock, Layers, Star, Check } from "lucide-react";

const CustomDomainBuilder = () => {
  const navigate = useNavigate();
  const [showAIInterface, setShowAIInterface] = useState(false);
  const [userPrompt, setUserPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedCourses, setGeneratedCourses] = useState([]);
  const [domainCreated, setDomainCreated] = useState(false);
  const [domainSaved, setDomainSaved] = useState(false);
  const [customDomains, setCustomDomains] = useState([]);
  const [mainTopic, setMainTopic] = useState("");

  // Load custom domains from localStorage on mount
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem('customDomains');
      if (stored) {
        setCustomDomains(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Error loading custom domains:', e);
    }
  }, []);

  const mockCourses = [
    {
      id: 1,
      name: "Basics",
      icon: Code2,
      difficulty: 1,
      progress: 0,
      color: "hsl(24, 95%, 53%)",
      description: "Comprehensive course to build your skills and knowledge",
      duration: "10 weeks",
      modules: 11,
      rating: 4.1,
      reviews: 5113
    },
    {
      id: 2,
      name: "MS Office",
      icon: Brain,
      difficulty: 2,
      progress: 0,
      color: "hsl(189, 94%, 43%)",
      description: "Comprehensive course to build your skills and knowledge",
      duration: "12 weeks",
      modules: 4,
      rating: 3.7,
      reviews: 2801
    },
    {
      id: 3,
      name: "Internet",
      icon: Zap,
      difficulty: 3,
      progress: 0,
      color: "hsl(0, 84%, 60%)",
      description: "Comprehensive course to build your skills and knowledge",
      duration: "4 weeks",
      modules: 4,
      rating: 3.8,
      reviews: 2762
    },
    {
      id: 4,
      name: "Networking Basics",
      icon: BookOpen,
      difficulty: 1,
      progress: 0,
      color: "hsl(258, 90%, 66%)",
      description: "Comprehensive course to build your skills and knowledge",
      duration: "10 weeks",
      modules: 11,
      rating: 3.6,
      reviews: 4649
    },
    {
      id: 5,
      name: "Advanced Topics",
      icon: Award,
      difficulty: 4,
      progress: 0,
      color: "hsl(142, 71%, 45%)",
      description: "Comprehensive course to build your skills and knowledge",
      duration: "8 weeks",
      modules: 7,
      rating: 4.3,
      reviews: 3421
    }
  ];

  const handleCreateDomain = () => {
    setShowAIInterface(true);
    setUserPrompt("");
    setGeneratedCourses([]);
  };

  const handleSendPrompt = async () => {
    if (!userPrompt.trim()) return;

    setIsLoading(true);
    setShowAIInterface(false);

    try {
      // Call the API
      const response = await fetch("http://localhost:8000/curriculum/generate_curriculum", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: userPrompt,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      console.log(data)

      // Transform API response to match course structure
      if (data.status === "success" && data.data.programs) {
        const difficultyMap = {
          "Beginner": 1,
          "Intermediate": 2,
          "Advanced": 3,
          "Expert": 4,
          "beginner": 1,
          "intermediate": 2,
          "advanced": 3,
          "expert": 4,
        };

        const transformedCourses = data.data.programs.map((program, index) => {
          const difficultyValue = difficultyMap[program.difficulty] || (index % 5 + 1);
          
          return {
            id: program.program_order || index + 1,
            name: program.title,
            icon: [Code2, Brain, Zap, BookOpen, Award][index % 5], // Rotate through icons
            difficulty: difficultyValue, // Convert string to number
            progress: 0,
            color: ["hsl(24, 95%, 53%)", "hsl(189, 94%, 43%)", "hsl(0, 84%, 60%)", "hsl(258, 90%, 66%)", "hsl(142, 71%, 45%)"][index % 5],
            description: program.description,
            duration: `${8 + (index * 2)} weeks`, // Generate duration
            modules: program.key_topics?.length || 4, // Use key_topics length as modules count
            rating: (3.6 + Math.random() * 0.7).toFixed(1),
            reviews: Math.floor(2000 + Math.random() * 3000),
            keyTopics: program.key_topics || [],
          };
        });

        setGeneratedCourses(transformedCourses);
        setDomainCreated(true);
        setMainTopic(data.data.main_topic || userPrompt);
      } else {
        throw new Error("Invalid API response format");
      }
    } catch (error) {
      console.error("API Error, falling back to mock data:", error);
      // Fall back to mock data if API fails
      setGeneratedCourses(mockCourses);
      setDomainCreated(true);
    } finally {
      // Stop the loading animation after API call completes
      setIsLoading(false);
    }
  };

  const handleSaveDomain = async () => {
    if (generatedCourses.length === 0) return;

    try {
      // Get userId from localStorage
      const raw = localStorage.getItem('userData');
      if (!raw) {
        console.error('User data not found in localStorage');
        alert('Please log in first');
        return;
      }

      const userData = JSON.parse(raw);
      const userId = userData.id || userData._id;

      if (!userId) {
        console.error('User ID not found in userData');
        alert('Unable to save domain. Please log in again.');
        return;
      }

      // Convert courses - remove React component objects and keep only serializable data
      const serializedCourses = generatedCourses.map(course => ({
        id: course.id,
        name: course.name,
        icon: typeof course.icon === 'string' ? course.icon : course.icon?.name || 'Sparkles', // Get icon name if it's a component
        difficulty: course.difficulty,
        progress: course.progress || 0,
        color: course.color,
        description: course.description,
        duration: course.duration,
        modules: course.modules,
        rating: course.rating,
        reviews: course.reviews,
        keyTopics: course.keyTopics || [],
      }));

      // Prepare the custom domain data
      const customDomainData = {
        userId,
        name: mainTopic || userPrompt || 'Custom Domain',
        userPrompt,
        mainTopic: mainTopic || userPrompt || 'Custom Domain',
        description: `Custom domain created with AI assistant`,
        courses: serializedCourses,
        icon: 'Sparkles',
        color: 'hsl(48, 96%, 53%)',
        difficulty: 3,
        progress: 0,
        isCustom: true,
      };

      // Save to MongoDB via API
      const response = await fetch('http://localhost:9000/api/custom-domains', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customDomainData),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();

      if (result.status === 'success') {
        // Save to localStorage only
        let localCustomDomains = [];
        try {
          const stored = localStorage.getItem('customDomains');
          if (stored) {
            localCustomDomains = JSON.parse(stored);
          }
        } catch (e) {
          localCustomDomains = [];
        }
        
        // Add custom domain data with mainTopic for display
        const savedDomainData = {
          id: result.data._id || 'custom-' + Date.now(),
          name: mainTopic || userPrompt || 'Custom Domain',
          userPrompt,
          mainTopic: mainTopic || userPrompt || 'Custom Domain',
          description: `Custom domain created with AI assistant`,
          courses: serializedCourses,
          icon: 'Sparkles',
          color: 'hsl(48, 96%, 53%)',
          difficulty: 3,
          progress: 0,
          isCustom: true,
          createdAt: new Date().toISOString(),
        };
        
        localCustomDomains.push(savedDomainData);
        localStorage.setItem('customDomains', JSON.stringify(localCustomDomains));

        // Update local state to show new domain immediately
        setCustomDomains([...customDomains, savedDomainData]);

        // Show success modal
        setDomainSaved(true);
      } else {
        throw new Error(result.message || 'Failed to save domain');
      }
    } catch (error) {
      console.error('Error saving custom domain:', error);
      alert('Failed to save domain. Please try again.');
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 overflow-y-auto relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Craft Your Own Domain
              </h1>
              <motion.button
                onClick={handleCreateDomain}
                disabled={isLoading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
              >
                <Sparkles className="w-5 h-5" strokeWidth={2} />
                Create a Domain
              </motion.button>
            </div>

            {/* AI Interface */}
            <AnimatePresence>
              {showAIInterface && !isLoading && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
                  onClick={() => setShowAIInterface(false)}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white rounded-2xl shadow-2xl border border-brand-200 w-full max-w-2xl flex flex-col max-h-[90vh]"
                  >
                  <div className="bg-gradient-to-r from-brand-600 to-brand-700 rounded-t-2xl p-6 text-white flex-shrink-0">
                    <div className="flex items-center gap-3 mb-2">
                      <Sparkles className="w-6 h-6" strokeWidth={2} />
                      <h3 className="text-2xl font-bold">AI Domain Assistant</h3>
                    </div>
                    <p className="text-base text-brand-100">
                      Hello! 👋 I'm here to help you create a custom assessment domain.
                    </p>
                  </div>

                  <div className="flex-1 overflow-y-auto p-8">
                    <p className="text-base text-gray-600 mb-6 leading-relaxed">
                      <span className="font-semibold text-gray-900 text-lg block mb-4">How to proceed:</span>
                      <span className="block mb-2">✓ Think about a specific skill or topic you want to master</span>
                      <span className="block mb-2">✓ Explain clearly what domain you want to assess</span>
                      <span className="block mb-2">✓ Describe your goals and learning level</span>
                      <span className="block">✓ Send your prompt and we'll generate courses for you!</span>
                    </p>

                    <textarea
                      value={userPrompt}
                      onChange={(e) => setUserPrompt(e.target.value)}
                      placeholder="e.g., I want to learn advanced web development focusing on React, Node.js, and full-stack development..."
                      className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none text-base h-40"
                    />
                  </div>

                  <div className="border-t border-gray-200 p-6 flex-shrink-0 flex gap-4">
                    <motion.button
                      onClick={() => {
                        setShowAIInterface(false);
                        setUserPrompt("");
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 px-6 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded-lg transition-colors text-base"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      onClick={handleSendPrompt}
                      disabled={!userPrompt.trim()}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 px-6 py-3 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors text-base"
                    >
                      <Send className="w-5 h-5" strokeWidth={2} />
                      Send
                    </motion.button>
                  </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Loading Animation */}
            <AnimatePresence>
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-20"
                >
                  <div className="relative w-32 h-32 mb-8">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0"
                    >
                      <div className="w-full h-full rounded-full border-4 border-brand-200 border-t-brand-600" />
                    </motion.div>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-4 flex items-center justify-center"
                    >
                      <Sparkles className="w-12 h-12 text-brand-600" strokeWidth={1.5} />
                    </motion.div>
                  </div>
                  <motion.h2
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-2xl font-bold text-gray-900 text-center"
                  >
                    Generating Your Custom Domain...
                  </motion.h2>
                  <p className="text-gray-600 text-center mt-3 max-w-md">
                    Our AI is analyzing your requirements and creating personalized courses for you.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Generated Courses */}
            <AnimatePresence>
              {!isLoading && domainCreated && generatedCourses.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-12"
                >
                  <div className="mb-8">
                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                      ✨ Your Generated Courses
                    </h2>
                    <p className="text-gray-600">
                      Based on your domain, we've created these learning paths for you.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {generatedCourses.map((course, index) => {
                      const difficultyColors = {
                        1: 'bg-green-100 text-green-800',
                        2: 'bg-amber-100 text-amber-800',
                        3: 'bg-red-100 text-red-800',
                        4: 'bg-purple-100 text-purple-800',
                        5: 'bg-red-100 text-red-800'
                      };
                      
                      const difficultyLabels = {
                        1: 'BEGINNER',
                        2: 'INTERMEDIATE',
                        3: 'ADVANCED',
                        4: 'EXPERT',
                        5: 'EXPERT'
                      };

                      return (
                        <motion.div
                          key={course.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="border-2 border-blue-200 rounded-2xl p-6 hover:border-blue-400 hover:shadow-lg transition-all"
                        >
                          <div className="flex items-start gap-6">
                            {/* Level Circle */}
                            <div className="flex-shrink-0">
                              <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-2xl">
                                {course.id}
                              </div>
                            </div>

                            {/* Course Content */}
                            <div className="flex-1">
                              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                {course.name}
                              </h3>
                              <p className="text-gray-600 text-base mb-4">
                                {course.description}
                              </p>

                              {/* Metadata */}
                              <div className="flex flex-wrap items-center gap-4 mb-4">
                                <span className={`px-3 py-1 rounded-md text-xs font-bold ${difficultyColors[course.difficulty]}`}>
                                  {difficultyLabels[course.difficulty]}
                                </span>
                                <div className="flex items-center gap-1 text-gray-600">
                                  <Clock className="w-4 h-4" strokeWidth={2} />
                                  <span className="text-sm">{course.duration}</span>
                                </div>
                                <div className="flex items-center gap-1 text-gray-600">
                                  <Layers className="w-4 h-4" strokeWidth={2} />
                                  <span className="text-sm">{course.modules} modules</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" strokeWidth={2} />
                                  <span className="text-sm font-semibold text-gray-900">
                                    {course.rating} ({course.reviews.toLocaleString()})
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Dive In Button */}
                            <button className="flex-shrink-0 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap shadow-sm">
                              <Zap className="w-4 h-4" strokeWidth={2} />
                              Dive In
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex justify-center mt-10"
                  >
                    <button onClick={handleSaveDomain} className="group relative px-8 py-4 bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3">
                      <span>Save This Domain</span>
                      <Sparkles className="w-5 h-5" strokeWidth={2} />
                      <div className="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Empty State */}
            {!isLoading && !domainCreated && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20"
              >
                <div className="w-24 h-24 rounded-full bg-brand-100 flex items-center justify-center mb-6">
                  <Sparkles className="w-12 h-12 text-brand-600" strokeWidth={1.5} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Ready to Create Your Domain?
                </h2>
                <p className="text-gray-600 text-center max-w-md mb-6">
                  Click the "Create a Domain" button above to get started. Our AI will help you generate custom courses based on your learning goals.
                </p>
                <motion.button
                  onClick={handleCreateDomain}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 px-8 rounded-xl flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
                >
                  <Sparkles className="w-5 h-5" strokeWidth={2} />
                  Create Your First Domain
                </motion.button>
              </motion.div>
            )}
          </div>

          {/* Success Modal */}
          <AnimatePresence>
            {domainSaved && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                onClick={() => {
                  setDomainSaved(false);
                  navigate('/student/home');
                }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center mx-auto mb-6"
                  >
                    <Check className="w-10 h-10 text-white" strokeWidth={3} />
                  </motion.div>

                  <h2 className="text-3xl font-bold text-gray-900 mb-3">
                    Custom Domain Created! 🎉
                  </h2>
                  <p className="text-gray-600 text-lg mb-2">
                    "{mainTopic || userPrompt || 'Your Domain'}"
                  </p>
                  <p className="text-gray-500 text-sm mb-8">
                    Your custom domain has been saved successfully. You can now access it from your home page.
                  </p>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setDomainSaved(false);
                      navigate('/student/home');
                    }}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-6 rounded-xl transition-all"
                  >
                    Go to Home
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Saved Custom Domains Section */}
          {customDomains.length > 0 && (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="mb-8">
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                  📚 Your Custom Domains
                </h2>
                <p className="text-gray-600">
                  You have created {customDomains.length} custom domain{customDomains.length !== 1 ? 's' : ''}.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {customDomains.map((domain, index) => (
                  <motion.div
                    key={domain.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white border-2 border-brand-200 rounded-2xl p-6 hover:border-brand-400 hover:shadow-lg transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${domain.color}20` }}>
                        <Sparkles className="w-7 h-7" style={{ color: domain.color }} strokeWidth={1.5} />
                      </div>
                      <span className="text-xs font-semibold text-gray-500">Custom</span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-brand-600 transition-colors">
                      {domain.name}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {domain.description || domain.userPrompt}
                    </p>

                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center gap-1 text-gray-600">
                        <BookOpen className="w-4 h-4" strokeWidth={2} />
                        <span className="text-sm">{domain.courses?.length || 0} courses</span>
                      </div>
                    </div>

                    <button className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm">
                      <Zap className="w-4 h-4" strokeWidth={2} />
                      Explore
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CustomDomainBuilder;
