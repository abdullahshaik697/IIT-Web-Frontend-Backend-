"use client";
import "../../index.css"

import { useState } from "react";

export default function Courses() {
  const [selectedCourse, setSelectedCourse] = useState(null);

  const courses = [
    {
      id: 1,
      title: 'CIT',
      shortTitle: 'Computer Information Technology',
      description:
        'Comprehensive IT fundamentals including programming, databases, and system administration.',
      image: '/images/CIT.png',
    },
    {
      id: 2,
      title: 'Office Automation',
      shortTitle: 'MS Office & Business Tools',
      description:
        'Master MS Office suite including Word, Excel, PowerPoint, and advanced data management.',
      image: '/images/office.png',
    },
    {
      id: 3,
      title: 'AI',
      shortTitle: 'Artificial Intelligence',
      description:
        'Explore machine learning, deep learning, neural networks, and AI applications.',
      image: '/images/ai1.png',
    },
    {
      id: 4,
      title: 'Networking',
      shortTitle: 'Network Administration',
      description:
        'Learn network design, configuration, troubleshooting, and security protocols.',
      image: '/images/net.png',
    },
    {
      id: 5,
      title: 'Cyber Security',
      shortTitle: 'Information Security',
      description:
        'Understand cybersecurity threats, defense mechanisms, and ethical hacking.',
      image: '/images/cyber.png',
    },
    {
      id: 6,
      title: 'Web Development',
      shortTitle: 'Frontend & Backend',
      description:
        'Build responsive websites using HTML, CSS, JavaScript, React, Node.js, and databases.',
      image: '/images/mern.png',
    },
    {
      id: 7,
      title: 'Mobile App Dev',
      shortTitle: 'iOS & Android Development',
      description:
        'Create native and cross-platform mobile applications for iOS and Android.',
      image: '/images/app.png',
    },
  ];

  // 🔥 DEBUG: Check if button click is working
  const handleDetailsClick = (course) => {
    console.log("Details clicked for:", course.title); // Console mein check karo
    setSelectedCourse(course);
  };

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Popular <span className="text-green-600">Courses</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-3">
            Choose from our wide range of industry-leading courses designed to boost your IT career.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">

          {courses.map((course) => (
            <div
              key={course.id}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition duration-500 hover:-translate-y-3"
            >

              {/* TOP BADGE */}
              <span className="absolute top-3 left-3 z-10 bg-green-600 text-white text-xs px-3 py-1 rounded-full shadow-md pointer-events-none">
                Popular
              </span>

              {/* IMAGE */}
              <div className="relative h-40 sm:h-44 md:h-48 overflow-hidden pointer-events-none">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
                />

                {/* Dark overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                {/* Hover text on image */}
              
              </div>

              {/* CONTENT */}
              <div className="p-6 relative z-10">
                {/* 👆 z-10 diya taaki buttons glow border ke upar rahein */}

                <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-600 transition pointer-events-none">
                  {course.title}
                </h3>

                {/* BUTTONS */}
                <div className="flex gap-2 mt-4">

                  <button 
                    type="button"
                    className="relative z-20 flex-1 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold transition duration-300 hover:bg-green-700 hover:shadow-lg cursor-pointer"
                  >
                    Enroll
                  </button>

                  {/* FIXED DETAILS BUTTON */}
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation(); 
                      handleDetailsClick(course);
                    }}
                    className="relative z-20 flex-1 py-2 rounded-lg border border-green-600 text-green-600 text-sm font-semibold transition duration-300 hover:bg-green-600 hover:text-white cursor-pointer"
                  >
                    Details
                  </button>

                </div>
              </div>

              {/* Glow border effect */}
              <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-green-400/40 transition duration-500 pointer-events-none z-0"></div>
              

            </div>
          ))}

        </div>
      </div>

      {/* POPUP MODAL */}
      
      {selectedCourse && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => {
            console.log("Overlay clicked - closing");
            setSelectedCourse(null);
          }}
        >
          
          {/* Overlay Background */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

          {/* Popup Content */}
          <div 
            className="relative bg-white max-w-lg w-full overflow-hidden shadow-2xl slide-in"
            onClick={(e) => e.stopPropagation()}
          >

            {/* Close Button */}
            <button
              onClick={() => {
                console.log("Close button clicked");
                setSelectedCourse(null);
              }}
              className="absolute top-3 right-3 z-20 bg-transparent hover:bg-white text-gray-700 p-2 rounded-full shadow-md transition cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            {/* Popup Image */}
            <div className="relative h-48 sm:h-56 overflow-hidden">
              <img
                src={selectedCourse.image}
                alt={selectedCourse.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              
              {/* Title on image */}
              <div className="absolute bottom-4 left-6">
                <h3 className="text-2xl font-bold text-white">
                  {selectedCourse.title}
                </h3>
              </div>
            </div>

            {/* Popup Content */}
            <div className="p-6">
              
              {/* Short Title */}
              <p className="text-sm text-green-600 font-semibold mb-3">
                {selectedCourse.shortTitle}
              </p>

              {/* Description */}
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                {selectedCourse.description}
              </p>

              {/* Buttons */}
              <div className="flex gap-3">
                <button className="flex-1 py-3 rounded-lg bg-green-600 text-white font-semibold transition duration-300 hover:bg-green-700 hover:shadow-lg cursor-pointer">
                  Enroll Now
                </button>
                
                <button 
                  onClick={() => setSelectedCourse(null)}
                  className="flex-1 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold transition duration-300 hover:bg-gray-100 cursor-pointer"
                >
                  Close
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    

    </section>
  );
}