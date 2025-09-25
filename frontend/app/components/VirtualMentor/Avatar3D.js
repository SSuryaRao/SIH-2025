'use client';

import { useRef, useEffect, useState, Suspense } from 'react';
import Avatar2D from './Avatar2D';

// Fallback to 2D Avatar due to WebGL issues

// Animated 3D Avatar Component
function AnimatedAvatar({ mentorType, isListening, isSpeaking, emotion = 'neutral' }) {
  const avatarRef = useRef();
  const headRef = useRef();
  const eyeRef = useRef();
  const mouthRef = useRef();

  // Animation states
  const [time, setTime] = useState(0);

  // Define mentor appearances based on career
  const mentorStyles = {
    engineer: {
      bodyColor: '#4F46E5', // Indigo suit
      hatColor: '#1F2937',   // Dark grey hard hat
      accessories: 'hardhat',
      name: 'Alex Chen'
    },
    doctor: {
      bodyColor: '#FFFFFF',  // White coat
      hatColor: '#DC2626',   // Red cross
      accessories: 'stethoscope',
      name: 'Dr. Sarah Patel'
    },
    teacher: {
      bodyColor: '#059669',  // Green cardigan
      hatColor: '#92400E',   // Brown hair
      accessories: 'glasses',
      name: 'Prof. Michael Kumar'
    },
    artist: {
      bodyColor: '#7C3AED',  // Purple artistic outfit
      hatColor: '#F59E0B',   // Golden beret
      accessories: 'palette',
      name: 'Maya Sharma'
    },
    business: {
      bodyColor: '#1F2937',  // Dark business suit
      hatColor: '#111827',   // Black hair
      accessories: 'briefcase',
      name: 'Raj Patel'
    }
  };

  const currentStyle = mentorStyles[mentorType] || mentorStyles.engineer;

  // Animation loop
  useFrame((state) => {
    setTime(state.clock.getElapsedTime());

    if (avatarRef.current) {
      // Breathing animation
      const breathe = Math.sin(time * 2) * 0.02;
      avatarRef.current.scale.y = 1 + breathe;

      // Head movements based on state
      if (headRef.current) {
        if (isListening) {
          // Attentive head tilt
          headRef.current.rotation.x = Math.sin(time * 3) * 0.1;
          headRef.current.rotation.y = Math.sin(time * 2) * 0.05;
        } else if (isSpeaking) {
          // Animated speaking gestures
          headRef.current.rotation.x = Math.sin(time * 4) * 0.15;
          headRef.current.rotation.z = Math.sin(time * 3) * 0.08;
        } else {
          // Gentle idle movement
          headRef.current.rotation.y = Math.sin(time * 0.5) * 0.1;
          headRef.current.rotation.x = Math.cos(time * 0.7) * 0.05;
        }
      }

      // Eye animation
      if (eyeRef.current) {
        // Blinking
        const blinkTime = time * 3;
        const blink = Math.sin(blinkTime) < -0.9 ? 0.1 : 1;
        eyeRef.current.scale.y = blink;

        // Emotion-based eye changes
        switch(emotion) {
          case 'happy':
            eyeRef.current.scale.x = 1.2;
            break;
          case 'concerned':
            eyeRef.current.rotation.z = 0.1;
            break;
          case 'excited':
            eyeRef.current.scale.setScalar(1.3);
            break;
          default:
            eyeRef.current.scale.x = 1;
            eyeRef.current.rotation.z = 0;
        }
      }

      // Mouth animation for speaking
      if (mouthRef.current) {
        if (isSpeaking) {
          const mouthMovement = Math.sin(time * 8) * 0.3 + 0.7;
          mouthRef.current.scale.y = mouthMovement;
        } else {
          // Emotion-based mouth
          switch(emotion) {
            case 'happy':
              mouthRef.current.rotation.z = 0.3; // Smile
              break;
            case 'concerned':
              mouthRef.current.rotation.z = -0.2; // Frown
              break;
            default:
              mouthRef.current.rotation.z = 0;
          }
        }
      }
    }
  });

  return (
    <group ref={avatarRef} position={[0, -1, 0]}>
      {/* Body */}
      <Box ref={avatarRef} args={[1.2, 2, 0.8]} position={[0, 0, 0]}>
        <meshStandardMaterial color={currentStyle.bodyColor} />
      </Box>

      {/* Head */}
      <group ref={headRef} position={[0, 1.5, 0]}>
        <Sphere args={[0.6]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#FFDBAC" />
        </Sphere>

        {/* Eyes */}
        <group ref={eyeRef}>
          <Sphere args={[0.1]} position={[-0.15, 0.1, 0.5]}>
            <meshStandardMaterial color="#000000" />
          </Sphere>
          <Sphere args={[0.1]} position={[0.15, 0.1, 0.5]}>
            <meshStandardMaterial color="#000000" />
          </Sphere>

          {/* Pupils */}
          <Sphere args={[0.05]} position={[-0.15, 0.1, 0.52]}>
            <meshStandardMaterial color="#FFFFFF" />
          </Sphere>
          <Sphere args={[0.05]} position={[0.15, 0.1, 0.52]}>
            <meshStandardMaterial color="#FFFFFF" />
          </Sphere>
        </group>

        {/* Mouth */}
        <Box ref={mouthRef} args={[0.25, 0.08, 0.05]} position={[0, -0.2, 0.5]}>
          <meshStandardMaterial color="#FF69B4" />
        </Box>

        {/* Hair/Hat based on mentor type */}
        <Box args={[0.7, 0.3, 0.7]} position={[0, 0.4, 0]}>
          <meshStandardMaterial color={currentStyle.hatColor} />
        </Box>
      </group>

      {/* Career-specific accessories */}
      {currentStyle.accessories === 'hardhat' && (
        <Box args={[0.8, 0.2, 0.8]} position={[0, 2.1, 0]}>
          <meshStandardMaterial color="#FFD700" />
        </Box>
      )}

      {currentStyle.accessories === 'stethoscope' && (
        <group position={[0, 0.5, 0.4]}>
          <Box args={[0.1, 1, 0.1]} position={[0, 0, 0]}>
            <meshStandardMaterial color="#C0C0C0" />
          </Box>
          <Sphere args={[0.15]} position={[0, -0.5, 0]}>
            <meshStandardMaterial color="#C0C0C0" />
          </Sphere>
        </group>
      )}

      {currentStyle.accessories === 'glasses' && (
        <group position={[0, 1.6, 0.4]}>
          <Box args={[0.6, 0.3, 0.05]} position={[0, 0, 0]}>
            <meshStandardMaterial color="#000000" transparent opacity={0.7} />
          </Box>
        </group>
      )}

      {currentStyle.accessories === 'palette' && (
        <group position={[0.7, 0.5, 0.3]} rotation={[0, 0, 0.3]}>
          <Box args={[0.3, 0.02, 0.4]} position={[0, 0, 0]}>
            <meshStandardMaterial color="#8B4513" />
          </Box>
          {/* Paint spots */}
          <Sphere args={[0.05]} position={[-0.1, 0.02, 0.1]}>
            <meshStandardMaterial color="#FF0000" />
          </Sphere>
          <Sphere args={[0.05]} position={[0, 0.02, 0.1]}>
            <meshStandardMaterial color="#00FF00" />
          </Sphere>
          <Sphere args={[0.05]} position={[0.1, 0.02, 0.1]}>
            <meshStandardMaterial color="#0000FF" />
          </Sphere>
        </group>
      )}

      {/* Name label */}
      <Text
        position={[0, -2.5, 0]}
        fontSize={0.3}
        color="#4F46E5"
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter.woff"
      >
        {currentStyle.name}
      </Text>
    </group>
  );
}

// Scene setup component
function Scene({ mentorType, isListening, isSpeaking, emotion }) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight position={[-5, 5, 5]} intensity={0.5} color="#60A5FA" />

      {/* Avatar */}
      <AnimatedAvatar
        mentorType={mentorType}
        isListening={isListening}
        isSpeaking={isSpeaking}
        emotion={emotion}
      />

      {/* Background */}
      <Sphere args={[20]} position={[0, 0, -10]}>
        <meshStandardMaterial
          color="#F1F5F9"
          side={THREE.BackSide}
          transparent
          opacity={0.5}
        />
      </Sphere>

      {/* Controls */}
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        enableRotate={true}
        minDistance={3}
        maxDistance={8}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2}
      />
    </>
  );
}

// Loading fallback
function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      <span className="ml-3 text-blue-600">Loading your mentor...</span>
    </div>
  );
}

// Fallback to 2D Avatar Component due to WebGL context issues
export default function Avatar3D({
  mentorType = 'engineer',
  isListening = false,
  isSpeaking = false,
  emotion = 'neutral',
  className = ''
}) {
  return (
    <Avatar2D
      mentorType={mentorType}
      isListening={isListening}
      isSpeaking={isSpeaking}
      emotion={emotion}
      className={className}
    />
  );
}