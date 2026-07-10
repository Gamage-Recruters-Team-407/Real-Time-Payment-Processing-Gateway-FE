import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const userMenuItems = [
  { name: 'Settlement', icon: '💳' },
  { name: 'Notifications', icon: '🔔' },
  { name: 'Settings', icon: '⚙️' },
];

const adminMenuItems = [
  { name: 'Account Management', icon: '👤' },
  { name: 'User Management', icon: '👥' },
  { name: 'Fraud Detection', icon: '🛡️' },
  { name: 'Notifications', icon: '🔔' },
  { name: 'Settings', icon: '⚙️' },
];

const Sidebar = () => {
  const { isAdmin } = useAuth();
  const menuItems = isAdmin ? adminMenuItems : userMenuItems;
  const [activeItem, setActiveItem] = useState('Notifications');

  return (
    <div className="w-64 min-h-screen bg-white border-r border-gray-100 flex flex-col justify-between py-6 px-4">
      <div>
        {/* Logo */}
        <div className="mb-1">
          <h1 className="text-[#0F1117] text-xl font-bold">
            Gamage <span className="text-[#10B981]">Pay</span>
          </h1>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
            <span className="text-gray-500 text-xs">System Active</span>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="mt-8 flex flex-col gap-1">
          {menuItems.map((item) => (
            <div
              key={item.name}
              onClick={() => setActiveItem(item.name)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                item.name === activeItem
                  ? 'bg-[#10B981] text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span>{item.icon}</span>
              <span className="text-sm">{item.name}</span>
            </div>
          ))}
        </nav>
      </div>

      {/* Bottom Button */}
      <button className="bg-[#0F1117] text-white text-sm font-medium py-2.5 rounded-lg hover:bg-gray-800 transition-colors">
        + New Analysis
      </button>
    </div>
  );
};

export default Sidebar;