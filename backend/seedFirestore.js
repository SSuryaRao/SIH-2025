import db from './firebase.js';

const courses = [
  // New Class 11/12 Stream Courses
  {
    course: "Class 11 Science (with Computer Science)",
    careers: ["Software Engineering", "AI/ML Specialist", "Cybersecurity Analyst", "Robotics"],
    higherStudies: ["B.Tech in Computer Science", "BCA", "B.Sc. in IT", "Integrated M.Tech"]
  },
  {
    course: "Class 11 Commerce (with Applied Maths)",
    careers: ["Data Analyst (Finance)", "Economist", "Investment Banker", "Actuarial Scientist"],
    higherStudies: ["B.A. (Hons) Economics", "B.Com (Hons)", "BBE (Bachelor of Business Economics)"]
  },
  {
    course: "Class 11 Humanities (with Legal Studies)",
    careers: ["Corporate Lawyer", "Judge", "Policy Analyst", "Legal Advisor"],
    higherStudies: ["Integrated B.A. LL.B.", "BBA LL.B."]
  },
  // New Degree & PG Level Courses
  {
    course: "B.Des (Bachelor of Design)",
    careers: ["UI/UX Designer", "Product Designer", "Graphic Designer", "Fashion Designer"],
    higherStudies: ["M.Des (Master of Design)", "PhD in Design Studies"]
  },
  {
    course: "BHM (Bachelor of Hotel Management)",
    careers: ["Hotel General Manager", "Event Manager", "Cruise Ship Director", "Airline Cabin Crew"],
    higherStudies: ["MHM (Master of Hotel Management)", "MBA in Hospitality"]
  },
  {
    course: "BPT (Bachelor of Physiotherapy)",
    careers: ["Sports Physiotherapist", "Clinical Physiotherapist", "Rehabilitation Specialist"],
    higherStudies: ["MPT (Master of Physiotherapy)"]
  },
  {
    course: "B.Sc. Agriculture",
    careers: ["Agricultural Scientist", "Agribusiness Manager", "Food Technologist", "Farm Manager"],
    higherStudies: ["M.Sc. in Agriculture", "MBA in Agribusiness"]
  },
  {
    course: "B.Sc. Nursing",
    careers: ["Registered Nurse", "Nurse Educator", "Clinical Nurse Specialist", "Hospital Administrator"],
    higherStudies: ["M.Sc. in Nursing", "PhD"]
  },
  {
    course: "B.A. in Psychology",
    careers: ["Clinical Psychologist", "Counselor", "HR Specialist", "Market Researcher"],
    higherStudies: ["M.A./M.Sc. in Psychology", "PhD"]
  },
  {
    course: "MCA (Master of Computer Applications)",
    careers: ["Senior Software Developer", "IT Consultant", "Cloud Architect", "Project Lead"],
    higherStudies: ["PhD in Computer Science"]
  }
];

const colleges = [
  // New Junior Colleges
  {
    name: "The Doon School",
    location: "Dehradun, Uttarakhand",
    latitude: 30.3254,
    longitude: 78.0533,
    courses: ["Class 11 Science", "Class 11 Commerce", "Class 11 Humanities/Arts"],
    facilities: ["Boarding", "Library", "Sports Fields", "Auditorium"],
    level: "junior"
  },
  {
    name: "Sri Chaitanya Junior College",
    location: "Vijayawada, Andhra Pradesh",
    latitude: 16.5062,
    longitude: 80.6480,
    courses: ["Class 11 Science (PCM)", "Class 11 Science (PCB)"],
    facilities: ["Integrated Coaching", "Hostel", "Labs", "Doubt-clearing Sessions"],
    level: "junior"
  },
  {
    name: "The Mother's International School",
    location: "New Delhi, Delhi",
    latitude: 28.5543,
    longitude: 77.2039,
    courses: ["Class 11 Science", "Class 11 Commerce", "Class 11 Humanities/Arts"],
    facilities: ["Library", "Science Park", "Meditation Hall", "Sports"],
    level: "junior"
  },
  // New Degree Colleges
  {
    name: "Indian Institute of Science (IISc)",
    location: "Bengaluru, Karnataka",
    latitude: 13.0221,
    longitude: 77.5659,
    courses: ["B.Sc. (Research)", "M.Tech", "PhD"],
    facilities: ["Advanced Research Labs", "Supercomputer", "Library", "Hostels"],
    level: "degree"
  },
  {
    name: "BITS Pilani, Pilani Campus",
    location: "Pilani, Rajasthan",
    latitude: 28.3619,
    longitude: 75.5868,
    courses: ["B.E.", "M.E.", "B.Pharm", "M.Sc."],
    facilities: ["Innovation Center", "Flexible Curriculum", "Library", "Student Hostels"],
    level: "degree"
  },
  {
    name: "Christian Medical College (CMC)",
    location: "Vellore, Tamil Nadu",
    latitude: 12.9248,
    longitude: 79.1383,
    courses: ["MBBS", "B.Sc. Nursing", "BPT", "MD", "MS"],
    facilities: ["Teaching Hospital", "Medical Labs", "Library", "Student Hostels"],
    level: "degree"
  },
  {
    name: "St. Stephen's College",
    location: "New Delhi, Delhi",
    latitude: 28.6816,
    longitude: 77.2132,
    courses: ["B.A.", "B.Sc."],
    facilities: ["Residence Halls", "Chapel", "Library", "Sports Ground"],
    level: "degree"
  },
  {
    name: "Lady Shri Ram College for Women (LSR)",
    location: "New Delhi, Delhi",
    latitude: 28.5558,
    longitude: 77.2435,
    courses: ["B.A.", "B.Com", "B.Sc.", "Journalism"],
    facilities: ["Library", "Auditorium", "Hostel", "Psychology Labs"],
    level: "degree"
  },
  {
    name: "Indian Institute of Management Bangalore (IIMB)",
    location: "Bengaluru, Karnataka",
    latitude: 12.8982,
    longitude: 77.5925,
    courses: ["MBA", "PGP", "PhD"],
    facilities: ["Finance Lab", "Behavioral Lab", "Hostels", "Library"],
    level: "degree"
  },
  {
    name: "National Institute of Fashion Technology (NIFT)",
    location: "New Delhi, Delhi",
    latitude: 28.5901,
    longitude: 77.1895,
    courses: ["B.Des", "B.F.Tech", "M.Des", "M.F.M"],
    facilities: ["Design Studios", "Textile Labs", "Garment Construction Labs", "Library"],
    level: "degree"
  }
];

const timeline = [
  // New Events for late 2025 and 2026
  {
    title: "UPSC Civil Services (Mains) Exam",
    date: "2025-09-22",
    type: "exam"
  },
  {
    title: "XAT 2026 Registration Ends",
    date: "2025-11-30",
    type: "admission"
  },
  {
    title: "UCEED 2026 Application Deadline",
    date: "2025-12-10",
    type: "admission"
  },
  {
    title: "XAT 2026 Exam (for MBA)",
    date: "2026-01-05",
    type: "exam"
  },
  {
    title: "JEE Main 2026 Session 1 Result",
    date: "2026-02-12",
    type: "result"
  },
  {
    title: "BITSAT 2026 Application Opens",
    date: "2026-02-15",
    type: "admission"
  },
  {
    title: "IIM IPMAT 2026 Registration Starts",
    date: "2026-03-01",
    type: "admission"
  },
  {
    title: "NDA & NA (I) 2026 Exam",
    date: "2026-04-19",
    type: "exam"
  },
  {
    title: "NEET UG 2026 Result Declaration",
    date: "2026-06-14",
    type: "result"
  },
  {
    title: "ICAR AIEEA 2026 Exam (for Agriculture)",
    date: "2026-06-25",
    type: "exam"
  },
  {
    title: "Reliance Foundation Scholarship Application Starts",
    date: "2026-07-15",
    type: "scholarship"
  },
  {
    title: "JoSAA 2026 Counselling Round 1",
    date: "2026-07-20",
    type: "admission"
  }
];

async function seedFirestore() {
  try {
    console.log('Starting Firestore seeding with new data...');

    // Seed courses
    const coursePromises = courses.map(course =>
      db.collection('courses').doc(course.course.toLowerCase().replace(/[.\/()]/g, '').replace(/\s+/g, '-')).set(course)
    );
    await Promise.all(coursePromises);
    console.log('New courses collection seeded');

    // Seed colleges
    const collegePromises = colleges.map(college =>
      db.collection('colleges').doc(college.name.toLowerCase().replace(/[.,]/g, '').replace(/\s+/g, '-')).set(college)
    );
    await Promise.all(collegePromises);
    console.log('New colleges collection seeded');

    // Seed timeline
    // Generating a unique ID for each timeline event to ensure no overwrites
    const timelinePromises = timeline.map(event =>
      db.collection('timeline').add(event)
    );
    await Promise.all(timelinePromises);
    console.log('New timeline collection seeded');

    console.log('Firestore seeding completed successfully with all new data! ✅');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding Firestore:', error);
    process.exit(1);
  }
}

seedFirestore();