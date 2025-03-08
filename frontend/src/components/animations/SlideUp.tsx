
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SlideUpProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  as?: React.ElementType;
  index?: number;
}

const SlideUp = ({ 
  children, 
  className, 
  delay = 0, 
  duration = 400, 
  as: Component = 'div',
  index
}: SlideUpProps) => {
  const style = {
    animationDelay: `${delay + (index ? index * 100 : 0)}ms`,
    animationDuration: `${duration}ms`,
    '--index': index
  };

  return (
    <Component 
      className={cn('animate-slide-up animate-in', className)} 
      style={style as React.CSSProperties}
    >
      {children}
    </Component>
  );
};

export default SlideUp;
