
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
  onClick?: () => void;
}

const GlassCard = ({ 
  children, 
  className, 
  hoverEffect = false,
  onClick
}: GlassCardProps) => {
  return (
    <div 
      className={cn(
        'glass-effect rounded-xl p-6 shadow-glass', 
        hoverEffect && 'transition-transform duration-300 hover:shadow-glass-lg hover:-translate-y-1 cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default GlassCard;
