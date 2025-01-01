import React, { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import {
  Calendar,
  MapPin,
  Users,
  Layers,
  Mail,
  Search,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import Slider from 'react-slick'; // Make sure to install react-slick and slick-carousel

// Local EVENTS Data
const EVENTS = [
  {
    id: 1,
    name: 'Jazz Evening at Marina Bay',
    location: 'Marina Beach',
    type: 'Music',
    date: 'Saturday',
    time: '7 PM',
    description: 'Immerse yourself in soothing jazz tunes by the waves.',
    image_url: 'https://picsum.photos/600/400/?random=101',
  },
  {
    id: 2,
    name: 'Art Fiesta: Chennai Colors',
    location: "Cholamandal Artists' Village",
    type: 'Art',
    date: 'Friday',
    time: '5 PM',
    description: "Discover vibrant art inspired by Chennai's culture.",
    image_url: 'https://picsum.photos/600/400/?random=102',
  },
  {
    id: 3,
    name: 'Tech Innovators Summit',
    location: 'Silicon Valley',
    type: 'Technology',
    date: 'Sunday',
    time: '10 AM',
    description: 'Join industry leaders to explore the future of technology.',
    image_url: 'https://picsum.photos/600/400/?random=103',
  },
  // Add more events as needed
];

// Helper Component: Loading Spinner
function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-10">
      <svg
        className="animate-spin h-10 w-10 text-blue-600"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-label="Loading"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8H4z"
        ></path>
      </svg>
    </div>
  );
}

// Helper Component: Error Message
function ErrorMessage({ message }) {
  return (
    <div className="flex justify-center items-center py-10">
      <p className="text-red-500 text-lg">{message}</p>
    </div>
  );
}

// HeroSection Component
function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    console.log(`Searching for: ${searchQuery}`);
    // Implement search functionality here
  };

  return (
    <section
      className="relative h-screen bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage:
          'url(https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg?cs=srgb&dl=pexels-wolfgang-1002140-2747449.jpg&fm=jpg)'
      }}
    >
      <div className="absolute inset-0 bg-black opacity-60"></div>
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center text-white">
        <h1 
          data-aos="fade-down"
          data-aos-delay="200"
          className="text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-lg"
        >
          Discover Amazing Events Near You
        </h1>
        <p 
          data-aos="fade-up"
          data-aos-delay="400"
          className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto drop-shadow-lg"
        >
          Join thousands of people discovering unique events every day
        </p>
        <form 
          data-aos="zoom-in"
          data-aos-delay="600"
          onSubmit={handleSearch} 
          className="flex justify-center"
        >
          <input
            type="text"
            placeholder="Search for events..."
            className="px-6 py-3 rounded-l-full border-t mr-0 border-b border-l border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search Events"
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-r-full bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>
        </form>
      </div>
    </section>
  );
}

// FeaturedEvents Component
function FeaturedEvents() {
  const [featuredEvents, setFeaturedEvents] = useState([]);

  useEffect(() => {
    // Simulate data fetching
    const fetchFeaturedEvents = async () => {
      try {
        // Simulate loading delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // Filter events with id less than 4
        const featured = EVENTS.filter((event) => event.id < 4);
        setFeaturedEvents(featured);
      } catch (error) {
        console.error('Error fetching featured events:', error);
      }
    };

    fetchFeaturedEvents();
  }, []);

  if (!featuredEvents.length) {
    return <LoadingSpinner />;
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-16 bg-gray-50">
      <h2 
        data-aos="fade-up"
        className="text-4xl font-bold text-center mb-12"
      >
        Featured Events
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {featuredEvents.map((event, index) => (
          <div
            key={event.id}
            data-aos="fade-up"
            data-aos-delay={index * 100}
            className="bg-white shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300"
          >
            <img
              src={event.image_url}
              alt={event.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{event.name}</h3>
              <p className="text-gray-600 flex items-center mb-1">
                <Calendar className="w-5 h-5 mr-2 text-blue-500" />
                {event.date} at {event.time}
              </p>
              <p className="text-gray-600 flex items-center mb-4">
                <MapPin className="w-5 h-5 mr-2 text-red-500" />
                {event.location}
              </p>
              <p className="text-gray-700 mb-4">{event.description}</p>
              <button className="flex items-center text-blue-600 hover:underline">
                Learn More <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// CategoryGrid Component
function CategoryGrid() {
  const categories = [
    { id: 1, name: 'Music', icon: '🎵' },
    { id: 2, name: 'Art', icon: '🎨' },
    { id: 3, name: 'Technology', icon: '💻' },
    { id: 4, name: 'Sports', icon: '🏅' },
    { id: 5, name: 'Food', icon: '🍔' },
    { id: 6, name: 'Education', icon: '📚' },
  ];

  const handleCategoryClick = (categoryName) => {
    console.log(`Category ${categoryName} clicked.`);
    // Implement category filtering or navigation here
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <h2 
        data-aos="fade-up"
        className="text-4xl font-bold text-center mb-12"
      >
        Browse by Category
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
        {categories.map((category, index) => (
          <div
            key={category.id}
            data-aos="flip-left"
            data-aos-delay={index * 100}
            className="flex flex-col items-center bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 cursor-pointer"
            role="button"
            tabIndex={0}
            aria-label={`Category: ${category.name}`}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleCategoryClick(category.name);
              }
            }}
            onClick={() => handleCategoryClick(category.name)}
          >
            <div className="text-4xl mb-2">{category.icon}</div>
            <h4 className="text-lg font-medium">{category.name}</h4>
          </div>
        ))}
      </div>
    </section>
  );
}

// Custom Arrow Components for Slider
function SampleNextArrow(props) {
  const { onClick } = props;
  return (
    <div
      className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-2 rounded-full cursor-pointer z-10"
      onClick={onClick}
      aria-label="Next Slide"
    >
      <ChevronRight />
    </div>
  );
}

function SamplePrevArrow(props) {
  const { onClick } = props;
  return (
    <div
      className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-2 rounded-full cursor-pointer z-10"
      onClick={onClick}
      aria-label="Previous Slide"
    >
      <ChevronLeft />
    </div>
  );
}

// LatestNews Component
function LatestNews() {
  const news = [
    {
      id: 1,
      title: 'New Music Festival Announced',
      date: 'October 5, 2024',
      summary: 'Join us for the biggest music festival of the year featuring top artists.',
      image: 'https://picsum.photos/600/400/?random=201',
    },
    {
      id: 2,
      title: 'Art Exhibition Opens Downtown',
      date: 'September 20, 2024',
      summary: 'Explore contemporary art from local and international artists.',
      image: 'https://picsum.photos/600/400/?random=202',
    },
    {
      id: 3,
      title: 'Tech Conference Goes Virtual',
      date: 'November 15, 2024',
      summary: 'Attend our virtual tech conference from the comfort of your home.',
      image: 'https://picsum.photos/600/400/?random=203',
    },
    // Add more news articles as needed
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-16 bg-white">
      <h2 
        data-aos="fade-up"
        className="text-4xl font-bold text-center mb-12"
      >
        Latest News
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {news.map((article, index) => (
          <div
            key={article.id}
            data-aos="fade-up"
            data-aos-delay={index * 200}
            className="shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 flex flex-col"
          >
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="text-xl font-semibold mb-2">{article.title}</h3>
              <p className="text-gray-500 text-sm mb-4">{article.date}</p>
              <p className="text-gray-700 mb-4 flex-1">{article.summary}</p>
              <button className="text-blue-600 hover:underline mt-auto">
                Read More
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// Testimonials Component
function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: 'Alice Johnson',
      role: 'Music Enthusiast',
      comment:
        'Attending events through this platform has been amazing! The variety is incredible.',
      avatar: 'https://i.pravatar.cc/150?img=1',
    },
    {
      id: 2,
      name: 'Bob Smith',
      role: 'Tech Developer',
      comment:
        'The Tech Innovators Summit was a game-changer for my career. Highly recommended!',
      avatar: 'https://i.pravatar.cc/150?img=2',
    },
    {
      id: 3,
      name: 'Carol Lee',
      role: 'Art Lover',
      comment:
        'Art Fiesta was a vibrant and inspiring experience. Loved every moment!',
      avatar: 'https://i.pravatar.cc/150?img=3',
    },
    // Add more testimonials as needed
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-16 bg-gray-50">
      <h2 
        data-aos="fade-up"
        className="text-4xl font-bold text-center mb-12"
      >
        What People Say
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <div
            key={testimonial.id}
            data-aos="zoom-in"
            data-aos-delay={index * 200}
            className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center"
          >
            <img
              src={testimonial.avatar}
              alt={testimonial.name}
              className="w-20 h-20 rounded-full mb-4"
            />
            <h3 className="text-xl font-semibold">{testimonial.name}</h3>
            <p className="text-gray-500 text-sm mb-4">{testimonial.role}</p>
            <p className="text-gray-700">"{testimonial.comment}"</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// NewsletterSignup Component
function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSignup = (e) => {
    e.preventDefault();
    // Handle newsletter signup logic here
    console.log(`Subscribed with email: ${email}`);
    setSubmitted(true);
    setEmail('');
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-16 bg-blue-600 text-center text-white">
      <h2 
        data-aos="fade-up"
        className="text-4xl font-bold mb-6"
      >
        Stay Updated!
      </h2>
      <p 
        data-aos="fade-up"
        data-aos-delay="200"
        className="text-lg mb-8"
      >
        Subscribe to our newsletter to receive the latest updates and exclusive offers.
      </p>
      <div 
        data-aos="fade-up"
        data-aos-delay="400"
      >
        {!submitted ? (
          <form onSubmit={handleSignup} className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-6 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-label="Email Address"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-white text-blue-600 rounded-full hover:bg-gray-200 transition-colors duration-300"
            >
              Subscribe
            </button>
          </form>
        ) : (
          <p className="text-green-300 text-lg">Thank you for subscribing!</p>
        )}
      </div>
    </section>
  );
}

// HomePage Component
export default function HomePage() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <div className="space-y-24">
      <div id="hero">
        <HeroSection />
      </div>
      <div id="featured">
        <FeaturedEvents />
      </div>
      <div id="categories">
        <CategoryGrid />
      </div>
    
      <div id="news">
        <LatestNews />
      </div>
      <div id="testimonials">
        <Testimonials />
      </div>
      <div id="newsletter">
        <NewsletterSignup />
      </div>
    </div>
  );
}
