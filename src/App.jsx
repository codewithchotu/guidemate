import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AppProvider } from "./context/AppContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import LandingPage from "./pages/LandingPage";
import TravelerHome from "./pages/TravelerHome";
import GuideOnboarding from "./pages/GuideOnboarding";
import SupervisorDash from "./pages/SupervisorDash";
import Home from "./pages/Home";
import Planner from "./pages/Planner";
import Marketplace from "./pages/Marketplace";
import BuddyProfile from "./pages/BuddyProfile";
import Results from "./pages/Results";
import SafetyCenter from "./pages/SafetyCenter";
import EmergencySOS from "./pages/EmergencySOS";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import FeaturesPage from "./pages/FeaturesPage";
import GuideDashboard from "./pages/GuideDashboard";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <BrowserRouter>
          <Navbar />
          <main style={{ minHeight: '100vh' }}>
            <Routes>
              {/* Landing & Main Pages */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/features" element={<FeaturesPage />} />
              <Route path="/contact" element={<ContactPage />} />
              
              {/* Traveler Routes */}
              <Route path="/traveler/home" element={<TravelerHome />} />
              
              {/* Guide Routes (Protected) */}
              <Route path="/guide/onboarding" element={
                <ProtectedRoute allowedRoles={['guide', 'traveler']}>
                  <GuideOnboarding />
                </ProtectedRoute>
              } />
              <Route path="/guide/dashboard" element={
                <ProtectedRoute allowedRoles={['guide']}>
                  <GuideDashboard />
                </ProtectedRoute>
              } />
              
              {/* Supervisor Routes (Protected) */}
              <Route path="/supervisor/dashboard" element={
                <ProtectedRoute allowedRoles={['supervisor']}>
                  <SupervisorDash />
                </ProtectedRoute>
              } />
              
              {/* Legacy Routes (backward compatibility) */}
              <Route path="/home" element={<Home />} />
              <Route path="/planner" element={<Planner />} />
              <Route path="/buddies" element={<Marketplace />} />
              <Route path="/buddy/:id" element={<BuddyProfile />} />
              <Route path="/results" element={<Results />} />
              <Route path="/safety" element={<SafetyCenter />} />
              <Route path="/sos" element={<EmergencySOS />} />
            </Routes>
          </main>
          <Footer />
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;