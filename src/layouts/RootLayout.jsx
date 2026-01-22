import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function RootLayout() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  const isHomePage = location.pathname === '/';

  return (
    <div className={`min-h-screen ${isAuthPage ? '' : 'bg-background-light'}`}>
      <Navbar />
      <main className={isHomePage || isAuthPage ? '' : 'pt-20 lg:pt-24'}>
        <Outlet />
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
}

export default RootLayout;
