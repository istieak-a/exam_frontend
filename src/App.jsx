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
  const { isAuthenticated } = useAuth();
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

// Placeholder components for routes we'll build later
const CreateExam = () => <div className="text-center py-12"><h1 className="text-2xl font-bold">Create Exam (Coming Soon)</h1></div>;
const ExamList = () => <div className="text-center py-12"><h1 className="text-2xl font-bold">Exam List (Coming Soon)</h1></div>;
const ExamDetails = () => <div className="text-center py-12"><h1 className="text-2xl font-bold">Exam Details (Coming Soon)</h1></div>;
const Submissions = () => <div className="text-center py-12"><h1 className="text-2xl font-bold">Submissions (Coming Soon)</h1></div>;
const GradeSubmission = () => <div className="text-center py-12"><h1 className="text-2xl font-bold">Grade Submission (Coming Soon)</h1></div>;
const Grading = () => <div className="text-center py-12"><h1 className="text-2xl font-bold">Grading (Coming Soon)</h1></div>;
const Analytics = () => <div className="text-center py-12"><h1 className="text-2xl font-bold">Analytics (Coming Soon)</h1></div>;

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
      {
        path: 'grading',
        element: <Grading />,
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
        path: 'analytics',
        element: <Analytics />,
      },
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
