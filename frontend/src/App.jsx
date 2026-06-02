import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import Header from './components/Header';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CreateUrl from './pages/CreateUrl';
import MyUrls from './pages/MyUrls';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import './styles/index.css';

// Protected Route Component
function ProtectedRoute({ children }) {
  const { token } = useAuthStore();
  return token ? children : <Navigate to="/login" />;
}

// Layout wrapper with footer
function AppLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  const { token } = useAuthStore();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        <Routes location={location}>
          {/* Public Routes */}
          <Route path="/" element={token ? <Navigate to="/dashboard" /> : <Landing />} />
          <Route path="/login" element={token ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/signup" element={token ? <Navigate to="/dashboard" /> : <Signup />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <CreateUrl />
              </ProtectedRoute>
            }
          />
          <Route
            path="/urls"
            element={
              <ProtectedRoute>
                <MyUrls />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics/:urlId"
            element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  const { token } = useAuthStore();

  return (
    <Router>
      <Toaster position="top-right" />
      {token && <Header />}
      <AppLayout>
        <AnimatedRoutes />
      </AppLayout>
    </Router>
  );
}

export default App;
