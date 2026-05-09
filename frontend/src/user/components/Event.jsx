import { Calendar, MapPin, Clock, Users } from "lucide-react";

export default function EventsPage() {
  
  // ==============================
  // 🔥 ONGOING EVENTS (Abhi Chal Rahe)
  // ==============================
  const ongoing = [
    {
      id: 1,
      title: "Full Stack Web Development Bootcamp",
      date: "1 May - 15 May 2026",
      time: "9:00 AM - 12:00 PM",
      location: "Lab 2, Hyderabad Campus",
      seats: "15/30 Seats Filled",
      image: "/images/mern.png",
      status: "Ongoing",
    },
    {
      id: 2,
      title: "Python for Data Science",
      date: "15 April - 14 May 2026",
      time: "2:00 PM - 5:00 PM",
      location: "Online (Zoom)",
      seats: "22/25 Seats Filled",
      image: "/images/ai1.png",
      status: "Ongoing",
    },
    {
      id: 3,
      title: "Networking & CCNA Training",
      date: "1 May - 7 May 2026",
      time: "10:00 AM - 1:00 PM",
      location: "Lab 4, Hyderabad Campus",
      seats: "10/20 Seats Filled",
      image: "/images/net.png",
      status: "Ongoing",
    },
  ];

  // ==============================
  // UPCOMING EVENTS (Aane Wale)
  // ==============================
  const upcoming = [
    {
      id: 4,
      title: "AI & Machine Learning Workshop",
      date: "10 July 2026",
      time: "10:00 AM - 4:00 PM",
      location: "Auditorium, Hyderabad Campus",
      seats: "50 Seats Available",
      image: "/images/ai1.png",
      badge: "Early Bird",
    },
    {
      id: 5,
      title: "Cyber Security Hands-on Training",
      date: "25 July 2026",
      time: "9:00 AM - 3:00 PM",
      location: "Online (Microsoft Teams)",
      seats: "35 Seats Available",
      image: "/images/cyber.png",
      badge: "Free Entry",
    },
    {
      id: 6,
      title: "Mobile App Development with React Native",
      date: "5 August 2026",
      time: "11:00 AM - 5:00 PM",
      location: "Lab 1, Hyderabad Campus",
      seats: "20 Seats Available",
      image: "/images/app.png",
      badge: "New",
    },
    {
      id: 7,
      title: "Office Automation & Advanced Excel",
      date: "20 August 2026",
      time: "2:00 PM - 6:00 PM",
      location: "Lab 3, Hyderabad Campus",
      seats: "40 Seats Available",
      image: "/images/office.png",
      badge: "Popular",
    },
  ];

  // ==============================
  // PAST EVENTS (Ho Chuke)
  // ==============================
  const past = [
    {
      id: 8,
      title: "Graphic Designing Masterclass",
      date: "5 May 2026",
      location: "Hyderabad Campus",
      attendees: "45 Participants",
      image: "/images/CIT.png",
      feedback: "⭐ 4.8/5",
    },
    {
      id: 9,
      title: "Ethical Hacking Seminar",
      date: "15 April 2026",
      location: "Online",
      attendees: "120 Participants",
      image: "/images/cyber.png",
      feedback: "⭐ 4.9/5",
    },
    {
      id: 10,
      title: "IoT & Smart Devices Workshop",
      date: "28 March 2026",
      location: "Lab 2, Hyderabad Campus",
      attendees: "30 Participants",
      image: "/images/net.png",
      feedback: "⭐ 4.7/5",
    },
    {
      id: 11,
      title: "Database Management with SQL",
      date: "10 March 2026",
      location: "Online (Zoom)",
      attendees: "60 Participants",
      image: "/images/office.png",
      feedback: "⭐ 4.6/5",
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* ============================== */}
      {/* HERO SECTION */}
      {/* ============================== */}
      <div className="relative h-[55vh] w-full">
        <img
          src="/images/mern.png"
          alt="Events Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60 flex flex-col justify-center items-center text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Events & <span className="text-green-400">Workshops</span>
          </h1>
          <p className="text-lg text-gray-200 max-w-xl">
            Join our professional IT events and grow your career 🚀
          </p>
        </div>
      </div>

      {/* ============================== */}
      {/* ONGOING EVENTS */}
      {/* ============================== */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-8">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Ongoing Events
          </h2>
        </div>

        {/* Ongoing Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ongoing.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden border-l-4 border-green-500"
            >
              {/* Image */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover hover:scale-110 transition duration-500"
                />
                {/* Status Badge */}
                <span className="absolute top-3 right-3 bg-green-500 text-white text-xs px-3 py-1 rounded-full font-semibold animate-pulse">
                  {event.status}
                </span>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-bold text-lg text-gray-900 mb-3">
                  {event.title}
                </h3>

                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <Calendar size={16} className="text-green-600" />
                    {event.date}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <Clock size={16} className="text-green-600" />
                    {event.time}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <MapPin size={16} className="text-green-600" />
                    {event.location}
                  </p>
                </div>

                {/* Seats Info + Button */}
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Users size={14} />
                    {event.seats}
                  </p>
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition">
                    Join Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ============================== */}
      {/* UPCOMING EVENTS */}
      {/* ============================== */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-8">
          <Calendar size={28} className="text-blue-600" />
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Upcoming Events
          </h2>
        </div>

        {/* Upcoming Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {upcoming.map((event) => (
            <div
              key={event.id}
              className="bg-white shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 overflow-hidden"
            >
              {/* Image */}
              <div className="relative h-40 overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover hover:scale-110 transition duration-500"
                />
                {/* Badge */}
                <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-semibold">
                  {event.badge}
                </span>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-2 text-sm">
                  {event.title}
                </h3>

                <div className="space-y-1.5 mb-4">
                  <p className="text-xs text-gray-600 flex items-center gap-1.5">
                    <Calendar size={13} className="text-blue-600" />
                    {event.date}
                  </p>
                  <p className="text-xs text-gray-600 flex items-center gap-1.5">
                    <Clock size={13} className="text-blue-600" />
                    {event.time}
                  </p>
                  <p className="text-xs text-gray-600 flex items-center gap-1.5">
                    <MapPin size={13} className="text-blue-600" />
                    {event.location}
                  </p>
                </div>

                {/* Seats + Button */}
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">{event.seats}</p>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-blue-700 transition">
                    Register
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ============================== */}
      {/* PAST EVENTS */}
      {/* ============================== */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Past Events
          </h2>
        </div>

        {/* Past Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {past.map((event) => (
            <div
              key={event.id}
              className="bg-gray-100 overflow-hidden opacity-80 hover:opacity-100 transition"
            >
              {/* Image */}
              <div className="relative h-36 overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover grayscale-[30%]"
                />
                {/* Feedback Badge */}
                <span className="absolute top-3 right-3 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                  {event.feedback}
                </span>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-bold text-gray-700 text-sm mb-2">
                  {event.title}
                </h3>

                <div className="space-y-1.5">
                  <p className="text-xs text-gray-500 flex items-center gap-1.5">
                    <Calendar size={13} />
                    {event.date}
                  </p>
                  <p className="text-xs text-gray-500 flex items-center gap-1.5">
                    <MapPin size={13} />
                    {event.location}
                  </p>
                  <p className="text-xs text-gray-500 flex items-center gap-1.5">
                    <Users size={13} />
                    {event.attendees}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}