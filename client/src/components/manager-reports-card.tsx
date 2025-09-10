import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, FileText, Users, MessageSquare, Clock } from "lucide-react";

interface ManagerReportsData {
  activeUsers: number;
  openChats: number;
  avgResponseTime: number;
  totalMessages: number;
  userGrowth: number;
  chatGrowth: number;
  responseGrowth: number;
  lastUpdated?: string;
}

interface ManagerReportsCardProps {
  data: ManagerReportsData;
  className?: string;
}

export default function ManagerReportsCard({ data, className = "" }: ManagerReportsCardProps) {
  const chartRef = useRef<SVGSVGElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [animatedUsers, setAnimatedUsers] = useState(0);
  const [animatedChats, setAnimatedChats] = useState(0);
  const [animatedResponseTime, setAnimatedResponseTime] = useState(0);

  // Animate the chart line drawing
  useGSAP(() => {
    if (chartRef.current) {
      const path = chartRef.current.querySelector('path');
      if (path) {
        const pathLength = path.getTotalLength();
        
        // Set initial state
        gsap.set(path, {
          strokeDasharray: pathLength,
          strokeDashoffset: pathLength
        });
        
        // Animate the line drawing
        gsap.to(path, {
          strokeDashoffset: 0,
          duration: 2,
          ease: "power2.inOut",
          delay: 0.5
        });
      }
      
      // Animate the glowing dot
      const dot = chartRef.current.querySelector('.chart-dot');
      if (dot) {
        gsap.fromTo(dot, 
          { scale: 0, opacity: 0 },
          { 
            scale: 1, 
            opacity: 1, 
            duration: 0.5, 
            delay: 2,
            ease: "back.out(1.7)"
          }
        );
        
        // Add pulsing glow effect
        gsap.to(dot, {
          filter: "drop-shadow(0 0 8px rgba(34, 197, 94, 0.8))",
          duration: 1,
          repeat: -1,
          yoyo: true,
          ease: "power2.inOut"
        });
      }
    }
  }, []);

  // Animate counters
  useEffect(() => {
    const usersTarget = data.activeUsers;
    const chatsTarget = data.openChats;
    const responseTarget = data.avgResponseTime;
    
    gsap.to({ value: 0 }, {
      value: usersTarget,
      duration: 1.5,
      ease: "power2.out",
      onUpdate: function() {
        setAnimatedUsers(Math.round(this.targets()[0].value));
      }
    });
    
    gsap.to({ value: 0 }, {
      value: chatsTarget,
      duration: 1.5,
      ease: "power2.out",
      delay: 0.2,
      onUpdate: function() {
        setAnimatedChats(Math.round(this.targets()[0].value));
      }
    });

    gsap.to({ value: 0 }, {
      value: responseTarget,
      duration: 1.5,
      ease: "power2.out",
      delay: 0.4,
      onUpdate: function() {
        setAnimatedResponseTime(Math.round(this.targets()[0].value * 10) / 10);
      }
    });
  }, [data.activeUsers, data.openChats, data.avgResponseTime]);

  // Card hover animation
  const handleHover = () => {
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        y: -4,
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 0 20px rgba(34, 197, 94, 0.1)",
        duration: 0.3,
        ease: "power2.out"
      });
    }
  };

  const handleHoverEnd = () => {
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        y: 0,
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        duration: 0.3,
        ease: "power2.out"
      });
    }
  };

  // Generate chart path data (different pattern from user analytics)
  const generateChartPath = () => {
    const points = [
      { x: 10, y: 75 },
      { x: 25, y: 65 },
      { x: 40, y: 50 },
      { x: 55, y: 60 },
      { x: 70, y: 40 },
      { x: 85, y: 30 },
      { x: 100, y: 35 },
      { x: 115, y: 25 },
      { x: 130, y: 20 },
      { x: 150, y: 15 }
    ];
    
    const pathData = points.map((point, index) => {
      return `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`;
    }).join(' ');
    
    return pathData;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <Card 
        ref={cardRef}
        className="analytics-card bg-[#1a1a1a] border-[#3a3a3a] border rounded-2xl p-6 transition-all duration-300 cursor-pointer"
        onMouseEnter={handleHover}
        onMouseLeave={handleHoverEnd}
        data-testid="card-manager-reports"
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#22c55e]/20 rounded-lg">
              <FileText className="h-5 w-5 text-[#22c55e]" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-white">
                Manager Reports
              </CardTitle>
              <p className="text-sm text-gray-400 mt-1">
                {data.lastUpdated || "Updated just now"}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Primary Metrics Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Active Users */}
            <div>
              <p className="text-gray-400 text-sm font-medium">Active Users</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-2xl font-bold text-white" data-testid="text-active-users-manager">
                  {animatedUsers.toLocaleString()}
                </span>
                <div className={`flex items-center text-xs font-medium ${
                  data.userGrowth >= 0 ? 'text-[#22c55e]' : 'text-red-400'
                }`}>
                  {data.userGrowth >= 0 ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {Math.abs(data.userGrowth)}%
                </div>
              </div>
            </div>

            {/* Open Chats */}
            <div>
              <p className="text-gray-400 text-sm font-medium">Open Chats</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-2xl font-bold text-white" data-testid="text-open-chats-manager">
                  {animatedChats.toLocaleString()}
                </span>
                <div className={`flex items-center text-xs font-medium ${
                  data.chatGrowth >= 0 ? 'text-[#22c55e]' : 'text-red-400'
                }`}>
                  {data.chatGrowth >= 0 ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {Math.abs(data.chatGrowth)}%
                </div>
              </div>
            </div>
          </div>

          {/* Response Time Metric - Full Width */}
          <div className="border-t border-[#3a3a3a] pt-4">
            <p className="text-gray-400 text-sm font-medium">Avg Response Time</p>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-2xl font-bold text-white" data-testid="text-response-time">
                {animatedResponseTime}s
              </span>
              <div className={`flex items-center text-xs font-medium ${
                data.responseGrowth <= 0 ? 'text-[#22c55e]' : 'text-red-400'
              }`}>
                {data.responseGrowth <= 0 ? (
                  <TrendingDown className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingUp className="h-3 w-3 mr-1" />
                )}
                {Math.abs(data.responseGrowth)}%
              </div>
            </div>
          </div>

          {/* Additional Metrics Row */}
          <div className="border-t border-[#3a3a3a] pt-4 grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-400">Total Messages</p>
                <p className="text-sm font-semibold text-white" data-testid="text-total-messages">
                  {data.totalMessages.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-400">Uptime</p>
                <p className="text-sm font-semibold text-[#22c55e]" data-testid="text-uptime">
                  99.8%
                </p>
              </div>
            </div>
          </div>

          {/* Animated Chart */}
          <div className="mt-6">
            <svg 
              ref={chartRef}
              width="100%" 
              height="60" 
              viewBox="0 0 160 100"
              className="overflow-visible"
            >
              <defs>
                <linearGradient id="managerChartGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#16a34a" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#15803d" stopOpacity="0.4" />
                </linearGradient>
              </defs>
              
              {/* Chart line */}
              <path
                d={generateChartPath()}
                stroke="url(#managerChartGradient)"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="drop-shadow(0 0 4px rgba(34, 197, 94, 0.3))"
              />
              
              {/* Glowing dot at the end */}
              <circle
                className="chart-dot"
                cx="150"
                cy="15"
                r="4"
                fill="#22c55e"
                filter="drop-shadow(0 0 6px rgba(34, 197, 94, 0.6))"
              />
            </svg>
          </div>

          {/* View Full Report Button */}
          <Button 
            className="btn-neon w-full mt-4 bg-transparent border border-[#22c55e] text-[#22c55e] hover:bg-[#22c55e]/10 transition-all duration-300"
            data-testid="button-view-manager-reports"
          >
            View Full Report
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}