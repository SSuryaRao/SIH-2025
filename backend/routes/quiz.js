import express from "express";
import jwt from "jsonwebtoken";
import db from "../firebase.js";

const router = express.Router();

const questions = [
  {
    id: 1,
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
    text: "What motivates you most?",
    options: [
      { value: "science", label: "Understanding how things work" },
      { value: "arts", label: "Expressing ideas and emotions" },
      { value: "commerce", label: "Building wealth and success" },
      { value: "vocational", label: "Creating useful things" },
    ],
  },
];

// GET quiz questions
router.get("/questions", (req, res) => {
  res.json(questions);
});

// POST quiz submission
router.post("/submit", async (req, res) => {
  const { answers } = req.body;

  const scores = {
    science: 0,
    arts: 0,
    commerce: 0,
    vocational: 0,
  };

  answers.forEach((answer) => {
    if (scores.hasOwnProperty(answer)) {
      scores[answer]++;
    }
  });

  let recommendedStream = "science";
  let maxScore = scores.science;

  Object.keys(scores).forEach((stream) => {
    if (scores[stream] > maxScore) {
      maxScore = scores[stream];
      recommendedStream = stream;
    }
  });

  const result = {
    recommendedStream,
    scores,
  };

  // Save result if user is logged in
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);

    try {
      const decoded = jwt.verify(token, "secretkey");

      // ✅ await is now valid because handler is async
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
