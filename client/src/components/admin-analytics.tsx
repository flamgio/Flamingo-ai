import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Users, MessageSquare, Clock, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ParallaxAnimation } from './parallax-animation';

interface AnalyticsData {
  overview: {
    totalUsers: number;
    activeUsers: number;
    totalConversations: number;
    totalMessages: number;
    totalScreenTime: number;
    avgScreenTimePerUser: number;
  };
  userGrowth: {
    thisMonth: number;
    lastMonth: number;
  };
  engagement: {
    dailyActiveUsers: number;
    avgMessagesPerConversation: number;
  };
  revenue: {
    totalPayments: number;
    completedPayments: number;
    pendingPayments: number;
  };
}

export const AdminAnalytics: React.FC = () => {
  const { data: analytics, isLoading, error } = useQuery<AnalyticsData>({
    queryKey: ['/api/admin/analytics'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="text-center text-red-400 p-8">
        Failed to load analytics data. Please try again.
      </div>
    );
  }

  const growthRate = analytics.userGrowth.lastMonth > 0 
    ? ((analytics.userGrowth.thisMonth - analytics.userGrowth.lastMonth) / analytics.userGrowth.lastMonth) * 100 
    : 0;

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
        <p className="text-gray-400">Real-time insights into Flamingo AI usage</p>
      </motion.div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ParallaxAnimation speed={0.1} direction="up">
          <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border-blue-700/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-200">Total Users</CardTitle>
              <Users className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{analytics.overview.totalUsers.toLocaleString()}</div>
              <div className="flex items-center space-x-2 text-xs text-blue-300 mt-1">
                <TrendingUp className="h-3 w-3" />
                <span>{analytics.overview.activeUsers} active this week</span>
              </div>
            </CardContent>
          </Card>
        </ParallaxAnimation>

        <ParallaxAnimation speed={0.15} direction="up">
          <Card className="bg-gradient-to-br from-green-900/50 to-green-800/30 border-green-700/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-200">Conversations</CardTitle>
              <MessageSquare className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{analytics.overview.totalConversations.toLocaleString()}</div>
              <div className="flex items-center space-x-2 text-xs text-green-300 mt-1">
                <span>{analytics.overview.totalMessages.toLocaleString()} total messages</span>
              </div>
            </CardContent>
          </Card>
        </ParallaxAnimation>

        <ParallaxAnimation speed={0.2} direction="up">
          <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border-purple-700/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-200">Screen Time</CardTitle>
              <Clock className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{formatTime(analytics.overview.totalScreenTime)}</div>
              <div className="flex items-center space-x-2 text-xs text-purple-300 mt-1">
                <span>Avg: {formatTime(analytics.overview.avgScreenTimePerUser)}/user</span>
              </div>
            </CardContent>
          </Card>
        </ParallaxAnimation>

        <ParallaxAnimation speed={0.25} direction="up">
          <Card className="bg-gradient-to-br from-orange-900/50 to-orange-800/30 border-orange-700/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-200">Payments</CardTitle>
              <DollarSign className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{analytics.revenue.totalPayments}</div>
              <div className="flex items-center space-x-2 text-xs text-orange-300 mt-1">
                <span>{analytics.revenue.completedPayments} completed</span>
                <Badge variant="secondary" className="text-xs bg-orange-800/50 text-orange-200">
                  {analytics.revenue.pendingPayments} pending
                </Badge>
              </div>
            </CardContent>
          </Card>
        </ParallaxAnimation>
      </div>

      {/* Growth and Engagement */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ParallaxAnimation speed={0.1} direction="right">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-400" />
                User Growth
              </CardTitle>
              <CardDescription className="text-gray-400">
                Monthly user registration trends
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">This Month</span>
                <span className="text-2xl font-bold text-white">{analytics.userGrowth.thisMonth}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Last Month</span>
                <span className="text-xl text-gray-400">{analytics.userGrowth.lastMonth}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-300">Growth Rate:</span>
                <div className="flex items-center gap-1">
                  {growthRate >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-400" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-400" />
                  )}
                  <span className={`font-semibold ${growthRate >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {growthRate.toFixed(1)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </ParallaxAnimation>

        <ParallaxAnimation speed={0.1} direction="left">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-400" />
                Engagement Metrics
              </CardTitle>
              <CardDescription className="text-gray-400">
                User activity and interaction patterns
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Daily Active Users</span>
                <span className="text-2xl font-bold text-white">{analytics.engagement.dailyActiveUsers}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Avg Messages/Chat</span>
                <span className="text-xl text-gray-400">{analytics.engagement.avgMessagesPerConversation}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-400 h-2 rounded-full transition-all duration-500" 
                  style={{ 
                    width: `${Math.min((analytics.engagement.dailyActiveUsers / analytics.overview.totalUsers) * 100, 100)}%` 
                  }}
                ></div>
              </div>
              <span className="text-xs text-gray-400">
                {((analytics.engagement.dailyActiveUsers / analytics.overview.totalUsers) * 100).toFixed(1)}% of users active today
              </span>
            </CardContent>
          </Card>
        </ParallaxAnimation>
      </div>
    </div>
  );
};