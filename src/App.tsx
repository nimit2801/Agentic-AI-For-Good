import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Layout from './components/Layout';
import AdminRoute from './components/AdminRoute';

const Philosophy = lazy(() => import('./pages/Philosophy'));
const Story = lazy(() => import('./pages/Story'));
const Stories = lazy(() => import('./pages/Stories'));
const StoryDetail = lazy(() => import('./pages/StoryDetail'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminStories = lazy(() => import('./pages/AdminStories'));
const NotFound = lazy(() => import('./pages/NotFound'));

import { Helmet } from 'react-helmet-async';

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
      <Helmet>
        <title>Agentic AI For Good — Discover AI Tools Making Real Impact</title>
        <meta name="description" content="Discover the best AI tools, open-source agents, and autonomous systems solving real problems. Curated knowledge base for builders who want to stop reinventing the wheel." />
        <link rel="canonical" href="https://agenticaiforgood.com/" />
      </Helmet>
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
    <HelmetProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Layout>
          <Suspense fallback={<div className="min-h-screen bg-[#F5F1EB]" />}>
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
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </Layout>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
