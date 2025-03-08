
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle, Check, Clock, Eye, Lock, Share2, User, X } from "lucide-react";
import { toast } from "sonner";
import { shareRecord, revokeAccess, getHealthRecord } from "@/utils/fhir";

interface SharingDialogProps {
  recordId: string;
  recordName: string;
  isOpen: boolean;
  onClose: () => void;
}

const RecordSharing = ({ recordId, recordName, isOpen, onClose }: SharingDialogProps) => {
  const [isShared, setIsShared] = useState(false);
  const [email, setEmail] = useState('');
  const [expirationEnabled, setExpirationEnabled] = useState(false);
  const [expiration, setExpiration] = useState('7');
  const [isLoading, setIsLoading] = useState(false);
  const [permissions, setPermissions] = useState({
    view: true,
    download: false,
    reshare: false
  });

  // Check if the record is already shared when the dialog opens
  useEffect(() => {
    const checkSharingStatus = async () => {
      if (recordId && isOpen) {
        try {
          const record = await getHealthRecord(recordId);
          if (record) {
            setIsShared(record.shared);
          }
        } catch (error) {
          console.error("Error checking record sharing status:", error);
        }
      }
    };
    
    checkSharingStatus();
  }, [recordId, isOpen]);

  const handleShare = async () => {
    if (!email) {
      toast.error("Please enter an email address", {
        icon: <AlertCircle className="h-4 w-4" />,
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Call FHIR API to share the record
      const expirationDays = expirationEnabled ? expiration : undefined;
      const success = await shareRecord(recordId, email, permissions, expirationDays);
      
      if (success) {
        toast.success(`Record "${recordName}" shared with ${email}`, {
          description: expirationEnabled ? `Access expires in ${expiration} days` : 'No expiration date set',
          icon: <Check className="h-4 w-4" />,
        });
        setIsShared(true);
        onClose();
      } else {
        toast.error("Failed to share record", {
          icon: <AlertCircle className="h-4 w-4" />,
        });
      }
    } catch (error) {
      console.error("Error sharing record:", error);
      toast.error("An error occurred while sharing the record", {
        icon: <AlertCircle className="h-4 w-4" />,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevoke = async () => {
    setIsLoading(true);
    
    try {
      // Call FHIR API to revoke sharing
      const success = await revokeAccess(recordId, email);
      
      if (success) {
        toast.success(`Access revoked for "${recordName}"`, {
          icon: <Lock className="h-4 w-4" />,
        });
        setIsShared(false);
        onClose();
      } else {
        toast.error("Failed to revoke access", {
          icon: <AlertCircle className="h-4 w-4" />,
        });
      }
    } catch (error) {
      console.error("Error revoking access:", error);
      toast.error("An error occurred while revoking access", {
        icon: <AlertCircle className="h-4 w-4" />,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Share2 className="mr-2 h-5 w-5 text-health-500" />
            Share Medical Record
          </DialogTitle>
          <DialogDescription>
            Share this record with healthcare providers or family members
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="record-name">Record</Label>
            <div className="rounded-md bg-muted p-2 text-sm">{recordName}</div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Share with (email)</Label>
            <Input
              id="email"
              placeholder="example@provider.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <Label>Access permissions</Label>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="view" 
                checked={permissions.view} 
                onCheckedChange={(checked) => 
                  setPermissions({...permissions, view: !!checked})
                }
              />
              <Label htmlFor="view" className="flex items-center text-sm font-normal">
                <Eye className="mr-1.5 h-3.5 w-3.5" />
                View record
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="download" 
                checked={permissions.download}
                onCheckedChange={(checked) => 
                  setPermissions({...permissions, download: !!checked})
                }
              />
              <Label htmlFor="download" className="flex items-center text-sm font-normal">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="14" 
                  height="14" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="mr-1.5"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" x2="12" y1="15" y2="3" />
                </svg>
                Download record
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="reshare" 
                checked={permissions.reshare}
                onCheckedChange={(checked) => 
                  setPermissions({...permissions, reshare: !!checked})
                }
              />
              <Label htmlFor="reshare" className="flex items-center text-sm font-normal">
                <User className="mr-1.5 h-3.5 w-3.5" />
                Allow resharing
              </Label>
            </div>
          </div>

          <div className="space-y-2 border-t pt-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="expiration" className="flex items-center text-sm">
                <Clock className="mr-1.5 h-3.5 w-3.5" />
                Set expiration date
              </Label>
              <Switch
                id="expiration-toggle"
                checked={expirationEnabled}
                onCheckedChange={setExpirationEnabled}
              />
            </div>
            
            {expirationEnabled && (
              <div className="flex items-center space-x-2 mt-2">
                <Input
                  id="expiration"
                  type="number"
                  min="1"
                  max="365"
                  value={expiration}
                  onChange={(e) => setExpiration(e.target.value)}
                  className="w-20"
                />
                <span className="text-sm text-muted-foreground">days</span>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="sm:justify-between">
          {isShared ? (
            <Button 
              variant="destructive" 
              size="sm"
              onClick={handleRevoke}
              disabled={isLoading}
              className="flex items-center"
            >
              {isLoading ? (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <X className="mr-1.5 h-4 w-4" />
              )}
              Revoke Access
            </Button>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
          )}
          
          <Button 
            onClick={handleShare}
            disabled={isLoading || !email}
            className="flex items-center"
          >
            {isLoading ? (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <Share2 className="mr-1.5 h-4 w-4" />
            )}
            Share Record
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RecordSharing;
