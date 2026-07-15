import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export default function DashboardLayout({ children }) {
  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <Header />
        <div className="dashboard-scroll-area">
          {children}
        </div>
      </main>
    </div>
  );
}
