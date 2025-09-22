import express from "express";
import jwt from "jsonwebtoken";
import db from "../firebase.js";

const router = express.Router();

const questions = {
  interest: [
    {
      id: 1,
      section: "interest",
      text: "Which activity do you enjoy most?",
      options: [
        { value: "science", label: "Solving math/science problems" },
        { value: "arts", label: "Reading literature / creative writing" },
        { value: "commerce", label: "Managing money or business ideas" },
        { value: "vocational", label: "Working with hands / practical skills" },
      ],
    },
    {
      id: 2,
      section: "interest",
      text: "What type of career appeals to you?",
      options: [
        { value: "science", label: "Research scientist or engineer" },
        { value: "arts", label: "Artist, writer, or teacher" },
        { value: "commerce", label: "Business owner or accountant" },
        { value: "vocational", label: "Technician or craftsperson" },
      ],
    },
    {
      id: 3,
      section: "interest",
      text: "Which subject did you perform best in?",
      options: [
        { value: "science", label: "Mathematics and Physics" },
        { value: "arts", label: "Language and History" },
        { value: "commerce", label: "Economics and Statistics" },
        { value: "vocational", label: "Practical workshops" },
      ],
    },
    {
      id: 4,
      section: "interest",
      text: "How do you prefer to solve problems?",
      options: [
        { value: "science", label: "Using logical analysis and formulas" },
        { value: "arts", label: "Through creative and intuitive thinking" },
        { value: "commerce", label: "By analyzing costs and benefits" },
        { value: "vocational", label: "Through hands-on experimentation" },
      ],
    },
    {
      id: 5,
      section: "interest",
      text: "What motivates you most?",
      options: [
        { value: "science", label: "Understanding how things work" },
        { value: "arts", label: "Expressing ideas and emotions" },
        { value: "commerce", label: "Building wealth and success" },
        { value: "vocational", label: "Creating useful things" },
      ],
    },
    {
      id: 6,
      section: "interest",
      text: "In your free time, you prefer to:",
      options: [
        { value: "science", label: "Experiment with gadgets or code" },
        { value: "arts", label: "Read books or create art" },
        { value: "commerce", label: "Learn about investments or startups" },
        { value: "vocational", label: "Fix things or learn new skills" },
      ],
    },
    {
      id: 7,
      section: "interest",
      text: "Which environment appeals to you most?",
      options: [
        { value: "science", label: "Laboratory or research facility" },
        { value: "arts", label: "Studio or cultural center" },
        { value: "commerce", label: "Corporate office or marketplace" },
        { value: "vocational", label: "Workshop or field site" },
      ],
    },
    {
      id: 8,
      section: "interest",
      text: "What type of impact do you want to make?",
      options: [
        { value: "science", label: "Advance human knowledge and technology" },
        { value: "arts", label: "Inspire and educate through creativity" },
        { value: "commerce", label: "Create economic value and opportunities" },
        { value: "vocational", label: "Build and improve practical solutions" },
      ],
    },
  ],

  aptitude: [
    {
      id: 9,
      section: "aptitude",
      type: "logical",
      text: "What comes next in the sequence: 2, 6, 18, 54, ?",
      options: [
        { value: "162", label: "162", correct: true },
        { value: "108", label: "108", correct: false },
        { value: "216", label: "216", correct: false },
        { value: "144", label: "144", correct: false },
      ],
    },
    {
      id: 10,
      section: "aptitude",
      type: "numerical",
      text: "If 40% of a number is 80, what is 25% of that number?",
      options: [
        { value: "50", label: "50", correct: true },
        { value: "40", label: "40", correct: false },
        { value: "60", label: "60", correct: false },
        { value: "45", label: "45", correct: false },
      ],
    },
    {
      id: 11,
      section: "aptitude",
      type: "verbal",
      text: "Choose the word that best completes: 'Book is to Library as Painting is to ___'",
      options: [
        { value: "Gallery", label: "Gallery", correct: true },
        { value: "Frame", label: "Frame", correct: false },
        { value: "Artist", label: "Artist", correct: false },
        { value: "Canvas", label: "Canvas", correct: false },
      ],
    },
    {
      id: 12,
      section: "aptitude",
      type: "spatial",
      text: "If you rotate a square 45 degrees clockwise, which shape describes the result?",
      options: [
        { value: "Diamond/rhombus orientation", label: "Diamond/rhombus orientation", correct: true },
        { value: "Rectangle", label: "Rectangle", correct: false },
        { value: "Triangle", label: "Triangle", correct: false },
        { value: "Circle", label: "Circle", correct: false },
      ],
    },
    {
      id: 13,
      section: "aptitude",
      type: "logical",
      text: "All roses are flowers. Some flowers are red. Therefore:",
      options: [
        { value: "Some roses may be red", label: "Some roses may be red", correct: true },
        { value: "All roses are red", label: "All roses are red", correct: false },
        { value: "No roses are red", label: "No roses are red", correct: false },
        { value: "All red things are roses", label: "All red things are roses", correct: false },
      ],
    },
    {
      id: 14,
      section: "aptitude",
      type: "numerical",
      text: "A train travels 120 km in 2 hours. At this rate, how far will it travel in 5 hours?",
      options: [
        { value: "300 km", label: "300 km", correct: true },
        { value: "240 km", label: "240 km", correct: false },
        { value: "360 km", label: "360 km", correct: false },
        { value: "250 km", label: "250 km", correct: false },
      ],
    },
    {
      id: 15,
      section: "aptitude",
      type: "verbal",
      text: "Which word is the antonym of 'Abundant'?",
      options: [
        { value: "Scarce", label: "Scarce", correct: true },
        { value: "Plentiful", label: "Plentiful", correct: false },
        { value: "Rich", label: "Rich", correct: false },
        { value: "Multiple", label: "Multiple", correct: false },
      ],
    },
    {
      id: 16,
      section: "aptitude",
      type: "spatial",
      text: "How many cubes are there in a 3x3x3 cube structure?",
      options: [
        { value: "27", label: "27", correct: true },
        { value: "18", label: "18", correct: false },
        { value: "24", label: "24", correct: false },
        { value: "21", label: "21", correct: false },
      ],
    },
  ],

  personality: [
    {
      id: 17,
      section: "personality",
      type: "creative",
      text: "I enjoy brainstorming new ideas and thinking outside the box",
      scale: true,
      options: [
        { value: 1, label: "Strongly Disagree" },
        { value: 2, label: "Disagree" },
        { value: 3, label: "Neutral" },
        { value: 4, label: "Agree" },
        { value: 5, label: "Strongly Agree" },
      ],
    },
    {
      id: 18,
      section: "personality",
      type: "analytical",
      text: "I prefer to analyze data and facts before making decisions",
      scale: true,
      options: [
        { value: 1, label: "Strongly Disagree" },
        { value: 2, label: "Disagree" },
        { value: 3, label: "Neutral" },
        { value: 4, label: "Agree" },
        { value: 5, label: "Strongly Agree" },
      ],
    },
    {
      id: 19,
      section: "personality",
      type: "leader",
      text: "I feel comfortable taking charge and leading group projects",
      scale: true,
      options: [
        { value: 1, label: "Strongly Disagree" },
        { value: 2, label: "Disagree" },
        { value: 3, label: "Neutral" },
        { value: 4, label: "Agree" },
        { value: 5, label: "Strongly Agree" },
      ],
    },
    {
      id: 20,
      section: "personality",
      type: "practical",
      text: "I prefer practical, hands-on approaches to theoretical concepts",
      scale: true,
      options: [
        { value: 1, label: "Strongly Disagree" },
        { value: 2, label: "Disagree" },
        { value: 3, label: "Neutral" },
        { value: 4, label: "Agree" },
        { value: 5, label: "Strongly Agree" },
      ],
    },
  ],
};

// GET quiz questions
router.get("/questions", (req, res) => {
  res.json(questions);
});

// POST quiz submission
router.post("/submit", async (req, res) => {
  const { answers } = req.body;

  // Initialize section scores
  const streamScores = {
    science: 0,
    arts: 0,
    commerce: 0,
    vocational: 0,
  };

  const aptitudeScores = {
    logical: 0,
    numerical: 0,
    verbal: 0,
    spatial: 0,
  };

  const personalityScores = {
    creative: 0,
    analytical: 0,
    leader: 0,
    practical: 0,
  };

  // Get all questions for answer mapping
  const allQuestions = [
    ...questions.interest,
    ...questions.aptitude,
    ...questions.personality,
  ];

  // Process answers
  answers.forEach((answer, index) => {
    const question = allQuestions[index];

    if (!question || !answer) return;

    if (question.section === "interest") {
      // Interest questions contribute to stream scores
      if (streamScores.hasOwnProperty(answer)) {
        streamScores[answer]++;
      }
    } else if (question.section === "aptitude") {
      // Aptitude questions contribute to aptitude scores
      if (question.type && aptitudeScores.hasOwnProperty(question.type)) {
        // For aptitude questions, check if answer is correct
        const selectedOption = question.options.find(opt => opt.value === answer);
        if (selectedOption && selectedOption.correct === true) {
          aptitudeScores[question.type]++;
        }
      }
    } else if (question.section === "personality") {
      // Personality questions contribute to personality scores
      if (question.type && personalityScores.hasOwnProperty(question.type)) {
        // For personality questions, use the scale value (1-5)
        const scaleValue = parseInt(answer) || 0;
        personalityScores[question.type] += scaleValue;
      }
    }
  });

  // Calculate weighted scores for stream recommendation
  // Interest: 50%, Aptitude: 30%, Personality: 20%
  const totalInterestQuestions = questions.interest.length;
  const totalAptitudeQuestions = questions.aptitude.length;
  const totalPersonalityQuestions = questions.personality.length;

  // Normalize scores to percentages
  const normalizedStreamScores = {};
  Object.keys(streamScores).forEach(stream => {
    normalizedStreamScores[stream] = (streamScores[stream] / totalInterestQuestions) * 100;
  });

  // Calculate overall aptitude score (percentage of correct answers)
  const totalAptitudeCorrect = Object.values(aptitudeScores).reduce((sum, score) => sum + score, 0);
  const aptitudePercentage = (totalAptitudeCorrect / totalAptitudeQuestions) * 100;

  // Map aptitude performance to streams (higher aptitude favors science/commerce)
  const aptitudeStreamBonus = {
    science: aptitudePercentage * 0.8,
    commerce: aptitudePercentage * 0.6,
    arts: aptitudePercentage * 0.3,
    vocational: aptitudePercentage * 0.4,
  };

  // Normalize personality scores (max possible per trait is 5, we want percentage)
  const maxPersonalityScore = 5;
  const normalizedPersonalityScores = {};
  Object.keys(personalityScores).forEach(trait => {
    normalizedPersonalityScores[trait] = (personalityScores[trait] / maxPersonalityScore) * 100;
  });

  // Calculate personality influence on streams using normalized scores
  const personalityStreamBonus = {
    science: (normalizedPersonalityScores.analytical + normalizedPersonalityScores.practical) * 0.5,
    arts: (normalizedPersonalityScores.creative + normalizedPersonalityScores.analytical) * 0.5,
    commerce: (normalizedPersonalityScores.leader + normalizedPersonalityScores.analytical) * 0.5,
    vocational: (normalizedPersonalityScores.practical + normalizedPersonalityScores.leader) * 0.5,
  };

  // Calculate final weighted scores
  const finalScores = {};
  Object.keys(streamScores).forEach(stream => {
    finalScores[stream] =
      (normalizedStreamScores[stream] * 0.5) +  // Interest: 50%
      (aptitudeStreamBonus[stream] * 0.3) +     // Aptitude: 30%
      (personalityStreamBonus[stream] * 0.2);   // Personality: 20%
  });

  // Determine recommended stream
  let recommendedStream = "science";
  let maxScore = finalScores.science;

  Object.keys(finalScores).forEach((stream) => {
    if (finalScores[stream] > maxScore) {
      maxScore = finalScores[stream];
      recommendedStream = stream;
    }
  });

  // Prepare result object
  const result = {
    recommendedStream,
    scores: streamScores, // Raw interest scores for backward compatibility
    finalScores, // Weighted final scores
    streamScores,
    aptitudeScores,
    personalityScores,
    aptitudePercentage,
    sectionBreakdown: {
      interest: {
        weight: 50,
        scores: streamScores,
        normalized: normalizedStreamScores
      },
      aptitude: {
        weight: 30,
        percentage: aptitudePercentage,
        scores: aptitudeScores,
        totalCorrect: totalAptitudeCorrect,
        totalQuestions: totalAptitudeQuestions
      },
      personality: {
        weight: 20,
        scores: personalityScores,
        normalizedScores: normalizedPersonalityScores,
        totalQuestions: totalPersonalityQuestions
      }
    }
  };

  // Save result if user is logged in
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");

      console.log("Saving quiz result for user:", decoded.username);
      console.log("Quiz result being saved:", {
        recommendedStream: result.recommendedStream,
        hasScores: !!result.scores,
        hasFinalScores: !!result.finalScores
      });

      await db.collection("users").doc(decoded.username).update({
        quizResult: result,
      });

      console.log("Quiz result saved successfully for user:", decoded.username);
    } catch (error) {
      console.error("Quiz result save error:", error);
      // don't block response on error
    }
  } else {
    console.log("No authentication token provided - quiz result not saved");
  }

  res.json(result);
});

export default router;
