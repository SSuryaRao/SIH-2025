'use client';

import { useState, useEffect } from 'react';

export default function QuizPage() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/quiz/questions');
      if (response.ok) {
        const data = await response.json();
        setQuestions(data);
      } else {
        setError('Failed to fetch questions');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const answerArray = questions.map(q => answers[q.id]);

    if (answerArray.some(answer => !answer)) {
      setError('Please answer all questions');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
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
        setResult(data);
      } else {
        setError('Failed to submit quiz');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg">Loading quiz questions...</div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
              Quiz Results
            </h1>

            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-blue-600 mb-4">
                Recommended Stream: {result.recommendedStream}
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-100 p-4 rounded">
                <h3 className="font-semibold text-gray-700">Science</h3>
                <p className="text-2xl font-bold text-blue-600">{result.scores.science}</p>
              </div>
              <div className="bg-gray-100 p-4 rounded">
                <h3 className="font-semibold text-gray-700">Arts</h3>
                <p className="text-2xl font-bold text-green-600">{result.scores.arts}</p>
              </div>
              <div className="bg-gray-100 p-4 rounded">
                <h3 className="font-semibold text-gray-700">Commerce</h3>
                <p className="text-2xl font-bold text-yellow-600">{result.scores.commerce}</p>
              </div>
              <div className="bg-gray-100 p-4 rounded">
                <h3 className="font-semibold text-gray-700">Vocational</h3>
                <p className="text-2xl font-bold text-purple-600">{result.scores.vocational}</p>
              </div>
            </div>

            <button
              onClick={() => {
                setResult(null);
                setAnswers({});
              }}
              className="w-full mt-8 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Take Quiz Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Career Guidance Quiz
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {questions.map((question) => (
            <div key={question.id} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {question.text}
              </h2>

              <div className="space-y-3">
                {question.options.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center space-x-3 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={option.value}
                      checked={answers[question.id] === option.value}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          {error && (
            <div className="text-center text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-lg font-semibold"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}