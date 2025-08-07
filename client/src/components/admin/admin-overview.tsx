import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getQueryFn } from "@/lib/queryClient";

interface StatsData {
  totalUsers: number;
  totalConversations: number;
  activeModels: number;
  uptime: string;
  recentActivity: Array<{
    type: string;
    message: string;
    timestamp: string;
    icon: string;
    color: string;
  }>;
}

export default function AdminOverview() {
  const { data: stats, isLoading } = useQuery<StatsData>({
    queryKey: ['/api/admin/stats'],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  if (isLoading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Dashboard Overview</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const defaultStats: StatsData = {
    totalUsers: 0,
    totalConversations: 0,
    activeModels: 7,
    uptime: '99.9%',
    recentActivity: []
  };

  const actualStats = stats || defaultStats;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Dashboard Overview</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="total-users">
                  {actualStats.totalUsers.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <i className="fas fa-users text-blue-600 dark:text-blue-400"></i>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Conversations</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="total-conversations">
                  {actualStats.totalConversations.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <i className="fas fa-comments text-green-600 dark:text-green-400"></i>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Models</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="active-models">
                  {actualStats.activeModels}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <i className="fas fa-brain text-purple-600 dark:text-purple-400"></i>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Uptime</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="uptime">
                  {actualStats.uptime}
                </p>
              </div>
              <div className="w-12 h-12 bg-flamingo-100 dark:bg-flamingo-900/30 rounded-lg flex items-center justify-center">
                <i className="fas fa-heartbeat text-flamingo-600 dark:text-flamingo-400"></i>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {actualStats.recentActivity.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                <i className="fas fa-clock text-gray-400 dark:text-gray-500"></i>
              </div>
              <p className="text-gray-500 dark:text-gray-400">No recent activity</p>
            </div>
          ) : (
            <div className="space-y-4">
              {actualStats.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-4" data-testid={`activity-${index}`}>
                  <div className={`w-10 h-10 ${activity.color} rounded-lg flex items-center justify-center`}>
                    <i className={`${activity.icon} text-white`}></i>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.message}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{activity.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
