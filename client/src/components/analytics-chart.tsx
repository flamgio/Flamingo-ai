import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { motion } from 'framer-motion';

interface AnalyticsData {
  name: string;
  value: number;
  messages?: number;
}

interface AnalyticsChartProps {
  data: AnalyticsData[];
  type?: 'line' | 'bar';
  title: string;
  color?: string;
}

export function AnalyticsChart({ data, type = 'line', title, color = '#8b5cf6' }: AnalyticsChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative h-[18em] w-full text-white p-[1.5em] transition-all duration-300 group/card"
    >
      {/* Decorative dots */}
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        <div className="w-2 h-2 rounded-full bg-purple-300/50"></div>
        <div className="w-2 h-2 rounded-full bg-purple-300/30"></div>
        <div className="w-2 h-2 rounded-full bg-purple-300/10"></div>
      </div>

      <div className="relative z-10 h-full flex flex-col">
        {/* Title */}
        <h3 className="text-lg font-bold bg-gradient-to-r from-white via-purple-100 to-purple-200 bg-clip-text text-transparent mb-4">
          {title}
        </h3>

        {/* Chart Container */}
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            {type === 'line' ? (
              <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.7)" fontSize={12} />
                <YAxis stroke="rgba(255,255,255,0.7)" fontSize={12} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    border: '1px solid rgba(139,92,246,0.3)',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke={color}
                  strokeWidth={2}
                  dot={{ fill: color, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
                />
              </LineChart>
            ) : (
              <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.7)" fontSize={12} />
                <YAxis stroke="rgba(255,255,255,0.7)" fontSize={12} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    border: '1px solid rgba(139,92,246,0.3)',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
                <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}