import express from 'express';
import jwt from 'jsonwebtoken';
import db from '../firebase.js';

const router = express.Router();

// Middleware to verify JWT token
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Haversine formula to calculate distance between two coordinates
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
}

// GET /api/recommendations/debug - Debug endpoint to check user data
router.get('/debug', requireAuth, async (req, res) => {
  try {
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('username', '==', req.user.username).get();

    if (snapshot.empty) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();

    // Return debug information
    return res.json({
      username: req.user.username,
      hasQuizResult: !!userData.quizResult,
      recommendedStream: userData.quizResult?.recommendedStream || null,
      classLevel: userData.classLevel || null,
      fullQuizResult: userData.quizResult || null
    });
  } catch (error) {
    console.error('Debug error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// GET /api/recommendations - Get personalized recommendations
router.get('/', requireAuth, async (req, res) => {
  try {
    // Fetch user profile from Firestore
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('username', '==', req.user.username).get();

    if (snapshot.empty) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();

    console.log('User data for recommendations:', {
      username: req.user.username,
      hasQuizResult: !!userData.quizResult,
      recommendedStream: userData.quizResult?.recommendedStream,
      classLevel: userData.classLevel
    });

    // Check if user has taken the quiz
    if (!userData.quizResult || !userData.quizResult.recommendedStream) {
      return res.json({
        recommendedStream: '',
        classLevel: userData.classLevel || '12',
        courses: [],
        colleges: [],
        events: [],
        careers: [],
        message: "Take the quiz to unlock personalized recommendations"
      });
    }

    const recommendedStream = userData.quizResult.recommendedStream;
    const classLevel = userData.classLevel || '12'; // Default to class 12 if not specified
    const today = new Date().toISOString().split('T')[0];

    // Class-level aware career suggestions mapping
    const getCareerSuggestions = (stream, level) => {
      const careerMapping = {
        'science': {
          '10': ['Engineering Prep', 'Medical Prep', 'Research Pathways', 'IT Foundation'],
          '12': ['Engineering', 'Medicine', 'Research', 'IT', 'Data Science'],
          'UG': ['Research Scholar', 'Software Engineer', 'Lab Technician', 'Data Analyst'],
          'PG': ['PhD', 'Research Scientist', 'Senior Engineer', 'Professor']
        },
        'arts': {
          '10': ['Creative Writing', 'Social Studies', 'Language Skills', 'Cultural Arts'],
          '12': ['Civil Services', 'Journalism', 'Teaching', 'Creative Arts'],
          'UG': ['Content Writer', 'Teacher', 'Social Worker', 'Media Professional'],
          'PG': ['Civil Services', 'Professor', 'Research Scholar', 'Policy Analyst']
        },
        'commerce': {
          '10': ['Business Basics', 'Accounting Foundation', 'Economics Study', 'Entrepreneurship'],
          '12': ['Accounting', 'Banking', 'Finance', 'Business Management'],
          'UG': ['Financial Analyst', 'Marketing Executive', 'HR Professional', 'Business Analyst'],
          'PG': ['Senior Manager', 'Financial Advisor', 'Business Consultant', 'Entrepreneur']
        },
        'vocational': {
          '10': ['Skill Development', 'Technical Training', 'Craft Learning', 'Trade Preparation'],
          '12': ['Technician', 'Skilled Worker', 'Craft Specialist', 'Industry Professional'],
          'UG': ['Senior Technician', 'Supervisor', 'Quality Controller', 'Technical Specialist'],
          'PG': ['Technical Manager', 'Training Specialist', 'Industry Consultant', 'Entrepreneur']
        }
      };

      return careerMapping[stream]?.[level] || careerMapping[stream]?.['12'] || [];
    };

    const careers = getCareerSuggestions(recommendedStream, classLevel);

    // Get recommended courses based on stream and class level
    const coursesSnapshot = await db.collection('courses').get();
    const allCourses = coursesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Class-level aware course mapping
    const getCourseRecommendations = (stream, level) => {
      const courseMappings = {
        'science': {
          '10': ['Class 11 Science (PCM)', 'Class 11 Science (PCB)', 'Class 11 Science', 'Science Stream'],
          '12': ['B.Sc.', 'B.Tech', 'MBBS', 'B.E.', 'B.Pharm', 'B.Arch', 'BCA'],
          'UG': ['M.Sc.', 'M.Tech', 'MBA', 'PhD', 'M.E.', 'MCA'],
          'PG': ['PhD', 'Post-Doc', 'Research', 'Advanced Diploma']
        },
        'arts': {
          '10': ['Class 11 Humanities', 'Class 11 Arts', 'Arts Stream', 'Humanities Stream'],
          '12': ['B.A.', 'B.F.A.', 'B.S.W.', 'B.J.M.C.', 'B.Ed', 'B.Lib', 'BBA'],
          'UG': ['M.A.', 'M.F.A.', 'M.S.W.', 'M.Ed', 'MBA', 'M.Phil'],
          'PG': ['PhD', 'Post-Doc', 'Research', 'Advanced Diploma']
        },
        'commerce': {
          '10': ['Class 11 Commerce', 'Commerce Stream', 'Business Studies Stream'],
          '12': ['B.Com', 'BBA', 'B.C.A.', 'CA', 'B.B.A', 'B.F.M', 'CS'],
          'UG': ['M.Com', 'MBA', 'MCA', 'CA', 'CS', 'CMA'],
          'PG': ['PhD', 'Post-Doc', 'Research', 'Advanced Diploma']
        },
        'vocational': {
          '10': ['Class 11 Vocational', 'Polytechnic Prep', 'Technical Training', 'Skill Development'],
          '12': ['Diploma', 'ITI', 'Polytechnic', 'Certificate', 'B.Voc'],
          'UG': ['Advanced Diploma', 'Higher Certificate', 'Professional Course'],
          'PG': ['Master Certificate', 'Advanced Professional Course']
        }
      };

      return courseMappings[stream]?.[level] || courseMappings[stream]?.['12'] || [];
    };

    // Create fallback courses if none found in database
    const createFallbackCourses = (stream, level) => {
      const fallbackCourses = {
        'science': {
          '10': [
            { course: 'Class 11 Science (PCM)', careers: ['Engineering', 'Technology', 'Mathematics'], higherStudies: ['B.Tech', 'B.E.', 'B.Sc. Physics'] },
            { course: 'Class 11 Science (PCB)', careers: ['Medicine', 'Biology Research', 'Healthcare'], higherStudies: ['MBBS', 'B.Sc. Biology', 'Pharmacy'] }
          ],
          '12': [
            { course: 'B.Tech Engineering', careers: ['Software Engineer', 'Mechanical Engineer'], higherStudies: ['M.Tech', 'MBA'] },
            { course: 'MBBS Medicine', careers: ['Doctor', 'Surgeon', 'Medical Research'], higherStudies: ['MD', 'MS'] }
          ]
        },
        'arts': {
          '10': [
            { course: 'Class 11 Humanities', careers: ['Writing', 'Teaching', 'Social Work'], higherStudies: ['B.A.', 'B.S.W.', 'B.Ed'] },
            { course: 'Class 11 Arts', careers: ['Creative Arts', 'Literature', 'History'], higherStudies: ['B.A.', 'B.F.A.'] }
          ],
          '12': [
            { course: 'B.A. Liberal Arts', careers: ['Civil Services', 'Teaching', 'Journalism'], higherStudies: ['M.A.', 'MBA'] },
            { course: 'B.F.A. Fine Arts', careers: ['Artist', 'Designer', 'Art Director'], higherStudies: ['M.F.A.'] }
          ]
        },
        'commerce': {
          '10': [
            { course: 'Class 11 Commerce', careers: ['Accounting', 'Business', 'Finance'], higherStudies: ['B.Com', 'BBA', 'CA'] }
          ],
          '12': [
            { course: 'B.Com Commerce', careers: ['Accountant', 'Financial Analyst'], higherStudies: ['M.Com', 'MBA', 'CA'] },
            { course: 'BBA Business', careers: ['Business Manager', 'Entrepreneur'], higherStudies: ['MBA'] }
          ]
        },
        'vocational': {
          '10': [
            { course: 'Class 11 Vocational Stream', careers: ['Technical Skills', 'Crafts', 'Industry Work'], higherStudies: ['Diploma', 'ITI'] }
          ],
          '12': [
            { course: 'Diploma Engineering', careers: ['Technician', 'Supervisor'], higherStudies: ['B.Tech'] },
            { course: 'ITI Trade Course', careers: ['Skilled Worker', 'Technical Expert'], higherStudies: ['Advanced Diploma'] }
          ]
        }
      };

      return fallbackCourses[stream]?.[level] || fallbackCourses[stream]?.['12'] || [
        { course: 'General Education', careers: ['Various Opportunities'], higherStudies: ['Higher Education'] }
      ];
    };

    const relevantCourseNames = getCourseRecommendations(recommendedStream, classLevel);
    let recommendedCourses = allCourses.filter(course =>
      relevantCourseNames.some(name =>
        course.course.toLowerCase().includes(name.toLowerCase())
      )
    ).slice(0, 6); // Top 6 courses

    // If no courses found, use fallback recommendations
    if (recommendedCourses.length === 0) {
      recommendedCourses = createFallbackCourses(recommendedStream, classLevel);
    }

    // Get colleges offering recommended courses with class-level filtering
    const collegesSnapshot = await db.collection('colleges').get();
    const allColleges = collegesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Create fallback colleges if none found in database
    const createFallbackColleges = (stream, level) => {
      const fallbackColleges = {
        '10': [
          {
            name: 'Delhi Public School',
            location: 'Delhi, NCR',
            latitude: 28.7041,
            longitude: 77.1025,
            courses: ['Class 11 Science (PCM)', 'Class 11 Commerce', 'Class 11 Arts'],
            facilities: ['Library', 'Labs', 'Playground', 'Hostel'],
            level: 'junior'
          },
          {
            name: 'Ryan International School',
            location: 'Mumbai, Maharashtra',
            latitude: 19.0760,
            longitude: 72.8777,
            courses: ['Class 11 Science (PCB)', 'Class 11 Arts', 'Class 11 Commerce'],
            facilities: ['Library', 'Sports Complex', 'Cafeteria'],
            level: 'junior'
          },
          {
            name: 'Kendriya Vidyalaya',
            location: 'Bangalore, Karnataka',
            latitude: 12.9716,
            longitude: 77.5946,
            courses: ['Class 11 Science', 'Class 11 Commerce', 'Class 11 Arts'],
            facilities: ['Library', 'Computer Lab', 'Science Lab'],
            level: 'junior'
          }
        ],
        '12': [
          {
            name: 'Indian Institute of Technology (IIT)',
            location: 'Delhi, NCR',
            latitude: 28.5458,
            longitude: 77.1918,
            courses: ['B.Tech', 'B.E.', 'B.Sc.'],
            facilities: ['Research Labs', 'Library', 'Hostel', 'Sports Complex'],
            level: 'degree'
          },
          {
            name: 'Delhi University',
            location: 'Delhi, NCR',
            latitude: 28.6939,
            longitude: 77.2090,
            courses: ['B.A.', 'B.Com', 'B.Sc.', 'BBA'],
            facilities: ['Library', 'Hostels', 'Sports', 'Cultural Centers'],
            level: 'degree'
          }
        ]
      };

      return fallbackColleges[level] || fallbackColleges['12'] || [];
    };

    // Filter colleges by academic level and courses offered
    let recommendedColleges = allColleges.filter(college => {
      // Check if college offers courses for the user's academic level
      const collegeLevel = college.level || 'degree'; // Default to degree level

      // Level matching logic
      const levelCompatibility = {
        '10': ['junior', 'senior_secondary', 'higher_secondary', 'all'],
        '12': ['degree', 'undergraduate', 'college', 'all'],
        'UG': ['postgraduate', 'masters', 'university', 'all'],
        'PG': ['research', 'doctorate', 'university', 'all']
      };

      const compatibleLevels = levelCompatibility[classLevel] || ['degree', 'all'];
      const isLevelCompatible = compatibleLevels.includes(collegeLevel) ||
                                collegeLevel === 'all' ||
                                !collegeLevel; // Include colleges without level specified

      // Check if college offers relevant courses
      const hasRelevantCourses = college.courses && college.courses.some(collegeCourse =>
        recommendedCourses.some(recCourse =>
          collegeCourse.toLowerCase().includes(recCourse.course.toLowerCase()) ||
          recCourse.course.toLowerCase().includes(collegeCourse.toLowerCase())
        )
      );

      return isLevelCompatible && hasRelevantCourses;
    });

    // If no colleges found, use fallback recommendations
    if (recommendedColleges.length === 0) {
      recommendedColleges = createFallbackColleges(recommendedStream, classLevel);
    }

    // Apply distance ranking if user has location data
    if (userData.profile && userData.profile.lat && userData.profile.lng) {
      const userLat = parseFloat(userData.profile.lat);
      const userLng = parseFloat(userData.profile.lng);

      recommendedColleges = recommendedColleges.map(college => {
        let collegeLat, collegeLng;

        // Handle different location data structures
        if (college.location && college.location.lat && college.location.lng) {
          // Nested location object
          collegeLat = parseFloat(college.location.lat);
          collegeLng = parseFloat(college.location.lng);
        } else if (college.latitude && college.longitude) {
          // Direct latitude/longitude properties
          collegeLat = parseFloat(college.latitude);
          collegeLng = parseFloat(college.longitude);
        } else if (college.lat && college.lng) {
          // Direct lat/lng properties
          collegeLat = parseFloat(college.lat);
          collegeLng = parseFloat(college.lng);
        } else {
          // No valid location data
          return { ...college, distance: Infinity };
        }

        const distance = calculateDistance(userLat, userLng, collegeLat, collegeLng);
        return { ...college, distance };
      }).sort((a, b) => a.distance - b.distance);
    }

    recommendedColleges = recommendedColleges.slice(0, 5); // Top 5 colleges

    // Get upcoming timeline events with class-level and stream filtering
    const timelineSnapshot = await db.collection('timeline').get();
    const allEvents = timelineSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const upcomingEvents = allEvents
      .filter(event => {
        const eventDate = new Date(event.date);
        const todayDate = new Date(today);

        // Filter by date (future events only)
        if (eventDate < todayDate) return false;

        const eventTitle = event.title.toLowerCase();
        const userStream = recommendedStream.toLowerCase();

        // Class-level specific event filtering
        const classLevelKeywords = {
          '10': ['class 11', '11th', 'senior secondary', 'stream selection', 'plus one'],
          '12': ['admission', 'entrance', 'degree', 'undergraduate', 'college', 'application'],
          'UG': ['masters', 'postgraduate', 'pg', 'entrance', 'higher studies', 'job'],
          'PG': ['phd', 'doctorate', 'research', 'fellowship', 'career', 'employment']
        };

        // Stream-specific keywords
        const streamKeywords = {
          'science': ['b.sc', 'b.tech', 'mbbs', 'engineering', 'medical', 'science', 'm.sc', 'm.tech'],
          'arts': ['b.a', 'arts', 'humanities', 'literature', 'fine arts', 'm.a', 'social'],
          'commerce': ['b.com', 'bba', 'commerce', 'business', 'management', 'm.com', 'mba'],
          'vocational': ['diploma', 'iti', 'polytechnic', 'vocational', 'technical', 'skill']
        };

        const relevantClassKeywords = classLevelKeywords[classLevel] || [];
        const relevantStreamKeywords = streamKeywords[userStream] || [];

        // Check for class-level relevance
        const isClassRelevant = relevantClassKeywords.some(keyword =>
          eventTitle.includes(keyword)
        );

        // Check for stream-specific events
        const isStreamRelevant = relevantStreamKeywords.some(keyword =>
          eventTitle.includes(keyword)
        );

        // Include general events (admission, scholarship) and class/stream-specific events
        const isGeneralEvent = eventTitle.includes('admission') ||
                              eventTitle.includes('scholarship') ||
                              eventTitle.includes('application') ||
                              eventTitle.includes('deadline');

        return isGeneralEvent || isClassRelevant || isStreamRelevant;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 6); // Next 6 relevant events

    res.json({
      recommendedStream,
      classLevel,
      courses: recommendedCourses,
      colleges: recommendedColleges,
      events: upcomingEvents,
      careers
    });

  } catch (error) {
    console.error('Error getting recommendations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;