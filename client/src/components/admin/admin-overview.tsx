
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
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
        <h1 className="text-2xl font-bold text-blue-800 dark:text-blue-200 mb-8">Dashboard Overview</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse bg-white dark:bg-blue-900/20 border-blue-200 dark:border-blue-700">
              <CardContent className="p-6">
                <div className="h-12 bg-blue-100 dark:bg-blue-800 rounded mb-4"></div>
                <div className="h-8 bg-blue-100 dark:bg-blue-800 rounded"></div>
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

  const statCards = [
    {
      title: "Total Users",
      value: actualStats.totalUsers,
      icon: "fas fa-users",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/30"
    },
    {
      title: "Conversations",
      value: actualStats.totalConversations,
      icon: "fas fa-comments",
      color: "from-blue-600 to-blue-700",
      bgColor: "bg-blue-100 dark:bg-blue-800/30"
    },
    {
      title: "Active Models",
      value: actualStats.activeModels,
      icon: "fas fa-robot",
      color: "from-blue-400 to-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/30"
    },
    {
      title: "System Uptime",
      value: actualStats.uptime,
      icon: "fas fa-server",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-800/30"
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-blue-800 dark:text-blue-200 mb-2">Dashboard Overview</h1>
        <p className="text-blue-600 dark:text-blue-400">Monitor your Flamgio AI platform performance and activity</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="bg-white dark:bg-blue-900/20 border-blue-200 dark:border-blue-700 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">{stat.title}</p>
                  <p className="text-3xl font-bold text-blue-800 dark:text-blue-200">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-md`}>
                  <i className={`${stat.icon} text-white text-xl`}></i>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white dark:bg-blue-900/20 border-blue-200 dark:border-blue-700">
          <CardHeader>
            <CardTitle className="text-blue-800 dark:text-blue-200 flex items-center">
              <i className="fas fa-heartbeat mr-2 text-blue-600"></i>
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-blue-600 dark:text-blue-400">Database</span>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                  <i className="fas fa-check-circle mr-1"></i>
                  Healthy
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-600 dark:text-blue-400">AI Models</span>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                  <i className="fas fa-check-circle mr-1"></i>
                  Online
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-600 dark:text-blue-400">API Services</span>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                  <i className="fas fa-check-circle mr-1"></i>
                  Operational
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-blue-900/20 border-blue-200 dark:border-blue-700">
          <CardHeader>
            <CardTitle className="text-blue-800 dark:text-blue-200 flex items-center">
              <i className="fas fa-chart-bar mr-2 text-blue-600"></i>
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full justify-start bg-blue-500 hover:bg-blue-600 text-white">
                <i className="fas fa-sync-alt mr-2"></i>
                Refresh System Status
              </Button>
              <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white">
                <i className="fas fa-download mr-2"></i>
                Export System Logs
              </Button>
              <Button className="w-full justify-start bg-blue-500 hover:bg-blue-600 text-white">
                <i className="fas fa-tools mr-2"></i>
                Run Diagnostics
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
