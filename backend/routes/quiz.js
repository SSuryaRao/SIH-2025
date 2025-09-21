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
        { value: "correct", label: "162" },
        { value: "wrong", label: "108" },
        { value: "wrong", label: "216" },
        { value: "wrong", label: "144" },
      ],
    },
    {
      id: 10,
      section: "aptitude",
      type: "numerical",
      text: "If 40% of a number is 80, what is 25% of that number?",
      options: [
        { value: "correct", label: "50" },
        { value: "wrong", label: "40" },
        { value: "wrong", label: "60" },
        { value: "wrong", label: "45" },
      ],
    },
    {
      id: 11,
      section: "aptitude",
      type: "verbal",
      text: "Choose the word that best completes: 'Book is to Library as Painting is to ___'",
      options: [
        { value: "correct", label: "Gallery" },
        { value: "wrong", label: "Frame" },
        { value: "wrong", label: "Artist" },
        { value: "wrong", label: "Canvas" },
      ],
    },
    {
      id: 12,
      section: "aptitude",
      type: "spatial",
      text: "If you rotate a square 45 degrees clockwise, which shape describes the result?",
      options: [
        { value: "correct", label: "Diamond/rhombus orientation" },
        { value: "wrong", label: "Rectangle" },
        { value: "wrong", label: "Triangle" },
        { value: "wrong", label: "Circle" },
      ],
    },
    {
      id: 13,
      section: "aptitude",
      type: "logical",
      text: "All roses are flowers. Some flowers are red. Therefore:",
      options: [
        { value: "correct", label: "Some roses may be red" },
        { value: "wrong", label: "All roses are red" },
        { value: "wrong", label: "No roses are red" },
        { value: "wrong", label: "All red things are roses" },
      ],
    },
    {
      id: 14,
      section: "aptitude",
      type: "numerical",
      text: "A train travels 120 km in 2 hours. At this rate, how far will it travel in 5 hours?",
      options: [
        { value: "correct", label: "300 km" },
        { value: "wrong", label: "240 km" },
        { value: "wrong", label: "360 km" },
        { value: "wrong", label: "250 km" },
      ],
    },
    {
      id: 15,
      section: "aptitude",
      type: "verbal",
      text: "Which word is the antonym of 'Abundant'?",
      options: [
        { value: "correct", label: "Scarce" },
        { value: "wrong", label: "Plentiful" },
        { value: "wrong", label: "Rich" },
        { value: "wrong", label: "Multiple" },
      ],
    },
    {
      id: 16,
      section: "aptitude",
      type: "spatial",
      text: "How many cubes are there in a 3x3x3 cube structure?",
      options: [
        { value: "correct", label: "27" },
        { value: "wrong", label: "18" },
        { value: "wrong", label: "24" },
        { value: "wrong", label: "21" },
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
        if (selectedOption && selectedOption.value === "correct") {
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

  // Calculate personality influence on streams
  const personalityStreamBonus = {
    science: (personalityScores.analytical + personalityScores.practical) * 2,
    arts: (personalityScores.creative + personalityScores.analytical) * 2,
    commerce: (personalityScores.leader + personalityScores.analytical) * 2,
    vocational: (personalityScores.practical + personalityScores.leader) * 2,
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
        totalQuestions: totalPersonalityQuestions
      }
    }
  };

  // Save result if user is logged in
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);

    try {
      const decoded = jwt.verify(token, "secretkey");

      await db.collection("users").doc(decoded.username).update({
        quizResult: result,
      });
    } catch (error) {
      console.error("Quiz result save error:", error);
      // don't block response on error
    }
  }

  res.json(result);
});

export default router;
