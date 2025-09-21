import db from './firebase.js';

const courses = [
  {
    course: "B.A.",
    careers: ["Civil Services", "Journalism", "Teaching", "NGO Sector"],
    higherStudies: ["M.A.", "B.Ed.", "PhD"]
  },
  {
    course: "B.Sc.",
    careers: ["Research Assistant", "IT Jobs", "Lab Technician"],
    higherStudies: ["M.Sc.", "MCA", "PhD"]
  },
  {
    course: "B.Com",
    careers: ["Accountant", "Banking", "Financial Analyst", "Tax Consultant"],
    higherStudies: ["M.Com", "MBA", "CA", "CS"]
  },
  {
    course: "B.Tech",
    careers: ["Software Engineer", "Data Scientist", "Project Manager", "Consultant"],
    higherStudies: ["M.Tech", "MBA", "MS", "PhD"]
  }
];

const colleges = [
  {
    name: "Government Science College",
    location: "Bhubaneswar, Odisha",
    latitude: 20.2961,
    longitude: 85.8245,
    courses: ["B.Sc.", "M.Sc."],
    facilities: ["Hostel", "Library", "Internet"]
  },
  {
    name: "Delhi University Arts College",
    location: "New Delhi, Delhi",
    latitude: 28.6139,
    longitude: 77.2090,
    courses: ["B.A.", "M.A.", "B.Ed."],
    facilities: ["Hostel", "Library", "Internet", "Sports Complex"]
  },
  {
    name: "Mumbai Commerce Institute",
    location: "Mumbai, Maharashtra",
    latitude: 19.0760,
    longitude: 72.8777,
    courses: ["B.Com", "M.Com", "MBA"],
    facilities: ["Library", "Internet", "Cafeteria", "Placement Cell"]
  },
  {
    name: "IIT Bangalore",
    location: "Bangalore, Karnataka",
    latitude: 12.9716,
    longitude: 77.5946,
    courses: ["B.Tech", "M.Tech", "PhD"],
    facilities: ["Hostel", "Library", "Internet", "Research Labs", "Sports Complex"]
  }
];

const timeline = [
  {
    title: "B.Sc. Admission 2025",
    date: "2025-06-15",
    type: "admission"
  },
  {
    title: "National Scholarship Portal Deadline",
    date: "2025-07-30",
    type: "scholarship"
  },
  {
    title: "JEE Main 2025 Registration",
    date: "2025-03-15",
    type: "admission"
  },
  {
    title: "Merit List Publication",
    date: "2025-08-15",
    type: "admission"
  },
  {
    title: "State Scholarship Application",
    date: "2025-05-20",
    type: "scholarship"
  },
  {
    title: "B.Tech Counselling Start",
    date: "2025-09-01",
    type: "admission"
  }
];

async function seedFirestore() {
  try {
    console.log('Starting Firestore seeding...');

    // Seed courses
    for (const course of courses) {
      await db.collection('courses').doc(course.course.toLowerCase().replace(/\./g, '')).set(course);
    }
    console.log('Courses collection seeded');

    // Seed colleges
    for (const college of colleges) {
      await db.collection('colleges').doc(college.name.toLowerCase().replace(/\s+/g, '-')).set(college);
    }
    console.log('Colleges collection seeded');

    // Seed timeline
    for (let i = 0; i < timeline.length; i++) {
      await db.collection('timeline').doc(`event-${i + 1}`).set(timeline[i]);
    }
    console.log('Timeline collection seeded');

    console.log('Firestore seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding Firestore:', error);
    process.exit(1);
  }
}

seedFirestore();