// src/components/LandingPage.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="font-sans text-slate-800 min-h-screen bg-white antialiased">
      {/* Modern Navbar with Glass Effect */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-slate-200/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            <Link 
              to="/" 
              className="flex items-center gap-2 group"
              aria-label="TutorConnect Home"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <span className="text-white font-bold text-lg">TC</span>
              </div>
              <span className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                TutorConnect
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              <a 
                href="#features" 
                className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md px-2 py-1"
              >
                Features
              </a>
              <a 
                href="#how" 
                className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md px-2 py-1"
              >
                How It Works
              </a>
              <a 
                href="#testimonials" 
                className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md px-2 py-1"
              >
                Testimonials
              </a>
              <a 
                href="#contact" 
                className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md px-2 py-1"
              >
                Contact
              </a>
            </nav>
            <button 
              className="md:hidden p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-lg">
            <nav className="px-4 py-4 space-y-2">
              <a 
                href="#features" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-2 text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Features
              </a>
              <a 
                href="#how" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-2 text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                How It Works
              </a>
              <a 
                href="#testimonials" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-2 text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Testimonials
              </a>
              <a 
                href="#contact" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-2 text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Contact
              </a>
            </nav>
          </div>
        )}
      </header>

      {/* Modern Hero Section with Background Image */}
      <section className="relative min-h-[90vh] sm:min-h-[85vh] lg:min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"
            alt="Students learning online"
            className="w-full h-full object-cover"
          />
          {/* Gradient Overlays for Modern Look */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/85 via-slate-900/75 to-slate-900/70"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-blue-600/20 via-transparent to-indigo-600/20"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-32 w-full">
          <div className="max-w-4xl mx-auto text-center space-y-8 sm:space-y-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-sm font-medium text-white/90 shadow-lg animate-pulse">
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
              Trusted by 1000+ students worldwide
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-tight drop-shadow-2xl">
              Learn Anytime,{" "}
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                Anywhere
              </span>
              <br />
              with Expert Tutors
            </h1>

            {/* Description */}
            <p className="text-lg sm:text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow-lg">
              Connect with qualified tutors across all subjects. Affordable, flexible, and personalized learning experiences tailored to your goals.
            </p>

            {/* Main CTA Buttons - The Star Attraction */}
            <div className="flex flex-col sm:flex-row gap-5 sm:gap-6 justify-center items-center pt-6 sm:pt-8">
              <button 
                onClick={() => navigate("/student-signup")}
                className="group relative w-full sm:w-auto px-10 sm:px-12 py-5 sm:py-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-2xl font-bold text-lg sm:text-xl shadow-2xl shadow-blue-600/50 hover:shadow-blue-600/70 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-400/50 focus:ring-offset-4 focus:ring-offset-transparent transform hover:-translate-y-1"
                aria-label="Sign up as a student to find a tutor"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  <span>Find a Tutor</span>
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              <button 
                onClick={() => navigate("/tutor-signup")}
                className="group relative w-full sm:w-auto px-10 sm:px-12 py-5 sm:py-6 bg-white/95 backdrop-blur-sm text-slate-900 border-2 border-white/30 rounded-2xl font-bold text-lg sm:text-xl shadow-2xl shadow-black/20 hover:shadow-black/30 transition-all duration-300 hover:scale-110 hover:bg-white focus:outline-none focus:ring-4 focus:ring-white/50 focus:ring-offset-4 focus:ring-offset-transparent transform hover:-translate-y-1"
                aria-label="Become a tutor and start teaching"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  <span>Become a Tutor</span>
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 pt-8 sm:pt-12 text-white/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="text-xl sm:text-2xl font-bold text-white">1000+</div>
                  <div className="text-xs sm:text-sm">Happy Students</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20">
                  <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="text-xl sm:text-2xl font-bold text-white">500+</div>
                  <div className="text-xs sm:text-sm">Expert Tutors</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20">
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="text-xl sm:text-2xl font-bold text-white">24/7</div>
                  <div className="text-xs sm:text-sm">Available</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent z-10"></div>
      </section>

      {/* Features Section with Modern Cards */}
      <section id="features" className="py-20 sm:py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              Why Choose <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">TutorConnect?</span>
            </h2>
            <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto">
              Experience the future of online learning with our comprehensive platform designed for both students and tutors.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[
              {
                title: "Expert Tutors",
                description: "Connect with qualified tutors across all subjects and skill levels from around the world.",
                icon: "👨‍🏫",
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                title: "Affordable Learning",
                description: "Learn at your own pace with budget-friendly sessions that fit your schedule.",
                icon: "💰",
                gradient: "from-emerald-500 to-teal-500"
              },
              {
                title: "All Subjects",
                description: "From mathematics to languages, find expert tutors for every subject you need.",
                icon: "📚",
                gradient: "from-purple-500 to-pink-500"
              },
              {
                title: "Learn Anywhere",
                description: "Quality education shouldn't break the bank. Learn from anywhere, anytime.",
                icon: "🌐",
                gradient: "from-orange-500 to-amber-500"
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group relative p-8 bg-white rounded-2xl border border-slate-200 hover:border-blue-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how" className="py-20 sm:py-24 lg:py-32 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto">
              Get started in just a few simple steps and begin your learning journey today.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {[
              {
                step: "Search for a Tutor",
                description: "Browse through our extensive database of qualified tutors and find the perfect match for your learning needs.",
                icon: "🔍"
              },
              {
                step: "Book a Session",
                description: "Schedule your preferred time slot and confirm your booking with just a few clicks.",
                icon: "📅"
              },
              {
                step: "Tutor Uploads Session",
                description: "Your tutor prepares and uploads the learning materials and session content for you.",
                icon: "📤"
              },
              {
                step: "Learn Seamlessly",
                description: "Access your session materials and start learning with interactive content and support.",
                icon: "🎓"
              },
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="h-full bg-white rounded-2xl p-8 border border-slate-200 hover:border-blue-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-500 text-white rounded-xl flex items-center justify-center text-2xl font-bold mb-6 shadow-lg">
                    {i + 1}
                  </div>
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    {item.step}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
                {i < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-blue-300 to-indigo-300"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 sm:py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto">
              Don't just take our word for it. Here's what our students and tutors have to say about their experience.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Student",
                content: "TutorConnect has completely transformed my learning experience. The tutors are knowledgeable and the platform is so easy to use!",
                rating: 5,
                avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80"
              },
              {
                name: "Michael Chen",
                role: "Tutor",
                content: "As a tutor, I love how seamless it is to upload sessions and connect with students. The platform makes teaching so much more efficient.",
                rating: 5,
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80"
              },
              {
                name: "Emily Rodriguez",
                role: "Student",
                content: "The affordability and quality of education here is unmatched. I've improved my grades significantly since joining!",
                rating: 5,
                avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80"
              },
            ].map((testimonial, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-8 border border-slate-200 hover:border-blue-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <svg key={j} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-slate-600 mb-8 leading-relaxed text-lg">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.avatar}
                    alt={`${testimonial.name}, ${testimonial.role}`}
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-slate-200"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">{testimonial.name}</h4>
                    <p className="text-sm text-blue-600 font-medium">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modern CTA Section */}
      <section className="py-20 sm:py-24 lg:py-32 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Start Learning?
          </h2>
          <p className="text-lg sm:text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join thousands of students and tutors who are already using TutorConnect to achieve their learning goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate("/student-signup")}
              className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold text-base shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-blue-600"
              aria-label="Get started as a student"
            >
              Get Started as Student
            </button>
            <button 
              onClick={() => navigate("/tutor-signup")}
              className="px-8 py-4 bg-transparent text-white border-2 border-white/80 rounded-xl font-semibold text-base hover:bg-white/10 hover:border-white transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-blue-600"
              aria-label="Become a tutor"
            >
              Become a Tutor
            </button>
          </div>
        </div>
      </section>

      {/* Modern Footer */}
      <footer id="contact" className="bg-slate-900 text-slate-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
            <div className="lg:col-span-2">
              <h3 className="text-2xl font-bold text-white mb-4">TutorConnect</h3>
              <p className="text-slate-400 mb-6 max-w-md leading-relaxed">
                Connecting students with the best tutors worldwide. Quality education made accessible and affordable for everyone.
              </p>
              <div className="flex gap-4">
                {[
                  { name: "Twitter", path: "M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" },
                  { name: "Facebook", path: "M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" },
                  { name: "LinkedIn", path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" },
                ].map((social, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-10 h-10 bg-slate-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                    aria-label={social.name}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d={social.path} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">For Students</h4>
              <ul className="space-y-3">
                {["Find Tutors", "Browse Subjects", "Book Sessions", "Student Support"].map((link, i) => (
                  <li key={i}>
                    <a 
                      href="#" 
                      className="text-slate-400 hover:text-blue-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 rounded px-1"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">For Tutors</h4>
              <ul className="space-y-3">
                {["Become a Tutor", "Upload Sessions", "Manage Bookings", "Tutor Support"].map((link, i) => (
                  <li key={i}>
                    <a 
                      href="#" 
                      className="text-slate-400 hover:text-blue-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 rounded px-1"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm">
              &copy; {new Date().getFullYear()} TutorConnect. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-6 text-sm">
              {["Privacy Policy", "Terms of Service", "Cookie Policy", "Contact Us"].map((link, i) => (
                <a 
                  key={i}
                  href="#" 
                  className="text-slate-400 hover:text-blue-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 rounded px-1"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;