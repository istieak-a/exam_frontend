import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import RootLayout from './layouts/RootLayout';
import DashboardLayout from './layouts/DashboardLayout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import NotFound from './pages/NotFound';
import './App.css';

// Protected Route Component
function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Show loading spinner while authentication state is being determined
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  // Double-check localStorage as fallback
  if (!isAuthenticated) {
    const savedUser = localStorage.getItem('examhub_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        if (parsedUser && parsedUser.id) {
          // User exists in localStorage, show loading while auth context catches up
          return (
            <div className="min-h-screen flex items-center justify-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
          );
        }
      } catch (error) {
        console.error('Error parsing localStorage user:', error);
        localStorage.removeItem('examhub_user');
      }
    }
  }
  
  // Only redirect to login if definitely not authenticated
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

// Import dashboard pages
import AvailableExams from './pages/dashboard/AvailableExams';
import MyExams from './pages/dashboard/MyExams';
import Chat from './pages/dashboard/Chat';
import Profile from './pages/dashboard/Profile';
import Support from './pages/dashboard/Support';
import TakeExam from './pages/dashboard/TakeExam';
import ExamResult from './pages/dashboard/ExamResult';
import CreateExam from './pages/dashboard/CreateExam';
import ExamList from './pages/dashboard/ExamList';
import Submissions from './pages/dashboard/Submissions';
import ExamDetails from './pages/dashboard/ExamDetails';
import GradeSubmission from './pages/dashboard/GradeSubmission';

// Create router using the latest createBrowserRouter API
const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'signup',
        element: <Signup />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      // Teacher Routes
      {
        path: 'create-exam',
        element: <CreateExam />,
      },
      {
        path: 'exams',
        element: <ExamList />,
      },
      {
        path: 'exam/:id',
        element: <ExamDetails />,
      },
      {
        path: 'exam/:id/submissions',
        element: <Submissions />,
      },
      {
        path: 'submissions',
        element: <Submissions />,
      },
      {
        path: 'grade/:id',
        element: <GradeSubmission />,
      },
      // Student Routes
      {
        path: 'available-exams',
        element: <AvailableExams />,
      },
      {
        path: 'my-exams',
        element: <MyExams />,
      },
      {
        path: 'take-exam/:id',
        element: <TakeExam />,
      },
      {
        path: 'exam-result/:id',
        element: <ExamResult />,
      },
      // Shared Routes
      {
        path: 'chat',
        element: <Chat />,
      },
      {
        path: 'profile',
        element: <Profile />,
      },
      {
        path: 'support',
        element: <Support />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
