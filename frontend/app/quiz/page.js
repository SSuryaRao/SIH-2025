'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, CheckCircle, ArrowRight, GraduationCap, Calculator, Brain } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function QuizPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('stream');

  // Stream Quiz State
  const [streamQuestions, setStreamQuestions] = useState([]);
  const [streamAnswers, setStreamAnswers] = useState({});
  const [streamResult, setStreamResult] = useState(null);
  const [streamCurrentQuestion, setStreamCurrentQuestion] = useState(0);
  const [streamSubmitting, setStreamSubmitting] = useState(false);

  // Aptitude Test State
  const [aptitudeAnswers, setAptitudeAnswers] = useState({});
  const [aptitudeResult, setAptitudeResult] = useState(null);
  const [aptitudeCurrentQuestion, setAptitudeCurrentQuestion] = useState(0);
  const [aptitudeSubmitting, setAptitudeSubmitting] = useState(false);

  // Reasoning Test State
  const [reasoningAnswers, setReasoningAnswers] = useState({});
  const [reasoningResult, setReasoningResult] = useState(null);
  const [reasoningCurrentQuestion, setReasoningCurrentQuestion] = useState(0);
  const [reasoningSubmitting, setReasoningSubmitting] = useState(false);

  // Common State
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setMounted(true);
    fetchQuestions();
  }, []);

  // Static quiz data
  const aptitudeQuestions = [
    {
      id: 'apt_1',
      text: 'What is 25% of 240?',
      options: [
        { value: '60', label: '60' },
        { value: '65', label: '65' },
        { value: '55', label: '55' },
        { value: '50', label: '50' }
      ],
      correct: '60'
    },
    {
      id: 'apt_2',
      text: 'If a train runs 60 km in 45 minutes, what is its speed in km/h?',
      options: [
        { value: '60', label: '60 km/h' },
        { value: '70', label: '70 km/h' },
        { value: '80', label: '80 km/h' },
        { value: '90', label: '90 km/h' }
      ],
      correct: '80'
    },
    {
      id: 'apt_3',
      text: 'Find the next number: 2, 6, 12, 20, ?',
      options: [
        { value: '28', label: '28' },
        { value: '30', label: '30' },
        { value: '32', label: '32' },
        { value: '34', label: '34' }
      ],
      correct: '30'
    },
    {
      id: 'apt_4',
      text: 'If 5 workers can complete a task in 8 days, how many days will 10 workers take?',
      options: [
        { value: '4', label: '4 days' },
        { value: '6', label: '6 days' },
        { value: '8', label: '8 days' },
        { value: '16', label: '16 days' }
      ],
      correct: '4'
    },
    {
      id: 'apt_5',
      text: 'What is the area of a rectangle with length 12 cm and width 8 cm?',
      options: [
        { value: '96', label: '96 cm²' },
        { value: '40', label: '40 cm²' },
        { value: '48', label: '48 cm²' },
        { value: '20', label: '20 cm²' }
      ],
      correct: '96'
    }
  ];

  const reasoningQuestions = [
    {
      id: 'rea_1',
      text: 'Find the odd one out: Apple, Mango, Banana, Potato',
      options: [
        { value: 'apple', label: 'Apple' },
        { value: 'mango', label: 'Mango' },
        { value: 'banana', label: 'Banana' },
        { value: 'potato', label: 'Potato' }
      ],
      correct: 'potato'
    },
    {
      id: 'rea_2',
      text: 'If CAT = 24, DOG = 26, then RAT = ?',
      options: [
        { value: '28', label: '28' },
        { value: '29', label: '29' },
        { value: '30', label: '30' },
        { value: '31', label: '31' }
      ],
      correct: '30'
    },
    {
      id: 'rea_3',
      text: 'Which direction is opposite to North-East?',
      options: [
        { value: 'southwest', label: 'South-West' },
        { value: 'northwest', label: 'North-West' },
        { value: 'southeast', label: 'South-East' },
        { value: 'east', label: 'East' }
      ],
      correct: 'southwest'
    },
    {
      id: 'rea_4',
      text: 'Complete the series: A, C, F, J, ?',
      options: [
        { value: 'O', label: 'O' },
        { value: 'P', label: 'P' },
        { value: 'Q', label: 'Q' },
        { value: 'R', label: 'R' }
      ],
      correct: 'O'
    },
    {
      id: 'rea_5',
      text: 'If LISTEN = SILENT, then MASTER = ?',
      options: [
        { value: 'STREAM', label: 'STREAM' },
        { value: 'STEARM', label: 'STEARM' },
        { value: 'SMATER', label: 'SMATER' },
        { value: 'STEMRA', label: 'STEMRA' }
      ],
      correct: 'STREAM'
    }
  ];

  const fetchQuestions = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/quiz/questions');
      if (response.ok) {
        const data = await response.json();
        // Flatten all questions from all sections into a single array for stream quiz
        const allQuestions = [
          ...data.interest,
          ...data.aptitude,
          ...data.personality,
        ];
        setStreamQuestions(allQuestions);
      } else {
        setError('Failed to fetch questions');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Tab management
  const tabs = [
    { id: 'stream', label: 'Career Stream Quiz', icon: GraduationCap },
    { id: 'aptitude', label: 'Aptitude Test', icon: Calculator },
    { id: 'reasoning', label: 'Reasoning Test', icon: Brain }
  ];

  // Stream Quiz Handlers
  const handleStreamAnswerChange = (questionId, value) => {
    setStreamAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleStreamNext = () => {
    if (streamCurrentQuestion < streamQuestions.length - 1) {
      setStreamCurrentQuestion(prev => prev + 1);
    }
  };

  const handleStreamPrevious = () => {
    if (streamCurrentQuestion > 0) {
      setStreamCurrentQuestion(prev => prev - 1);
    }
  };

  // Aptitude Test Handlers
  const handleAptitudeAnswerChange = (questionId, value) => {
    setAptitudeAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleAptitudeNext = () => {
    if (aptitudeCurrentQuestion < aptitudeQuestions.length - 1) {
      setAptitudeCurrentQuestion(prev => prev + 1);
    }
  };

  const handleAptitudePrevious = () => {
    if (aptitudeCurrentQuestion > 0) {
      setAptitudeCurrentQuestion(prev => prev - 1);
    }
  };

  // Reasoning Test Handlers
  const handleReasoningAnswerChange = (questionId, value) => {
    setReasoningAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleReasoningNext = () => {
    if (reasoningCurrentQuestion < reasoningQuestions.length - 1) {
      setReasoningCurrentQuestion(prev => prev + 1);
    }
  };

  const handleReasoningPrevious = () => {
    if (reasoningCurrentQuestion > 0) {
      setReasoningCurrentQuestion(prev => prev - 1);
    }
  };

  // Stream Quiz Submission
  const handleStreamSubmit = async () => {
    const answerArray = streamQuestions.map(q => streamAnswers[q.id]);

    if (answerArray.some(answer => answer === undefined || answer === null || answer === '')) {
      setError('Please answer all questions');
      return;
    }

    setStreamSubmitting(true);
    setError('');

    try {
      const token = mounted ? localStorage.getItem('token') : null;
      const headers = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('http://localhost:4000/api/quiz/submit', {
        method: 'POST',
        headers,
        body: JSON.stringify({ answers: answerArray }),
      });

      if (response.ok) {
        const data = await response.json();
        setStreamResult(data);

        // Save to user profile
        if (token) {
          await saveQuizResults({ stream: data });
        }
      } else {
        setError('Failed to submit quiz');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setStreamSubmitting(false);
    }
  };

  // Aptitude Test Submission
  const handleAptitudeSubmit = async () => {
    const totalQuestions = aptitudeQuestions.length;
    let correctAnswers = 0;

    aptitudeQuestions.forEach(question => {
      if (aptitudeAnswers[question.id] === question.correct) {
        correctAnswers++;
      }
    });

    const result = {
      score: correctAnswers,
      total: totalQuestions,
      percentage: Math.round((correctAnswers / totalQuestions) * 100)
    };

    setAptitudeResult(result);

    // Save to user profile
    const token = mounted ? localStorage.getItem('token') : null;
    if (token) {
      await saveQuizResults({ aptitude: result });
    }
  };

  // Reasoning Test Submission
  const handleReasoningSubmit = async () => {
    const totalQuestions = reasoningQuestions.length;
    let correctAnswers = 0;

    reasoningQuestions.forEach(question => {
      if (reasoningAnswers[question.id] === question.correct) {
        correctAnswers++;
      }
    });

    const result = {
      score: correctAnswers,
      total: totalQuestions,
      percentage: Math.round((correctAnswers / totalQuestions) * 100)
    };

    setReasoningResult(result);

    // Save to user profile
    const token = mounted ? localStorage.getItem('token') : null;
    if (token) {
      await saveQuizResults({ reasoning: result });
    }
  };

  // Save quiz results to Firestore
  const saveQuizResults = async (results) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('http://localhost:4000/api/auth/profile', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          quizResults: results
        })
      });

      if (!response.ok) {
        console.error('Failed to save quiz results');
      }
    } catch (err) {
      console.error('Error saving quiz results:', err);
    }
  };

  // Helper functions for current tab
  const getCurrentQuestions = () => {
    switch (activeTab) {
      case 'stream': return streamQuestions;
      case 'aptitude': return aptitudeQuestions;
      case 'reasoning': return reasoningQuestions;
      default: return [];
    }
  };

  const getCurrentQuestion = () => {
    switch (activeTab) {
      case 'stream': return streamCurrentQuestion;
      case 'aptitude': return aptitudeCurrentQuestion;
      case 'reasoning': return reasoningCurrentQuestion;
      default: return 0;
    }
  };

  const getCurrentAnswers = () => {
    switch (activeTab) {
      case 'stream': return streamAnswers;
      case 'aptitude': return aptitudeAnswers;
      case 'reasoning': return reasoningAnswers;
      default: return {};
    }
  };

  const getCurrentResult = () => {
    switch (activeTab) {
      case 'stream': return streamResult;
      case 'aptitude': return aptitudeResult;
      case 'reasoning': return reasoningResult;
      default: return null;
    }
  };

  const isSubmitting = () => {
    switch (activeTab) {
      case 'stream': return streamSubmitting;
      case 'aptitude': return aptitudeSubmitting;
      case 'reasoning': return reasoningSubmitting;
      default: return false;
    }
  };

  const currentQuestions = getCurrentQuestions();
  const currentQuestionIndex = getCurrentQuestion();
  const currentAnswers = getCurrentAnswers();
  const currentResult = getCurrentResult();
  const currentQ = currentQuestions[currentQuestionIndex];

  const progressPercentage = currentQuestions.length > 0 ? ((currentQuestionIndex + 1) / currentQuestions.length) * 100 : 0;
  const isLastQuestion = currentQuestionIndex === currentQuestions.length - 1;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-lg font-medium text-gray-700">Loading quiz questions...</div>
        </motion.div>
      </div>
    );
  }

  // Combined Results Display
  if (streamResult || aptitudeResult || reasoningResult) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50 py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-8"
            >
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Quiz Results
              </h1>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {/* Stream Results */}
              {streamResult && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6"
                >
                  <div className="flex items-center mb-4">
                    <GraduationCap className="w-6 h-6 text-blue-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">Career Stream</h3>
                  </div>
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg p-4 text-center">
                    <div className="text-sm opacity-90">Recommended</div>
                    <div className="text-xl font-bold">
                      {streamResult.recommendedStream.charAt(0).toUpperCase() + streamResult.recommendedStream.slice(1)}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Aptitude Results */}
              {aptitudeResult && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6"
                >
                  <div className="flex items-center mb-4">
                    <Calculator className="w-6 h-6 text-green-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">Aptitude Test</h3>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {aptitudeResult.score}/{aptitudeResult.total}
                    </div>
                    <div className="text-sm text-gray-600 mb-3">{aptitudeResult.percentage}% Score</div>
                    <div className="w-full bg-green-200 rounded-full h-3">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${aptitudeResult.percentage}%` }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        className="bg-green-600 h-3 rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Reasoning Results */}
              {reasoningResult && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-6"
                >
                  <div className="flex items-center mb-4">
                    <Brain className="w-6 h-6 text-purple-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">Reasoning Test</h3>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      {reasoningResult.score}/{reasoningResult.total}
                    </div>
                    <div className="text-sm text-gray-600 mb-3">{reasoningResult.percentage}% Score</div>
                    <div className="w-full bg-purple-200 rounded-full h-3">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${reasoningResult.percentage}%` }}
                        transition={{ delay: 0.7, duration: 0.8 }}
                        className="bg-purple-600 h-3 rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Detailed Stream Results */}
            {streamResult && streamResult.finalScores && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mb-8"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Stream Compatibility Breakdown</h3>
                <div className="space-y-3">
                  {Object.entries(streamResult.finalScores).map(([stream, score], index) => {
                    const maxScore = Math.max(...Object.values(streamResult.finalScores));
                    const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;
                    const colors = {
                      science: { bg: 'bg-blue-100', text: 'text-blue-800', bar: 'bg-blue-500' },
                      arts: { bg: 'bg-purple-100', text: 'text-purple-800', bar: 'bg-purple-500' },
                      commerce: { bg: 'bg-orange-100', text: 'text-orange-800', bar: 'bg-orange-500' },
                      vocational: { bg: 'bg-green-100', text: 'text-green-800', bar: 'bg-green-500' }
                    };

                    return (
                      <div key={stream} className={`${colors[stream]?.bg || 'bg-gray-100'} rounded-lg p-4`}>
                        <div className="flex justify-between items-center mb-2">
                          <h4 className={`font-semibold capitalize ${colors[stream]?.text || 'text-gray-800'}`}>
                            {stream}
                          </h4>
                          <span className={`font-bold ${colors[stream]?.text || 'text-gray-800'}`}>
                            {Math.round(percentage)}%
                          </span>
                        </div>
                        <div className="w-full bg-white rounded-full h-3">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ delay: 0.9 + index * 0.1, duration: 0.8 }}
                            className={`h-3 rounded-full ${colors[stream]?.bar || 'bg-gray-500'}`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => router.push('/dashboard')}
                className="flex-1 max-w-xs bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 rounded-lg hover:scale-105 transition flex items-center justify-center gap-2"
              >
                <ArrowRight className="w-5 h-5" />
                Go to Dashboard
              </button>
              <button
                onClick={() => {
                  setStreamResult(null);
                  setAptitudeResult(null);
                  setReasoningResult(null);
                  setStreamAnswers({});
                  setAptitudeAnswers({});
                  setReasoningAnswers({});
                  setStreamCurrentQuestion(0);
                  setAptitudeCurrentQuestion(0);
                  setReasoningCurrentQuestion(0);
                  setActiveTab('stream');
                }}
                className="flex-1 max-w-xs bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-300 transition"
              >
                Take Tests Again
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Individual test result for Stream Quiz only
  if (activeTab === 'stream' && streamResult && !aptitudeResult && !reasoningResult) {
    // Use finalScores for display (weighted scores) and convert to percentages for visualization
    const maxFinalScore = Math.max(...Object.values(streamResult.finalScores));
    const streams = [
      {
        name: 'Science',
        score: Math.round((streamResult.finalScores.science / maxFinalScore) * 100),
        color: 'blue',
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-800',
        rawScore: streamResult.finalScores.science
      },
      {
        name: 'Commerce',
        score: Math.round((streamResult.finalScores.commerce / maxFinalScore) * 100),
        color: 'orange',
        bgColor: 'bg-orange-100',
        textColor: 'text-orange-800',
        rawScore: streamResult.finalScores.commerce
      },
      {
        name: 'Arts',
        score: Math.round((streamResult.finalScores.arts / maxFinalScore) * 100),
        color: 'purple',
        bgColor: 'bg-purple-100',
        textColor: 'text-purple-800',
        rawScore: streamResult.finalScores.arts
      },
      {
        name: 'Vocational',
        score: Math.round((streamResult.finalScores.vocational / maxFinalScore) * 100),
        color: 'green',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        rawScore: streamResult.finalScores.vocational
      }
    ];

    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50 py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-8"
            >
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Quiz Complete!
              </h1>
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg p-4 inline-block">
                <h2 className="text-xl font-bold">
                  Your Recommended Stream: {result.recommendedStream}
                </h2>
              </div>
            </motion.div>

            <div className="space-y-6 mb-8">
              {/* Stream Scores */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Stream Compatibility</h3>
                <div className="space-y-3">
                  {streams.map((stream, index) => (
                    <motion.div
                      key={stream.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className={`${stream.bgColor} rounded-lg p-4`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h4 className={`font-semibold ${stream.textColor}`}>{stream.name}</h4>
                        <span className={`font-bold ${stream.textColor}`}>{stream.score}%</span>
                      </div>
                      <div className="w-full bg-white rounded-full h-3">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${stream.score}%` }}
                          transition={{ delay: 0.6 + index * 0.1, duration: 0.8 }}
                          className={`bg-gradient-to-r from-${stream.color}-400 to-${stream.color}-600 h-3 rounded-full`}
                        ></motion.div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Aptitude Breakdown */}
              {result.aptitudeScores && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Aptitude Performance ({Math.round(result.aptitudePercentage)}% Overall)
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(result.aptitudeScores).map(([type, score], index) => (
                      <motion.div
                        key={type}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                        className="bg-indigo-50 rounded-lg p-3"
                      >
                        <div className="text-sm font-medium text-indigo-800 capitalize">{type}</div>
                        <div className="text-lg font-bold text-indigo-900">{score}/2</div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Personality Traits */}
              {result.personalityScores && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Personality Traits</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(result.personalityScores).map(([trait, score], index) => (
                      <motion.div
                        key={trait}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.0 + index * 0.1 }}
                        className="bg-purple-50 rounded-lg p-3"
                      >
                        <div className="text-sm font-medium text-purple-800 capitalize">{trait}</div>
                        <div className="text-lg font-bold text-purple-900">{score}/5</div>
                        <div className="w-full bg-purple-200 rounded-full h-2 mt-1">
                          <div
                            className="bg-purple-600 h-2 rounded-full"
                            style={{ width: `${(score / 5) * 100}%` }}
                          ></div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 rounded-lg hover:scale-105 transition flex items-center justify-center gap-2"
              >
                <ArrowRight className="w-5 h-5" />
                Go to Dashboard
              </button>
              <button
                onClick={() => {
                  setResult(null);
                  setAnswers({});
                  setCurrentQuestion(0);
                }}
                className="flex-1 bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-300 transition"
              >
                Take Quiz Again
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50 py-6 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Career Assessment Hub
          </h1>
          <p className="text-gray-600">
            Complete comprehensive tests to discover your ideal career path
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row justify-center mb-8 gap-2 sm:gap-1"
        >
          <div className="flex flex-col sm:flex-row bg-white rounded-xl p-1 shadow-lg">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const hasResult =
                (tab.id === 'stream' && streamResult) ||
                (tab.id === 'aptitude' && aptitudeResult) ||
                (tab.id === 'reasoning' && reasoningResult);

              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm sm:text-base">{tab.label}</span>
                  {hasResult && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Current Test Info */}
        {currentQuestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-6"
          >
            <p className="text-gray-600">
              Question {currentQuestionIndex + 1} of {currentQuestions.length}
            </p>
          </motion.div>
        )}

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full bg-gray-200 rounded-full h-2 mb-6"
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5 }}
            className="bg-blue-600 h-2 rounded-full"
          ></motion.div>
        </motion.div>

        {/* Section Header */}
        {currentQ && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-4"
          >
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
              {activeTab === 'stream' && currentQ.section === 'interest' && '💡 Interest Assessment'}
              {activeTab === 'stream' && currentQ.section === 'aptitude' && '🧠 Aptitude Test'}
              {activeTab === 'stream' && currentQ.section === 'personality' && '🎯 Personality Evaluation'}
              {activeTab === 'aptitude' && '🧮 Aptitude Test'}
              {activeTab === 'reasoning' && '🧠 Reasoning Test'}
            </div>
          </motion.div>
        )}

        {/* Question Card */}
        <AnimatePresence mode="wait">
          {currentQ && (
            <motion.div
              key={`${activeTab}-${currentQuestionIndex}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="bg-white shadow-md rounded-lg p-6 mb-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                {currentQ.text}
              </h2>

              <div className="space-y-3">
                {currentQ.options.map((option, idx) => {
                  const handleAnswerChange =
                    activeTab === 'stream' ? handleStreamAnswerChange :
                    activeTab === 'aptitude' ? handleAptitudeAnswerChange :
                    handleReasoningAnswerChange;

                  return (
                    <motion.label
                      key={`${currentQ.id}-${idx}`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`block border rounded-lg p-3 cursor-pointer bg-white transition-all ${
                        currentAnswers[currentQ.id] === option.value
                          ? 'border-blue-600 bg-blue-50 text-blue-800 font-medium'
                          : 'border-gray-300 text-gray-800 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name={`question-${currentQ.id}`}
                          value={option.value}
                          checked={currentAnswers[currentQ.id] === option.value}
                          onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span>{option.label}</span>
                      </div>
                    </motion.label>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-100 text-red-800 border border-red-300 rounded-lg p-3 mb-6 text-center"
          >
            {error}
          </motion.div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center gap-4 md:relative fixed bottom-4 left-4 right-4 md:bottom-auto md:left-auto md:right-auto">
          <button
            onClick={() => {
              if (activeTab === 'stream') handleStreamPrevious();
              else if (activeTab === 'aptitude') handleAptitudePrevious();
              else handleReasoningPrevious();
            }}
            disabled={currentQuestionIndex === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold hover:scale-105 transition bg-gray-200 text-gray-700 disabled:opacity-50 disabled:transform-none"
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>

          {isLastQuestion ? (
            <button
              onClick={() => {
                if (activeTab === 'stream') handleStreamSubmit();
                else if (activeTab === 'aptitude') handleAptitudeSubmit();
                else handleReasoningSubmit();
              }}
              disabled={isSubmitting() || !currentAnswers[currentQ?.id]}
              className="flex items-center gap-2 px-6 py-2 rounded-lg font-semibold hover:scale-105 transition bg-green-600 text-white disabled:opacity-50 disabled:transform-none"
            >
              {isSubmitting() ? 'Submitting...' :
                activeTab === 'stream' ? 'Submit Quiz' :
                activeTab === 'aptitude' ? 'Submit Aptitude Test' :
                'Submit Reasoning Test'
              }
              <CheckCircle className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={() => {
                if (activeTab === 'stream') handleStreamNext();
                else if (activeTab === 'aptitude') handleAptitudeNext();
                else handleReasoningNext();
              }}
              disabled={!currentAnswers[currentQ?.id]}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold hover:scale-105 transition bg-blue-600 text-white disabled:opacity-50 disabled:transform-none"
            >
              Next
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Mobile spacing */}
        <div className="h-20 md:hidden"></div>
      </div>
    </div>
  );
}