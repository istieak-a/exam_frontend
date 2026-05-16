import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RootLayout from './layouts/RootLayout';
import DashboardLayout from './layouts/DashboardLayout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import NotFound from './pages/NotFound';
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
import './App.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <Signup /> },
      { path: '*', element: <NotFound /> },
    ],
  },
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'create-exam', element: <CreateExam /> },
      { path: 'exams', element: <ExamList /> },
      { path: 'exam/:id', element: <ExamDetails /> },
      { path: 'exam/:id/submissions', element: <Submissions /> },
      { path: 'submissions', element: <Submissions /> },
      { path: 'grade/:id', element: <GradeSubmission /> },
      { path: 'available-exams', element: <AvailableExams /> },
      { path: 'my-exams', element: <MyExams /> },
      { path: 'take-exam/:id', element: <TakeExam /> },
      { path: 'exam-result/:id', element: <ExamResult /> },
      { path: 'chat', element: <Chat /> },
      { path: 'profile', element: <Profile /> },
      { path: 'support', element: <Support /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
