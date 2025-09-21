# Digital Guidance Platform Frontend

This is a Next.js 14 application for the Digital Guidance Platform frontend.

## Prerequisites

- Backend must be running on port 4000
- Node.js and npm installed

## Setup and Run Instructions

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit `http://localhost:3000`

## Available Pages

### Register Page
- URL: `http://localhost:3000/register`
- Create a new user account
- Requires username and password

### Login Page
- URL: `http://localhost:3000/login`
- Sign in with existing credentials
- On successful login, JWT token is saved to localStorage

### Quiz Page
- URL: `http://localhost:3000/quiz`
- Take the career guidance aptitude quiz
- No login required - open to all users
- Answer 5 multiple choice questions
- Get recommended career stream with scores

### Courses Page
- URL: `http://localhost:3000/courses`
- Browse all available courses and their career mappings
- No login required - open to all users
- View careers and higher studies for each course
- Search for specific courses by name

### Colleges Page
- URL: `http://localhost:3000/colleges`
- Browse all government colleges directory
- No login required - open to all users
- View college name, location, courses, and facilities
- Search for nearby colleges using latitude, longitude, and radius

### Timeline Page
- URL: `http://localhost:3000/timeline`
- View academic timeline with important dates
- No login required - open to all users
- See admission deadlines, scholarship dates, and other events
- Events displayed chronologically with date formatting

### Dashboard Page
- URL: `http://localhost:3000/dashboard`
- Personalized student dashboard
- **Login required** - redirects to `/login` if not authenticated
- Shows welcome message with username
- Displays saved quiz results if taken (recommended stream and scores)
- **Your Recommendations:** Personalized suggestions based on quiz results
  - Suggested courses for your recommended stream
  - Nearby colleges offering those courses
  - Upcoming academic events and deadlines
- **Admin users only:** Admin Panel section for managing timeline events, courses, and colleges
- Quick navigation buttons to all main features
- Logout functionality

## Navigation

The application includes a global navigation bar that appears on all pages except login and register:
- **App name:** "Guidance Platform" (links to home)
- **Navigation links:** Dashboard, Quiz, Courses, Colleges, Timeline
- **Authentication status:**
  - When logged in: Shows "Logout" button
  - When not logged in: Shows "Login" and "Register" links
- **Responsive design:** Stacks vertically on mobile devices

## Testing Authentication Flow

1. **Register a new user:**
   - Visit `http://localhost:3000/register`
   - Enter username and password
   - Click "Create account"
   - Success message should appear

2. **Register an admin user:**
   - Use backend API to create admin: `curl -X POST http://localhost:4000/api/auth/register -H "Content-Type: application/json" -d '{"username":"admin","password":"admin123","role":"admin"}'`

3. **Login with the user:**
   - Visit `http://localhost:3000/login`
   - Enter the same username and password
   - Click "Sign in"
   - Success message should appear

4. **Check localStorage:**
   - Open browser developer tools (F12)
   - Go to Application/Storage tab
   - Check localStorage for key "token"
   - JWT token should be stored there

5. **Access dashboard:**
   - Visit `http://localhost:3000/dashboard`
   - Should see personalized welcome message
   - If quiz not taken, shows "No quiz results yet. Take the quiz now!"
   - **Admin users only:** See Admin Panel section with tabs for Timeline, Courses, and Colleges management
   - Use navigation buttons to explore features
   - Click "Logout" to sign out

6. **Take quiz while logged in:**
   - Take the quiz from `/quiz` while logged in
   - Quiz results will be automatically saved to your profile
   - Return to dashboard to see saved results displayed

7. **View personalized recommendations:**
   - After taking the quiz, visit dashboard to see "Your Recommendations" section
   - View suggested courses based on your recommended stream
   - See colleges offering those courses
   - Check upcoming academic events and deadlines

## Testing Quiz Flow

1. **Take the quiz:**
   - Visit `http://localhost:3000/quiz`
   - Answer all 5 questions by selecting radio button options
   - Click "Submit Quiz"
   - View your recommended career stream and scores

## Testing Courses Flow

1. **Browse all courses:**
   - Visit `http://localhost:3000/courses`
   - View list of all available courses with careers and higher studies

2. **Search for specific course:**
   - Enter course name in search bar (e.g., "bsc", "bcom", "btech")
   - Click "Search" to find specific course
   - Click "Clear" to return to all courses view

## Testing Colleges Flow

1. **Browse all colleges:**
   - Visit `http://localhost:3000/colleges`
   - View list of all government colleges with details

2. **Search for nearby colleges:**
   - Enter latitude, longitude, and radius in km
   - Example: lat=20.2961, lng=85.8245, radius=50
   - Click "Find Nearby" to see colleges within that area
   - Click "Clear Search" to return to all colleges view

## Testing Timeline Flow

1. **View academic timeline:**
   - Visit `http://localhost:3000/timeline`
   - See chronological list of academic events
   - Each event shows formatted date, title, and type badge
   - Events are sorted by date (earliest first)

## Backend Integration

The frontend communicates with the backend API running on `http://localhost:4000`:
- Registration: `POST /api/auth/register`
- Login: `POST /api/auth/login`
- User profile: `GET /api/auth/profile` (requires Authorization header)
- Quiz questions: `GET /api/quiz/questions`
- Quiz submission: `POST /api/quiz/submit`
- All courses: `GET /api/courses`
- Specific course: `GET /api/courses/:courseName`
- All colleges: `GET /api/colleges`
- Nearby colleges: `GET /api/colleges/nearby?lat=<lat>&lng=<lng>&radius=<km>`
- Timeline events: `GET /api/timeline`
- Upcoming events: `GET /api/timeline/upcoming?from=<YYYY-MM-DD>`
- Personalized recommendations: `GET /api/recommendations` (requires Authorization header)

Make sure the backend server is running before using the frontend.

## Admin Features

Only users with `role: "admin"` can access admin features:

### Admin Panel (Dashboard)
The Admin Panel features a tabbed interface with three sections:

#### Timeline Tab
- **Add Timeline Events:** Form to create new timeline events with title, date, and type
- **Manage Events:** View all timeline events with edit and delete options
- **Inline Editing:** Click edit to modify event details directly
- **Real-time Updates:** Changes immediately reflect in the timeline page

#### Courses Tab
- **Add Courses:** Form to create new courses with name, careers list, and higher studies list
- **Manage Courses:** View all courses with edit and delete options
- **Inline Editing:** Click edit to modify course details directly
- **Real-time Updates:** Changes immediately reflect in the courses page

#### Colleges Tab
- **Add Colleges:** Form to create new colleges with name, location, coordinates, courses, and facilities
- **Manage Colleges:** View all colleges with edit and delete options
- **Inline Editing:** Click edit to modify college details directly
- **Real-time Updates:** Changes immediately reflect in the colleges page

### Testing Admin Features
1. Create admin user via backend API
2. Login as admin user
3. Visit dashboard to see Admin Panel with three tabs
4. **Timeline Management:**
   - Add new timeline event → verify it appears in `/timeline`
   - Edit existing event → verify changes are saved
   - Delete event → verify it's removed from timeline
5. **Courses Management:**
   - Add new course → verify it appears in `/courses`
   - Edit existing course → verify changes are saved
   - Delete course → verify it's removed from courses
6. **Colleges Management:**
   - Add new college → verify it appears in `/colleges`
   - Edit existing college → verify changes are saved
   - Delete college → verify it's removed from colleges
