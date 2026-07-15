import { Search, Bell, Settings } from 'lucide-react';

export default function Header() {
  return (
    <header className="header">
      <div className="search-bar">
        <Search size={18} className="text-muted" />
        <input type="text" placeholder="Search account, transaction ID, or entity..." />
      </div>
      
      <div className="header-actions">
        <Bell size={20} className="header-icon" />
        <Settings size={20} className="header-icon" />
        
        <div className="user-profile">
          <span className="text-sm font-semibold">Analyst-0492</span>
          <img src="https://i.pravatar.cc/150?img=11" alt="User" className="user-avatar" />
        </div>
      </div>
    </header>
  );
}
