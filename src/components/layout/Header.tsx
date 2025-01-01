// Header.tsx

import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  Calendar,
  Search,
  MessageSquare,
  Menu,
  X,
  User,
  Bell,
  Sun,
  Moon,
} from 'lucide-react';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const notificationsDropdownRef = useRef<HTMLDivElement>(null);

  const navigationLinks = [
    { name: 'Home', to: '/' },
    { name: 'Events', to: '/events' },
    { name: 'Community', to: '/community' },
    { name: 'Profile', to: '/profile' },
  ];

  // Toggle Dark Mode and persist preference
  const handleDarkModeToggle = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // Initialize Dark Mode based on user's preference or system settings
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else if (savedTheme === 'light') {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    } else {
      // If no preference, use system setting
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setIsDarkMode(true);
        document.documentElement.classList.add('dark');
      }
    }
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileDropdownOpen(false);
      }
      if (
        notificationsDropdownRef.current &&
        !notificationsDropdownRef.current.contains(event.target as Node)
      ) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Example user data (replace with actual user data)
  const user = {
    name: 'John Doe',
    avatar: 'https://via.placeholder.com/150',
  };

  // Example notifications (replace with actual notifications)
  const notifications = [
    { id: 1, message: 'New event: Tech Meetup' },
    { id: 2, message: 'You have a new friend request' },
    { id: 3, message: 'Event reminder: Health Workshop tomorrow' },
  ];

  return (
    <header className="bg-white dark:bg-gray-900 shadow-md fixed w-full z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-500" />
            <span className="font-extrabold text-xl text-gray-800 dark:text-white">EventHub</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigationLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.to}
                end
                className={({ isActive }) =>
                  'relative text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors duration-200' +
                  (isActive ? ' text-blue-600 font-semibold' : '')
                }
              >
                {link.name}
                {/* Underline for active link */}
                {({ isActive }) => (
                  <span
                    className={`absolute left-0 -bottom-1 w-full h-0.5 bg-blue-600 transition-opacity duration-300 ${
                      isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}
                  ></span>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Action Icons and Profile */}
          <div className="flex items-center space-x-4">
            {/* Search Icon (Hidden on Mobile) */}
            <Link
              to="/search"
              className="hidden md:block text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors duration-200 relative"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </Link>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors duration-200 relative focus:outline-none"
                aria-haspopup="true"
                aria-expanded={isNotificationsOpen}
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {/* Notification Badge */}
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                    {notifications.length}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {isNotificationsOpen && (
                <div
                  ref={notificationsDropdownRef}
                  className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg py-2 z-50"
                >
                  <h4 className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200">Notifications</h4>
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <Link
                          key={notification.id}
                          to="#"
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => setIsNotificationsOpen(false)}
                        >
                          {notification.message}
                        </Link>
                      ))
                    ) : (
                      <p className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">No new notifications.</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Assistant Icon */}
            <Link
              to="/assistant"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors duration-200"
              aria-label="Assistant"
            >
              <MessageSquare className="w-5 h-5" />
            </Link>

            {/* Dark Mode Toggle */}
            <button
              onClick={handleDarkModeToggle}
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors duration-200 focus:outline-none"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* User Profile */}
            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors duration-200 focus:outline-none"
                aria-haspopup="true"
                aria-expanded={isProfileDropdownOpen}
                aria-label="User Menu"
              >
                <img
                  src={user.avatar || 'https://via.placeholder.com/150'}
                  alt={`${user.name}'s avatar`}
                  className="w-8 h-8 rounded-full"
                />
              </button>

              {/* Profile Dropdown */}
              {isProfileDropdownOpen && (
                <div
                  ref={profileDropdownRef}
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-2 z-50"
                >
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  >
                    Your Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  >
                    Settings
                  </Link>
                  <Link
                    to="/logout"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  >
                    Logout
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors duration-200 focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 shadow-md">
          <nav className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            {navigationLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.to}
                end
                className={({ isActive }) =>
                  isActive
                    ? 'block px-3 py-2 rounded-md text-base font-medium text-blue-600 bg-gray-200 dark:bg-gray-800'
                    : 'block px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200'
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </NavLink>
            ))}

            {/* Search Bar (Visible on Mobile) */}
            <div className="mt-4">
              <div className="relative text-gray-600 dark:text-gray-300">
                <input
                  type="search"
                  name="search"
                  placeholder="Search..."
                  className="bg-gray-100 dark:bg-gray-800 w-full h-10 px-5 pr-10 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button type="submit" className="absolute right-0 top-0 mt-3 mr-4">
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
