import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function RootLayout() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  const isHomePage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-canvas text-body">
      <Navbar />
      <main className={isHomePage || isAuthPage ? '' : 'pt-16'}>
        <Outlet />
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
}

export default RootLayout;
