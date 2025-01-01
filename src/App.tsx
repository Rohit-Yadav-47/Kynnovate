import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import UserProfilePage from './pages/UserProfilePage';
import CommunityPage from './pages/CommunityPage';
import AssistantPage from './pages/AssistantPage';
import CommunitiesPage from './pages/CommunitiesPage'; // Add this new import

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:id" element={<EventDetailPage />} />
          <Route path="/profile" element={<UserProfilePage />} /> {/* Remove userId requirement */}
          <Route path="/profile/:userId" element={<UserProfilePage />} />
          <Route path="/community" element={<CommunitiesPage />} /> {/* Add communities list route */}
          <Route path="/community/:communityId" element={<CommunityPage />} />
        </Routes>
        <AssistantPage />
      </Layout>
    </Router>
  );
}

export default App;