
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface FadeInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  as?: React.ElementType;
}

const FadeIn = ({ 
  children, 
  className, 
  delay = 0, 
  duration = 300, 
  as: Component = 'div' 
}: FadeInProps) => {
  const style = {
    animationDelay: `${delay}ms`,
    animationDuration: `${duration}ms`
  };

  return (
    <Component 
      className={cn('animate-fade-in', className)} 
      style={style}
    >
      {children}
    </Component>
  );
};

export default FadeIn;
