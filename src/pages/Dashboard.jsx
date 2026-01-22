import { useAuth } from '../context/AuthContext';
import TeacherDashboard from './dashboard/TeacherDashboard';
import StudentDashboard from './dashboard/StudentDashboard';

function Dashboard() {
  const { isTeacher } = useAuth();

  return isTeacher ? <TeacherDashboard /> : <StudentDashboard />;
}

export default Dashboard;
