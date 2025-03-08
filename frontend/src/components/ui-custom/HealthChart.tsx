
import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';
import GlassCard from '@/components/ui-custom/GlassCard';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { useIsMobile } from '@/hooks/use-mobile';

interface HealthDataPoint {
  date: string;
  value: number;
}

interface HealthChartProps {
  title: string;
  unit: string;
  data: HealthDataPoint[];
  color?: string;
  className?: string;
}

const CustomTooltip = ({ 
  active, 
  payload, 
  label,
  unit 
}: TooltipProps<ValueType, NameType> & { unit: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-effect p-2 px-3 rounded-lg shadow-sm text-sm">
        <p className="font-medium text-xs text-muted-foreground mb-1">{label}</p>
        <p className="text-foreground font-medium">
          {payload[0].value} {unit}
        </p>
      </div>
    );
  }

  return null;
};

const HealthChart = ({ 
  title, 
  unit, 
  data, 
  color = '#0EA5E9', 
  className 
}: HealthChartProps) => {
  const isMobile = useIsMobile();
  const [chartData, setChartData] = useState<any[]>([]);
  
  useEffect(() => {
    // Format the dates for display
    const formattedData = data.map(item => ({
      ...item,
      formattedDate: new Date(item.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      })
    }));
    setChartData(formattedData);
  }, [data]);

  return (
    <GlassCard className={className}>
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-medium text-lg">{title}</h3>
            <p className="text-sm text-muted-foreground">Measured in {unit}</p>
          </div>
        </div>
        
        <div className="flex-1 w-full" style={{ minHeight: '180px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 5,
                right: 10,
                left: isMobile ? 0 : 10,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.1)" />
              <XAxis 
                dataKey="formattedDate" 
                tick={{ fontSize: 12 }} 
                tickLine={false} 
                axisLine={false} 
                minTickGap={10}
              />
              <YAxis 
                tick={{ fontSize: 12 }} 
                tickLine={false} 
                axisLine={false} 
                width={30}
              />
              <Tooltip 
                content={<CustomTooltip unit={unit} />} 
                cursor={{ stroke: color, strokeWidth: 1, strokeDasharray: '3 3' }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2}
                dot={{ stroke: color, strokeWidth: 2, r: 4, fill: 'white' }}
                activeDot={{ stroke: color, strokeWidth: 2, r: 6, fill: 'white' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </GlassCard>
  );
};

export default HealthChart;
