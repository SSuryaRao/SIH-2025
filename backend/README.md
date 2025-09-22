# 🎯 SIH 2025 Backend - Digital Career Guidance Platform

Node.js + Express + Firebase backend API for the Digital Guidance Platform.

## 🚀 Quick Start

### Development
```bash
npm install
npm run dev
```

### Environment Variables
For development, use firebase-service-account.json file.
For production (Render), set these environment variables:
```env
NODE_ENV=production
PORT=10000
JWT_SECRET=your-super-secret-jwt-key-here
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=your-firebase-client-email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY_HERE\n-----END PRIVATE KEY-----\n"
FRONTEND_URL=https://your-app.vercel.app
```

## Setup and Run Instructions

### Prerequisites
- Node.js (v18+)
- Firebase project with Firestore enabled

### Firebase Setup
1. Create a Firebase project at https://console.firebase.google.com/
2. Enable Firestore Database in your Firebase project
3. Go to Project Settings > Service Accounts
4. Generate a new private key and download the JSON file
5. Rename the downloaded file to `firebase-service-account.json`
6. Place this file in the `backend/` directory (it's already in .gitignore)

### Firestore Collections Setup
After setting up Firebase, you need to create and seed the required Firestore collections. Create the following collections in your Firestore console:

#### 1. Create `courses` collection
Add documents with the following structure:
```json
{
  "course": "B.A.",
  "careers": ["Civil Services", "Journalism", "Teaching", "NGO Sector"],
  "higherStudies": ["M.A.", "B.Ed.", "PhD"]
}
```

#### 2. Create `colleges` collection
Add documents with the following structure:
```json
{
  "name": "Government Science College",
  "location": "Bhubaneswar, Odisha",
  "latitude": 20.2961,
  "longitude": 85.8245,
  "courses": ["B.Sc.", "M.Sc."],
  "facilities": ["Hostel", "Library", "Internet"]
}
```

#### 3. Create `timeline` collection
Add documents with the following structure:
```json
{
  "title": "B.Sc. Admission 2025",
  "date": "2025-06-15",
  "type": "admission"
}
```

### Installation
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Ensure `firebase-service-account.json` is in the backend directory

4. Set up Firestore collections by running the seed script:
   ```bash
   node seedFirestore.js
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## Testing the Health Endpoint

Test the health endpoint with curl:
```bash
curl -s http://localhost:4000/api/health
```

Expected response format:
```json
{
  "status": "ok",
  "uptime": 123.45,
  "time": "2025-09-20T12:34:56.789Z"
}
```

## Authentication Endpoints

### Register a new user
```bash
curl -X POST http://localhost:4000/api/auth/register -H "Content-Type: application/json" -d '{"username":"alice","password":"secret"}'
```

Expected response:
```json
{
  "message": "Registered successfully"
}
```

### Login with credentials
```bash
curl -X POST http://localhost:4000/api/auth/login -H "Content-Type: application/json" -d '{"username":"alice","password":"secret"}'
```

Expected response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhbGljZSIsImlhdCI6MTY5NTIwMDAwMCwiZXhwIjoxNjk1MjAzNjAwfQ.example_jwt_token_here"
}
```

## Quiz Endpoints

### Get quiz questions
```bash
curl http://localhost:4000/api/quiz/questions
```

Expected response:
```json
[
  {
    "id": 1,
    "text": "Which activity do you enjoy most?",
    "options": [
      { "value": "science", "label": "Solving math/science problems" },
      { "value": "arts", "label": "Reading literature / creative writing" },
      { "value": "commerce", "label": "Managing money or business ideas" },
      { "value": "vocational", "label": "Working with hands / practical skills" }
    ]
  }
]
```

### Submit quiz answers
```bash
curl -X POST http://localhost:4000/api/quiz/submit -H "Content-Type: application/json" -d '{"answers":["science","science","arts"]}'
```

Expected response:
```json
{
  "recommendedStream": "science",
  "scores": {
    "science": 2,
    "arts": 1,
    "commerce": 0,
    "vocational": 0
  }
}
```

**Note:** Quiz results are persisted to Firestore when submitted with Authorization header:
```bash
curl -X POST http://localhost:4000/api/quiz/submit -H "Content-Type: application/json" -H "Authorization: Bearer <jwt_token>" -d '{"answers":["science","science","arts"]}'
```
When a valid JWT token is provided, the quiz result is saved to the user's Firestore document under the `quizResult` field and can be retrieved via the profile endpoint. Results persist across server restarts and user sessions.

## Courses Endpoints
*These endpoints now read from Firestore `courses` collection*

### Get all courses
```bash
curl http://localhost:4000/api/courses
```

Expected response:
```json
[
  {
    "course": "B.A.",
    "careers": [
      "Civil Services",
      "Journalism",
      "Teaching",
      "NGO Sector"
    ],
    "higherStudies": ["M.A.", "B.Ed.", "PhD"]
  },
  {
    "course": "B.Sc.",
    "careers": [
      "Research Assistant",
      "IT Jobs",
      "Lab Technician"
    ],
    "higherStudies": ["M.Sc.", "MCA", "PhD"]
  }
]
```

### Get specific course details
```bash
curl http://localhost:4000/api/courses/bsc
```

Expected response:
```json
{
  "course": "B.Sc.",
  "careers": [
    "Research Assistant",
    "IT Jobs",
    "Lab Technician"
  ],
  "higherStudies": ["M.Sc.", "MCA", "PhD"]
}
```

## Colleges Endpoints
*These endpoints now read from Firestore `colleges` collection*

### Get all colleges
```bash
curl http://localhost:4000/api/colleges
```

Expected response:
```json
[
  {
    "id": 1,
    "name": "Government Science College",
    "location": "Bhubaneswar, Odisha",
    "latitude": 20.2961,
    "longitude": 85.8245,
    "courses": ["B.Sc.", "M.Sc."],
    "facilities": ["Hostel", "Library", "Internet"]
  },
  {
    "id": 2,
    "name": "Delhi University Arts College",
    "location": "New Delhi, Delhi",
    "latitude": 28.6139,
    "longitude": 77.2090,
    "courses": ["B.A.", "M.A.", "B.Ed."],
    "facilities": ["Hostel", "Library", "Internet", "Sports Complex"]
  }
]
```

### Get nearby colleges
```bash
curl "http://localhost:4000/api/colleges/nearby?lat=20.2961&lng=85.8245&radius=50"
```

Expected response:
```json
[
  {
    "id": 1,
    "name": "Government Science College",
    "location": "Bhubaneswar, Odisha",
    "latitude": 20.2961,
    "longitude": 85.8245,
    "courses": ["B.Sc.", "M.Sc."],
    "facilities": ["Hostel", "Library", "Internet"]
  }
]
```

## Timeline Endpoints
*These endpoints now read from Firestore `timeline` collection*

### Get all timeline events
```bash
curl http://localhost:4000/api/timeline
```

Expected response:
```json
[
  {
    "id": 3,
    "title": "JEE Main 2025 Registration",
    "date": "2025-03-15",
    "type": "admission"
  },
  {
    "id": 5,
    "title": "State Scholarship Application",
    "date": "2025-05-20",
    "type": "scholarship"
  },
  {
    "id": 1,
    "title": "B.Sc. Admission 2025",
    "date": "2025-06-15",
    "type": "admission"
  }
]
```

### Get upcoming timeline events
```bash
curl "http://localhost:4000/api/timeline/upcoming?from=2025-07-01"
```

Expected response:
```json
[
  {
    "id": 2,
    "title": "National Scholarship Portal Deadline",
    "date": "2025-07-30",
    "type": "scholarship"
  },
  {
    "id": 4,
    "title": "Merit List Publication",
    "date": "2025-08-15",
    "type": "admission"
  }
]
```

## Admin Endpoints
*These endpoints require admin role authentication*

### Create timeline event
```bash
curl -X POST http://localhost:4000/api/admin/timeline -H "Content-Type: application/json" -H "Authorization: Bearer <admin_jwt_token>" -d '{"title":"New Event","date":"2025-10-01","type":"admission"}'
```

### Update timeline event
```bash
curl -X PUT http://localhost:4000/api/admin/timeline/<event_id> -H "Content-Type: application/json" -H "Authorization: Bearer <admin_jwt_token>" -d '{"title":"Updated Event","date":"2025-10-02","type":"scholarship"}'
```

### Delete timeline event
```bash
curl -X DELETE http://localhost:4000/api/admin/timeline/<event_id> -H "Authorization: Bearer <admin_jwt_token>"
```

### Create course
```bash
curl -X POST http://localhost:4000/api/admin/courses -H "Content-Type: application/json" -H "Authorization: Bearer <admin_jwt_token>" -d '{"course":"B.Tech","careers":["Software Developer","Data Scientist"],"higherStudies":["M.Tech","MS"]}'
```

### Update course
```bash
curl -X PUT http://localhost:4000/api/admin/courses/<course_id> -H "Content-Type: application/json" -H "Authorization: Bearer <admin_jwt_token>" -d '{"course":"B.Tech","careers":["Software Engineer","AI Researcher"],"higherStudies":["M.Tech","MS","PhD"]}'
```

### Delete course
```bash
curl -X DELETE http://localhost:4000/api/admin/courses/<course_id> -H "Authorization: Bearer <admin_jwt_token>"
```

### Create college
```bash
curl -X POST http://localhost:4000/api/admin/colleges -H "Content-Type: application/json" -H "Authorization: Bearer <admin_jwt_token>" -d '{"name":"IIT Delhi","location":"New Delhi","latitude":28.6139,"longitude":77.2090,"courses":["B.Tech","M.Tech"],"facilities":["Hostel","Library","Labs"]}'
```

### Update college
```bash
curl -X PUT http://localhost:4000/api/admin/colleges/<college_id> -H "Content-Type: application/json" -H "Authorization: Bearer <admin_jwt_token>" -d '{"name":"IIT Delhi","location":"New Delhi","latitude":28.6139,"longitude":77.2090,"courses":["B.Tech","M.Tech","PhD"],"facilities":["Hostel","Library","Labs","Sports"]}'
```

### Delete college
```bash
curl -X DELETE http://localhost:4000/api/admin/colleges/<college_id> -H "Authorization: Bearer <admin_jwt_token>"
```

### Register admin user
```bash
curl -X POST http://localhost:4000/api/auth/register -H "Content-Type: application/json" -d '{"username":"admin","password":"admin123","role":"admin"}'
```

## Recommendations Endpoint
*This endpoint provides personalized recommendations based on user quiz results*

### Get personalized recommendations
```bash
curl -H "Authorization: Bearer <jwt_token>" http://localhost:4000/api/recommendations
```

Expected response (user with quiz results):
```json
{
  "recommendedStream": "science",
  "courses": [
    {
      "id": "course_id",
      "course": "B.Sc.",
      "careers": ["Research Assistant", "IT Jobs", "Lab Technician"],
      "higherStudies": ["M.Sc.", "MCA", "PhD"]
    }
  ],
  "colleges": [
    {
      "id": "college_id",
      "name": "Government Science College",
      "location": "Bhubaneswar, Odisha",
      "latitude": 20.2961,
      "longitude": 85.8245,
      "courses": ["B.Sc.", "M.Sc."],
      "facilities": ["Hostel", "Library", "Internet"]
    }
  ],
  "upcomingEvents": [
    {
      "id": "event_id",
      "title": "B.Sc. Admission 2025",
      "date": "2025-06-15",
      "type": "admission"
    }
  ]
}
```

Expected response (user without quiz results):
```json
{
  "message": "Take the quiz to get recommendations"
}
```

**Requirements:**
- Must be authenticated (JWT token required)
- Returns recommendations based on user's quiz result
- Courses filtered by recommended stream (science/arts/commerce/vocational)
- Colleges filtered to those offering recommended courses
- Events filtered to upcoming dates only