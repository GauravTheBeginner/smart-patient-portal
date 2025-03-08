
import { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, FileText, Share2, Shield, User } from 'lucide-react';
import GlassCard from './GlassCard';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import RecordSharing from './RecordSharing';
import { toast } from 'sonner';

export interface PatientRecordProps {
  id: string;
  title: string;
  type: string;
  date: string;
  provider: string;
  shared?: boolean;
  className?: string;
}

const PatientRecord = ({ 
  id, 
  title, 
  type, 
  date, 
  provider, 
  shared = false,
  className
}: PatientRecordProps) => {
  const navigate = useNavigate();
  const [isShared, setIsShared] = useState(shared);
  const [showSharingDialog, setShowSharingDialog] = useState(false);

  const handleView = () => {
    navigate(`/records/${id}`);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowSharingDialog(true);
  };

  const handleCloseSharing = () => {
    setShowSharingDialog(false);
  };

  // Format date
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  // Determine type badge color
  const getTypeBadgeColor = () => {
    switch(type.toLowerCase()) {
      case 'lab result':
        return 'bg-green-100 text-green-800';
      case 'medication':
        return 'bg-blue-100 text-blue-800';
      case 'visit summary':
        return 'bg-purple-100 text-purple-800';
      case 'immunization':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <GlassCard 
        className={cn('transition-all duration-300', className)}
        hoverEffect={true}
        onClick={handleView}
      >
        <div className="flex flex-col h-full space-y-3">
          <div className="flex items-start justify-between">
            <Badge variant="outline" className={cn("font-medium", getTypeBadgeColor())}>
              {type}
            </Badge>
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn(
                "rounded-full h-8 w-8", 
                isShared ? "text-health-500 bg-health-50" : "text-muted-foreground"
              )}
              onClick={handleShare}
            >
              <Share2 size={14} />
            </Button>
          </div>
          
          <div className="flex-1 space-y-2">
            <h3 className="font-medium text-lg leading-tight">{title}</h3>
            
            <div className="space-y-1.5">
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar size={14} className="mr-1.5" />
                {formattedDate}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <User size={14} className="mr-1.5" />
                {provider}
              </div>
            </div>
          </div>
          
          <div className="pt-3 border-t border-border/50">
            <div className={cn(
              "flex items-center justify-between text-xs font-medium",
              isShared ? "text-health-600" : "text-muted-foreground"
            )}>
              <div className="flex items-center">
                {isShared ? (
                  <>
                    <Share2 size={12} className="mr-1" />
                    Shared
                  </>
                ) : (
                  <>
                    <Shield size={12} className="mr-1" />
                    Private
                  </>
                )}
              </div>
              <div className="flex items-center">
                <FileText size={12} className="mr-1" />
                View Details
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Sharing Dialog */}
      <RecordSharing
        recordId={id}
        recordName={title}
        isOpen={showSharingDialog}
        onClose={handleCloseSharing}
      />
    </>
  );
};

export default PatientRecord;
