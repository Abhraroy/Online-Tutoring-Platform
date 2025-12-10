// src/components/LandingPage.jsx
import React from "react";
import { Link , useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="font-sans text-gray-800 min-h-screen">
      {/* Navbar */}
      <header className="sticky top-0 z-50 flex justify-between items-center px-4 sm:px-6 lg:px-8 py-4 bg-white shadow-sm border-b border-gray-100">
        <h1 className="text-xl sm:text-2xl font-bold text-indigo-600">TutorConnect</h1>
        <nav className="hidden md:flex gap-6 text-gray-600">
          <a href="#features" className="hover:text-indigo-600 transition-colors duration-200">Features</a>
          <a href="#how" className="hover:text-indigo-600 transition-colors duration-200">How It Works</a>
          <a href="#testimonials" className="hover:text-indigo-600 transition-colors duration-200">Testimonials</a>
          <a href="#contact" className="hover:text-indigo-600 transition-colors duration-200">Contact</a>
        </nav>
        <button className="md:hidden text-gray-600 hover:text-indigo-600 transition-colors duration-200">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col lg:flex-row items-center justify-between px-4 sm:px-6 lg:px-16 py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-indigo-50">
        <div className="lg:w-1/2 text-center lg:text-left mb-8 lg:mb-0">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight">
            Learn Anytime, Anywhere with the Best Tutors
          </h2>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl">
            Access to all kinds of teachers, affordable sessions, and ease of learning across all subjects. 
            Connect with expert tutors and unlock your learning potential.
          </p>
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <button className="px-6 sm:px-8 py-3 sm:py-4 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700 hover:shadow-xl transition-all duration-300 font-semibold text-sm sm:text-base"
            onClick={() => navigate("/student-signup")}
            >
              Find a Tutor
            </button>
            <button className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-indigo-600 border-2 border-indigo-600 rounded-lg hover:bg-indigo-50 transition-all duration-300 font-semibold text-sm sm:text-base"
            onClick={() => navigate("/tutor-signup")}
            >
              Become a Tutor
            </button>
          </div>
        </div>
        <div className="lg:w-1/2 flex justify-center lg:justify-end">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
              alt="Students learning online"
              className="rounded-2xl shadow-2xl w-full max-w-md lg:max-w-lg"
            />
            <div className="absolute -bottom-4 -right-4 bg-indigo-600 text-white p-4 rounded-xl shadow-lg">
              <div className="text-2xl font-bold">1000+</div>
              <div className="text-sm">Happy Students</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-4 sm:px-6 lg:px-16 py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why Choose TutorConnect?
            </h3>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
              Experience the future of online learning with our comprehensive platform designed for both students and tutors.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              {
                title: "Access to All Teachers",
                description: "Connect with qualified tutors across all subjects and skill levels from around the world.",
                icon: "👨‍🏫"
              },
              {
                title: "Easy & Affordable",
                description: "Learn at your own pace with budget-friendly sessions that fit your schedule.",
                icon: "💰"
              },
              {
                title: "All Subjects Covered",
                description: "From mathematics to languages, find expert tutors for every subject you need.",
                icon: "📚"
              },
              {
                title: "Low Cost & Accessible",
                description: "Quality education shouldn't break the bank. Learn from anywhere, anytime.",
                icon: "🌐"
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group p-6 sm:p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-indigo-200"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors duration-300">
                  {feature.title}
                </h4>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how" className="px-4 sm:px-6 lg:px-16 py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-indigo-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h3>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
              Get started in just a few simple steps and begin your learning journey today.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
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
              <div
                key={i}
                className="relative text-center group"
              >
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 sm:p-8 border border-gray-100 hover:border-indigo-200">
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 group-hover:bg-indigo-700 transition-colors duration-300">
                    {i + 1}
                  </div>
                  <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors duration-300">
                    {item.step}
                  </h4>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
                {i < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <div className="w-8 h-0.5 bg-indigo-300"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="px-4 sm:px-6 lg:px-16 py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h3>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
              Don't just take our word for it. Here's what our students and tutors have to say about their experience.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
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
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 sm:p-8 border border-gray-100 hover:border-indigo-200"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <svg key={j} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h5 className="font-semibold text-gray-900">{testimonial.name}</h5>
                    <p className="text-sm text-indigo-600 font-medium">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-16 py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to Start Learning?
          </h3>
          <p className="text-base sm:text-lg text-indigo-100 mb-8 max-w-2xl mx-auto">
            Join thousands of students and tutors who are already using TutorConnect to achieve their learning goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-indigo-600 rounded-lg shadow-lg hover:bg-gray-50 hover:shadow-xl transition-all duration-300 font-semibold text-base">
              Get Started as Student
            </button>
            <button className="px-8 py-4 bg-transparent text-white border-2 border-white rounded-lg hover:bg-white hover:text-indigo-600 transition-all duration-300 font-semibold text-base">
              Become a Tutor
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="px-4 sm:px-6 lg:px-16 py-8 sm:py-12 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <h4 className="text-2xl font-bold text-indigo-400 mb-4">TutorConnect</h4>
              <p className="text-gray-300 mb-4 max-w-md">
                Connecting students with the best tutors worldwide. Quality education made accessible and affordable for everyone.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors duration-200">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors duration-200">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors duration-200">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h5 className="text-lg font-semibold mb-4">For Students</h5>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-indigo-400 transition-colors duration-200">Find Tutors</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors duration-200">Browse Subjects</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors duration-200">Book Sessions</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors duration-200">Student Support</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-lg font-semibold mb-4">For Tutors</h5>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-indigo-400 transition-colors duration-200">Become a Tutor</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors duration-200">Upload Sessions</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors duration-200">Manage Bookings</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors duration-200">Tutor Support</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              &copy; 2025 TutorConnect. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-indigo-400 transition-colors duration-200">Privacy Policy</a>
              <a href="#" className="hover:text-indigo-400 transition-colors duration-200">Terms of Service</a>
              <a href="#" className="hover:text-indigo-400 transition-colors duration-200">Cookie Policy</a>
              <a href="#" className="hover:text-indigo-400 transition-colors duration-200">Contact Us</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
