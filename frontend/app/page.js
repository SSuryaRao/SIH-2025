'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import {
  Target,
  BookOpen,
  Building2,
  CalendarDays,
  Users,
  School,
  CalendarCheck,
  Twitter,
  Linkedin,
  Github,
  ArrowRight
} from 'lucide-react';

// 🎓 Education-focused Lottie animations for SIH project - Choose one:

// Option 1: Student with Books & Graduation (Recommended for SIH)
const educationLottie = "https://assets2.lottiefiles.com/packages/lf20_DMgKk1.json";

// Option 2: Online Learning & Computer (Modern Education)
// const educationLottie = "https://assets5.lottiefiles.com/packages/lf20_W51pqp.json";

// Option 3: Education Tree with Books (Knowledge Growth)
// const educationLottie = "https://assets9.lottiefiles.com/packages/lf20_qp1spzqv.json";

// Option 4: Student Achievement & Trophy (Academic Success)
// const educationLottie = "https://assets1.lottiefiles.com/packages/lf20_q5pk6p1k.json";

// Option 5: Digital Education & Learning (Tech-focused)
// const educationLottie = "https://assets4.lottiefiles.com/packages/lf20_kkflmtur.json";

// Typing animation component
function TypingTagline({ phrases = [], speed = 80, pause = 1200 }) {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [blink, setBlink] = useState(true);
  const [reverse, setReverse] = useState(false);

  useEffect(() => {
    if (subIndex === phrases[index].length + 1 && !reverse) {
      const t = setTimeout(() => setReverse(true), pause);
      return () => clearTimeout(t);
    }
    if (subIndex === 0 && reverse) {
      const t = setTimeout(() => {
        setReverse(false);
        setIndex((prev) => (prev + 1) % phrases.length);
      }, 300);
      return () => clearTimeout(t);
    }
    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, speed);
    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse, phrases, speed, pause]);

  useEffect(() => {
    const blinkInt = setInterval(() => setBlink((v) => !v), 500);
    return () => clearInterval(blinkInt);
  }, []);

  return (
    <span className="inline-block">
      {phrases[index].substring(0, Math.max(0, subIndex))}
      <span className="ml-1" style={{ opacity: blink ? 1 : 0 }}>
        |
      </span>
    </span>
  );
}

// Animated counter hook
function useCountAnimation(target, duration = 1200) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start = 0;
    const diff = Number(target.toString().replace(/\D/g, '')) || Number(target);
    const stepTime = Math.max(16, Math.floor(duration / (diff || 1)));
    let rafId;
    function step() {
      start += Math.ceil(Math.max(1, diff * (16 / duration)));
      if (start >= diff) {
        setValue(target);
        cancelAnimationFrame(rafId);
      } else {
        const suffix = target.toString().replace(/[0-9]/g, '');
        setValue(String(start) + suffix);
        rafId = requestAnimationFrame(step);
      }
    }
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [target, duration]);
  return value;
}

const features = [
  { icon: Target, title: 'Aptitude Quiz', description: 'Discover your best-fit stream and career path through personalized assessments.', link: '/quiz' },
  { icon: BookOpen, title: 'Courses', description: 'Explore what each degree offers and discover exciting career opportunities.', link: '/courses' },
  { icon: Building2, title: 'Colleges', description: 'Find nearby government colleges with comprehensive facilities and programs.', link: '/colleges' },
  { icon: CalendarDays, title: 'Timeline', description: 'Stay on top of admissions, exams, and scholarship deadlines.', link: '/timeline' }
];

const steps = [
  { number: '01', title: 'Sign Up', description: 'Create your free account to get started on your journey.' },
  { number: '02', title: 'Take the Quiz', description: 'Get your personalized stream recommendation based on your interests.' },
  { number: '03', title: 'Explore', description: 'Discover courses, colleges, and timeline tailored specifically to you.' }
];

const stats = [
  { icon: Users, number: '500+', label: 'Students Guided' },
  { icon: School, number: '100+', label: 'Colleges Listed' },
  { icon: CalendarCheck, number: '50+', label: 'Events Tracked' }
];

export default function Home() {
  const [demoOpen, setDemoOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [lottieData, setLottieData] = useState(null);

  const testimonials = [
    { name: 'Ananya', text: 'This platform helped me choose the right stream and get into my dream college!', pic: 'https://randomuser.me/api/portraits/women/65.jpg', rating: 5 },
    { name: 'Rohit', text: 'Intuitive quiz and great timeline reminders — everything in one place.', pic: 'https://randomuser.me/api/portraits/men/32.jpg', rating: 5 },
    { name: 'Meera', text: 'Loved the personalized course suggestions — saved me so much time.', pic: 'https://randomuser.me/api/portraits/women/44.jpg', rating: 4 }
  ];

  useEffect(() => {
    const id = setInterval(() => setCurrentTestimonial((v) => (v + 1) % testimonials.length), 6000);
    return () => clearInterval(id);
  }, [testimonials.length]);

  useEffect(() => {
    fetch(educationLottie)
      .then(response => response.json())
      .then(data => setLottieData(data))
      .catch(error => console.error('Error loading Lottie animation:', error));
  }, []);

  // Individual hook calls for each stat (hooks must be called at top level)
  const count1 = useCountAnimation(stats[0].number, 1000);
  const count2 = useCountAnimation(stats[1].number, 1000);
  const count3 = useCountAnimation(stats[2].number, 1000);
  const counts = [count1, count2, count3];

  return (
    <div className="min-h-screen font-inter antialiased text-gray-900">
      {/* HERO */}
      <section className="relative min-h-[88vh] flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-700 via-purple-600 to-pink-500 opacity-95 animate-[pulse_8s_ease-in-out_infinite]" />

        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="text-white">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight drop-shadow-lg">
                Shape your future with clarity.
              </h1>

              <div className="mt-4 text-lg md:text-xl text-white/90 max-w-2xl">
                <TypingTagline phrases={[
                  'Find your stream. Build your path.',
                  'Get personalized college & course suggestions.',
                  'Meet deadlines. Achieve your goals.'
                ]}/>
                <p className="mt-4 text-white/85">A one-stop tailored guidance platform for students — quizzes, timelines, college search and more.</p>
              </div>

              <div className="flex gap-4 mt-8 items-center">
                <Link href="/register" className="relative inline-flex items-center justify-center px-8 py-3 rounded-2xl font-semibold text-indigo-700 bg-white shadow-2xl transform hover:-translate-y-0.5 hover:scale-105 transition-all duration-300">
                  <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-yellow-300 to-pink-300 opacity-20 blur-sm" />
                  Join Now
                </Link>
                <button onClick={() => setDemoOpen(true)} className="inline-flex items-center gap-3 px-5 py-3 rounded-lg bg-white/10 border border-white/25 text-white hover:shadow-xl transition transform hover:translate-y-[-2px]">
                  <span>Watch Demo 🎥</span>
                </button>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 40, scale: 0.98 }} whileInView={{ opacity: 1, x: 0, scale: 1 }} transition={{ duration: 0.9 }} viewport={{ once: true }} className="flex items-center justify-center">
              <div className="w-[420px] h-[420px] rounded-3xl bg-white/10 backdrop-blur-md p-6 flex items-center justify-center shadow-2xl">
                {/* ✅ Lottie from URL */}
                {lottieData ? (
                  <Lottie animationData={lottieData} loop={true} autoplay={true} style={{ width: '100%', height: '100%' }}/>
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-white/60">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
                      <p>Loading animation...</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FEATURES - flip tiles */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold inline-block relative">
              <span>Powerful Features</span>
              <span className="block h-1 w-36 mx-auto mt-3 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500" />
            </h2>
            <p className="text-gray-600 mt-3">Everything you need to choose the right path — interactive, visual and personal.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, idx) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{
                    y: -8,
                    transition: { duration: 0.3, ease: "easeOut" }
                  }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  viewport={{ once: true }}
                  className="group cursor-pointer"
                >
                  <div className="relative bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 h-64 flex flex-col justify-between border border-gray-100 hover:border-indigo-200 overflow-hidden">
                    {/* Background gradient that appears on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Content */}
                    <div className="relative z-10">
                      {/* Icon and title */}
                      <div className="flex items-center gap-4 mb-4">
                        <motion.div
                          className="p-3 rounded-lg bg-gradient-to-br from-indigo-50 to-purple-50 group-hover:from-indigo-100 group-hover:to-purple-100 transition-all duration-300"
                          whileHover={{
                            scale: 1.1,
                            rotate: [0, -10, 10, -10, 0],
                            transition: { duration: 0.5 }
                          }}
                        >
                          <Icon size={32} className="text-indigo-600 group-hover:text-indigo-700 transition-colors duration-300" />
                        </motion.div>
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-900 transition-colors duration-300">{f.title}</h3>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-gray-600 group-hover:text-gray-700 leading-relaxed transition-colors duration-300">
                        {f.description}
                      </p>
                    </div>

                    {/* Bottom section */}
                    <div className="relative z-10 flex items-center justify-between">
                      <Link
                        href={f.link}
                        className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 group-hover:text-indigo-700 transition-colors duration-300 hover:gap-3"
                      >
                        Explore
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
                      </Link>
                      <div className="w-2 h-2 rounded-full bg-indigo-200 group-hover:bg-indigo-400 transition-colors duration-300" />
                    </div>

                    {/* Animated border */}
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS - curved roadmap */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold">How it works</h2>
            <p className="text-gray-600 mt-2">Follow a simple roadmap — step by step.</p>
          </motion.div>

          <div className="relative">
            {/* curved svg line */}
            <svg className="w-full h-40 md:h-48" viewBox="0 0 1200 150" preserveAspectRatio="none">
              <defs>
                <linearGradient id="roadGradient" x1="0" x2="1">
                  <stop offset="0%" stopColor="#7c3aed" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
              <path d="M40 120 C300 0 900 0 1160 120" fill="none" stroke="url(#roadGradient)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-8">
              {steps.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-xl shadow p-6 text-center"
                >
                  <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl mb-4">
                    {s.number}
                  </div>
                  <h4 className="font-semibold text-lg">{s.title}</h4>
                  <p className="text-sm text-gray-500 mt-2">{s.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* IMPACT & TESTIMONIALS */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl md:text-4xl font-bold">Our Impact</h2>
            <p className="text-gray-600 mt-2">Real results from real students.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((s, idx) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{
                    y: -8,
                    transition: { duration: 0.3, ease: "easeOut" }
                  }}
                  transition={{
                    duration: 0.7,
                    delay: idx * 0.15,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <div className="relative p-6 rounded-3xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-blue-200 overflow-hidden">
                    {/* Diploma/Certificate ribbon */}
                    <div className="absolute -top-2 -right-2 w-16 h-16">
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-amber-400 via-orange-400 to-red-400 rounded-full opacity-20"
                        animate={{
                          rotate: [0, 360],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{
                          duration: 8,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                      />
                      <motion.div
                        className="absolute top-2 right-2 text-2xl"
                        initial={{ scale: 0, rotate: -90 }}
                        whileInView={{ scale: 1, rotate: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 200,
                          damping: 10,
                          delay: idx * 0.15 + 0.8
                        }}
                      >
                        🏆
                      </motion.div>
                    </div>

                    {/* Student achievement pathway */}
                    <div className="flex items-center justify-center mb-6">
                      <motion.div
                        className="relative"
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 150,
                          damping: 12,
                          delay: idx * 0.15 + 0.3
                        }}
                      >
                        {/* Academic milestone circle */}
                        <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-4 border-blue-100 group-hover:border-blue-200 transition-all duration-300 flex items-center justify-center">
                          <Icon size={36} className="text-blue-600 group-hover:text-blue-700 transition-colors duration-300" />

                          {/* Success ripples */}
                          <motion.div
                            className="absolute inset-0 rounded-full border-2 border-blue-300"
                            animate={{
                              scale: [1, 1.3, 1],
                              opacity: [0.6, 0, 0.6]
                            }}
                            transition={{
                              duration: 2.5,
                              repeat: Infinity,
                              delay: idx * 0.3
                            }}
                          />
                          <motion.div
                            className="absolute inset-0 rounded-full border border-indigo-400"
                            animate={{
                              scale: [1, 1.5, 1],
                              opacity: [0.4, 0, 0.4]
                            }}
                            transition={{
                              duration: 2.5,
                              repeat: Infinity,
                              delay: idx * 0.3 + 0.5
                            }}
                          />
                        </div>

                        {/* Learning path dots */}
                        <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1">
                          {[...Array(3)].map((_, dotIdx) => (
                            <motion.div
                              key={dotIdx}
                              className="w-2 h-2 rounded-full bg-blue-400"
                              initial={{ scale: 0 }}
                              whileInView={{ scale: 1 }}
                              transition={{
                                delay: idx * 0.15 + 0.5 + dotIdx * 0.1,
                                type: "spring",
                                stiffness: 300
                              }}
                              animate={{
                                y: [0, -4, 0],
                                opacity: [0.5, 1, 0.5],
                                transition: {
                                  duration: 1.5,
                                  repeat: Infinity,
                                  delay: dotIdx * 0.2
                                }
                              }}
                            />
                          ))}
                        </div>
                      </motion.div>
                    </div>

                    {/* Academic achievement number */}
                    <motion.div
                      className="text-center mb-4"
                      initial={{ scale: 0.5, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 100,
                        delay: idx * 0.15 + 0.6
                      }}
                    >
                      <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 mb-1">
                        {counts[idx]}
                      </div>

                      {/* Achievement level indicator */}
                      <motion.div
                        className="w-16 h-1 mx-auto rounded-full bg-gradient-to-r from-blue-400 to-indigo-500"
                        initial={{ width: 0 }}
                        whileInView={{ width: 64 }}
                        transition={{
                          duration: 1,
                          delay: idx * 0.15 + 0.8,
                          ease: "easeOut"
                        }}
                      />
                    </motion.div>

                    {/* Educational milestone label */}
                    <motion.div
                      className="text-center text-gray-700 font-semibold"
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.15 + 0.9 }}
                    >
                      {s.label}
                    </motion.div>

                    {/* Student progress visualization */}
                    <div className="mt-6 space-y-2">
                      {/* Progress books */}
                      <div className="flex justify-center space-x-2">
                        {[...Array(4)].map((_, bookIdx) => (
                          <motion.div
                            key={bookIdx}
                            className="relative"
                            initial={{ y: 20, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            transition={{
                              delay: idx * 0.15 + 1.2 + bookIdx * 0.1,
                              duration: 0.5
                            }}
                          >
                            <div className="w-3 h-8 bg-gradient-to-t from-blue-400 to-blue-300 rounded-sm shadow-sm">
                              <motion.div
                                className="w-full bg-gradient-to-t from-blue-600 to-blue-500 rounded-sm"
                                initial={{ height: 0 }}
                                whileInView={{ height: `${Math.random() * 70 + 30}%` }}
                                transition={{
                                  delay: idx * 0.15 + 1.4 + bookIdx * 0.1,
                                  duration: 0.8,
                                  ease: "easeOut"
                                }}
                              />
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Excellence indicator */}
                      <motion.div
                        className="text-center text-xs text-blue-600 font-medium"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: idx * 0.15 + 1.6 }}
                      >
                        Excellence in Education
                      </motion.div>
                    </div>

                    {/* Knowledge aura effect */}
                    <motion.div
                      className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    />

                    {/* Corner academic elements */}
                    <div className="absolute bottom-4 left-4 opacity-10 text-blue-600">
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      >
                        📚
                      </motion.div>
                    </div>
                    <div className="absolute top-4 left-4 opacity-10 text-indigo-600">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      >
                        🎓
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* testimonials */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-1">
              <h3 className="text-2xl font-bold">Student Stories</h3>
              <p className="text-gray-600 mt-2">Hear directly from students who used the platform.</p>
            </div>

            <div className="md:col-span-2">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-4">
                  <Image src={testimonials[currentTestimonial].pic} alt="profile" width={64} height={64} className="w-16 h-16 rounded-full object-cover" />
                  <div>
                    <div className="font-semibold">{testimonials[currentTestimonial].name}</div>
                    <div className="text-yellow-500">
                      {Array.from({ length: testimonials[currentTestimonial].rating }).map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-gray-700">{testimonials[currentTestimonial].text}</p>

                <div className="flex gap-2 mt-4">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentTestimonial(i)}
                      className={`w-3 h-3 rounded-full ${i === currentTestimonial ? 'bg-indigo-600' : 'bg-gray-300'}`}
                      aria-label={`Go to testimonial ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-16 bg-gradient-to-r from-indigo-700 to-pink-600 text-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl font-bold mb-4"
          >
            Ready to get started?
          </motion.h3>
          <p className="text-white/90 mb-6">Create your free account and explore a personalized roadmap to success.</p>

          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <motion.a
              whileHover={{ scale: 1.03, rotateX: 6 }}
              className="relative inline-flex items-center justify-center px-8 py-3 rounded-2xl font-semibold text-indigo-700 bg-white shadow-2xl"
              href="/register"
            >
              <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-yellow-300 to-pink-300 opacity-20 blur" />
              Join Now
            </motion.a>

            <button
              onClick={() => setDemoOpen(true)}
              className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20"
            >
              Watch Demo 🎥
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-200 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-xl font-bold">Digital Guidance Platform</h4>
              <p className="text-sm mt-3 text-gray-400">
                Empowering students with personalized career guidance and educational insights.
              </p>
              <div className="flex gap-3 mt-4">
                <a href="#" aria-label="twitter" className="hover:text-white"><Twitter /></a>
                <a href="#" aria-label="linkedin" className="hover:text-white"><Linkedin /></a>
                <a href="#" aria-label="github" className="hover:text-white"><Github /></a>
              </div>
            </div>

            <div>
              <h5 className="font-semibold mb-3">Quick Links</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/about">About</Link></li>
                <li><Link href="/contact">Contact</Link></li>
                <li><Link href="/privacy">Privacy</Link></li>
                <li><Link href="/help">Help</Link></li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold mb-3">Features</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/quiz">Aptitude Quiz</Link></li>
                <li><Link href="/courses">Courses</Link></li>
                <li><Link href="/colleges">Colleges</Link></li>
                <li><Link href="/timeline">Timeline</Link></li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold mb-3">Newsletter</h5>
              <p className="text-sm text-gray-400 mb-3">Get monthly tips & important dates.</p>
              <form className="flex gap-2">
                <input className="flex-1 rounded-lg px-3 py-2 text-gray-900" placeholder="Your email" type="email" />
                <button className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white">Subscribe</button>
              </form>
              <div className="text-xs text-gray-500 mt-3">We respect your privacy.</div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-10 pt-6 text-sm text-gray-500 text-center">
            © {new Date().getFullYear()} Digital Guidance Platform. Built for SIH 2025.
          </div>
        </div>
      </footer>

      {/* Styles for flip & backface */}
      <style jsx>{`
        .perspective-1000 { perspective: 1000px; }
        .backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
        .group:hover .group-hover\\:animate-spin-slow { animation: spin 8s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
          100% { transform: translateY(0px); }
        }
        .animate-[float_6s_ease-in-out_infinite] { animation: float 6s ease-in-out infinite; }
        .animate-[float_10s_ease-in-out_infinite] { animation: float 10s ease-in-out infinite; }
        .animate-[pulse_8s_ease-in-out_infinite] { animation: pulse 8s ease-in-out infinite; }
        @keyframes pulse {
          0% { filter: saturate(1); transform: scale(1); }
          50% { filter: saturate(1.05); transform: scale(1.02); }
          100% { filter: saturate(1); transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
