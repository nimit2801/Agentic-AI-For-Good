import { useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Layout from './components/Layout';
import Philosophy from './pages/Philosophy';
import Story from './pages/Story';
import Stories from './pages/Stories';
import StoryDetail from './pages/StoryDetail';
import AdminLogin from './pages/AdminLogin';
import AdminStories from './pages/AdminStories';
import AdminRoute from './components/AdminRoute';

import Hero from './sections/Hero';
import Problem from './sections/Problem';
import WhatWeDo from './sections/WhatWeDo';
import Architecture from './sections/Architecture';
import JoinMovement from './sections/JoinMovement';
import Footer from './sections/Footer';

import './App.css';

gsap.registerPlugin(ScrollTrigger);

// Home page component
function Home() {
  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <>
      <Hero />
      <Problem />
      <WhatWeDo />
      <Architecture />
      <JoinMovement />
      <Footer />
    </>
  );
}

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    ScrollTrigger.refresh();
  }, [pathname]);

  return null;
}

function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/philosophy" element={<Philosophy />} />
          <Route path="/story" element={<Story />} />
          <Route path="/stories" element={<Stories />} />
          <Route path="/stories/:slug" element={<StoryDetail />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route
            path="/admin/stories"
            element={
              <AdminRoute>
                <AdminStories />
              </AdminRoute>
            }
          />
        </Routes>
      </Layout>
    </HashRouter>
  );
}

export default App;
