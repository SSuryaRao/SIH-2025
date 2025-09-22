#!/usr/bin/env node

/**
 * Deployment Testing Script
 * Tests the complete deployment integration between frontend and backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

async function testEndpoint(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const data = await response.json();

    console.log(`✅ ${endpoint}: ${response.status} ${response.statusText}`);
    return { success: true, data, status: response.status };
  } catch (error) {
    console.log(`❌ ${endpoint}: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log('🧪 Testing Deployment Integration\n');
  console.log(`Testing API at: ${API_BASE_URL}\n`);

  // 1. Health Check
  console.log('1. Testing Health Check...');
  await testEndpoint('/api/health');
  console.log('');

  // 2. Basic API Routes
  console.log('2. Testing Basic API Routes...');
  await testEndpoint('/api/quiz/questions');
  await testEndpoint('/api/courses');
  await testEndpoint('/api/colleges');
  await testEndpoint('/api/timeline');
  console.log('');

  // 3. Authentication Flow
  console.log('3. Testing Authentication...');
  const testUser = { username: 'testuser123', password: 'testpass123' };

  // Register
  const registerResult = await testEndpoint('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testUser)
  });

  if (registerResult.success || registerResult.status === 400) {
    console.log('   Registration: ✅ (user may already exist)');
  }

  // Login
  const loginResult = await testEndpoint('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testUser)
  });

  let token = null;
  if (loginResult.success && loginResult.data.token) {
    token = loginResult.data.token;
    console.log('   Login: ✅ Token received');
  }

  // 4. Protected Routes
  if (token) {
    console.log('\n4. Testing Protected Routes...');
    await testEndpoint('/api/auth/profile', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    await testEndpoint('/api/recommendations', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  }

  // 5. Quiz Submission
  console.log('\n5. Testing Quiz Submission...');
  const quizAnswers = ['science', 'science', 'arts', 'commerce', 'science'];
  await testEndpoint('/api/quiz/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    body: JSON.stringify({ answers: quizAnswers })
  });

  console.log('\n🎉 Deployment Testing Complete!');
  console.log('\n📋 Next Steps:');
  console.log('1. Deploy backend to Render');
  console.log('2. Deploy frontend to Vercel');
  console.log('3. Update environment variables');
  console.log('4. Test production URLs');
}

// Run tests if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests().catch(console.error);
}

export { testEndpoint, runTests };