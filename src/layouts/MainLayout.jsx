import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';

function MainLayout() {
  return (
    <div className="app-shell">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
