import { Button } from "@/components/ui/button";

interface AdminSidebarProps {
  activePanel: string;
  onPanelChange: (panel: string) => void;
}

export default function AdminSidebar({ activePanel, onPanelChange }: AdminSidebarProps) {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: 'fas fa-home' },
    { id: 'users', label: 'Users', icon: 'fas fa-users' },
    { id: 'stats', label: 'Statistics', icon: 'fas fa-chart-bar' },
    { id: 'settings', label: 'Settings', icon: 'fas fa-cog' },
    { id: 'env', label: 'Environment', icon: 'fas fa-code' },
  ];

  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Admin Panel</h2>
      </div>
      
      <nav className="mt-6">
        {menuItems.map((item) => (
          <Button
            key={item.id}
            data-testid={`admin-nav-${item.id}`}
            variant="ghost"
            className={`w-full justify-start px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
              activePanel === item.id
                ? 'bg-flamingo-50 dark:bg-flamingo-900/20 text-flamingo-700 dark:text-flamingo-300 border-r-2 border-flamingo-500'
                : ''
            }`}
            onClick={() => onPanelChange(item.id)}
          >
            <i className={`${item.icon} mr-3`}></i>
            {item.label}
          </Button>
        ))}
      </nav>
    </div>
  );
}
