
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getHealthRecord, HealthRecord } from "@/utils/fhir";
import { ArrowLeft, Calendar, Download, FileText, Share2, User } from "lucide-react";
import GlassCard from "@/components/ui-custom/GlassCard";
import RecordSharing from "@/components/ui-custom/RecordSharing";
import SlideUp from "@/components/animations/SlideUp";
import FadeIn from "@/components/animations/FadeIn";
import Footer from "@/components/layout/Footer";

const RecordDetails = () => {
  const { recordId } = useParams<{ recordId: string }>();
  const navigate = useNavigate();
  const [record, setRecord] = useState<HealthRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSharingDialog, setShowSharingDialog] = useState(false);

  useEffect(() => {
    const fetchRecord = async () => {
      if (!recordId) return;
      
      try {
        setLoading(true);
        const recordData = await getHealthRecord(recordId);
        
        if (recordData) {
          setRecord(recordData);
        } else {
          // Handle record not found
          console.error('Record not found');
        }
      } catch (error) {
        console.error('Error fetching record:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecord();
  }, [recordId]);

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Determine type badge color
  const getTypeBadgeColor = (type: string) => {
    switch(type.toLowerCase()) {
      case 'lab result':
        return 'bg-green-100 text-green-800';
      case 'medication':
        return 'bg-blue-100 text-blue-800';
      case 'visit summary':
        return 'bg-purple-100 text-purple-800';
      case 'immunization':
        return 'bg-amber-100 text-amber-800';
      case 'imaging':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleShare = () => {
    setShowSharingDialog(true);
  };

  const handleDownload = () => {
    // In a real app, this would trigger a download of the record
    console.log('Downloading record:', record?.id);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1">
          <div className="container mx-auto px-4 md:px-6 py-8">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-muted/50 rounded w-32"></div>
              <div className="h-8 bg-muted/50 rounded w-64"></div>
              <div className="h-4 bg-muted/50 rounded w-40"></div>
              <div className="h-64 bg-muted/50 rounded mt-6"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!record) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1">
          <div className="container mx-auto px-4 md:px-6 py-8">
            <FadeIn>
              <GlassCard className="py-12 text-center">
                <div className="space-y-3 max-w-md mx-auto">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <h3 className="text-xl font-medium">Record Not Found</h3>
                  <p className="text-muted-foreground">
                    We couldn't find the record you're looking for. It may have been removed or you don't have access to it.
                  </p>
                  <div className="pt-4">
                    <Button onClick={handleBack} variant="outline">
                      <ArrowLeft className="mr-1.5 h-4 w-4" />
                      Back to Records
                    </Button>
                  </div>
                </div>
              </GlassCard>
            </FadeIn>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <div className="container mx-auto px-4 md:px-6 py-8">
          <FadeIn>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleBack}
              className="mb-6"
            >
              <ArrowLeft size={16} className="mr-1.5" />
              Back to Records
            </Button>
          </FadeIn>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <SlideUp>
                <GlassCard>
                  <div className="flex flex-col md:flex-row justify-between items-start mb-4">
                    <div>
                      <Badge variant="outline" className={getTypeBadgeColor(record.type)}>
                        {record.type}
                      </Badge>
                      <h1 className="text-2xl font-bold mt-2">{record.title}</h1>
                    </div>
                    
                    <div className="flex mt-4 md:mt-0 space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleDownload}
                        className="flex items-center"
                      >
                        <Download size={16} className="mr-1.5" />
                        Download
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleShare}
                        className="flex items-center"
                      >
                        <Share2 size={16} className="mr-1.5" />
                        Share
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Provider</div>
                      <div className="flex items-center">
                        <User size={16} className="mr-1.5 text-muted-foreground" />
                        {record.provider}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Date</div>
                      <div className="flex items-center">
                        <Calendar size={16} className="mr-1.5 text-muted-foreground" />
                        {formatDate(record.date)}
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="prose prose-sm sm:prose max-w-none">
                    {record.content ? (
                      <div className="whitespace-pre-line">
                        {record.content}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">
                        No detailed content available for this record.
                      </p>
                    )}
                  </div>
                  
                  {record.attachments && record.attachments.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-medium mb-3">Attachments</h3>
                      <div className="space-y-2">
                        {record.attachments.map((attachment) => (
                          <div 
                            key={attachment.id}
                            className="flex items-center p-3 border rounded-md hover:bg-muted/50 transition-colors cursor-pointer"
                          >
                            <FileText size={16} className="mr-2 text-muted-foreground" />
                            <div className="flex-1">
                              <div className="font-medium text-sm">{attachment.name}</div>
                              {attachment.size && (
                                <div className="text-xs text-muted-foreground">
                                  {Math.round(attachment.size / 1024)} KB
                                </div>
                              )}
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Download size={14} />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </GlassCard>
              </SlideUp>
            </div>
            
            <div>
              <SlideUp delay={100}>
                <GlassCard>
                  <h2 className="text-lg font-medium mb-4">Sharing Status</h2>
                  
                  <div className="space-y-3">
                    <div className="p-3 bg-muted rounded-md">
                      <div className="text-sm font-medium">Current Status</div>
                      <div className="flex items-center mt-1">
                        {record.shared ? (
                          <Badge variant="outline" className="bg-health-100 text-health-800 font-medium">
                            Shared
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-gray-100 text-gray-800 font-medium">
                            Private
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full flex items-center justify-center"
                      onClick={handleShare}
                    >
                      <Share2 size={16} className="mr-1.5" />
                      Manage Sharing
                    </Button>
                    
                    <Separator className="my-3" />
                    
                    <div className="text-sm text-muted-foreground">
                      <p className="mb-2">When you share a record:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>You control exactly who can see it</li>
                        <li>You can revoke access at any time</li>
                        <li>You can set an expiration date</li>
                        <li>Access activity is logged for your security</li>
                      </ul>
                    </div>
                  </div>
                </GlassCard>
              </SlideUp>
              
              <SlideUp delay={200}>
                <GlassCard className="mt-6">
                  <h2 className="text-lg font-medium mb-4">Record History</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="bg-muted rounded-full w-8 h-8 flex items-center justify-center mr-3 mt-0.5">
                        <FileText size={14} />
                      </div>
                      <div>
                        <div className="text-sm font-medium">Record created</div>
                        <div className="text-xs text-muted-foreground">
                          {formatDate(record.date)}
                        </div>
                      </div>
                    </div>
                    
                    {record.shared && (
                      <div className="flex items-start">
                        <div className="bg-health-50 rounded-full w-8 h-8 flex items-center justify-center mr-3 mt-0.5">
                          <Share2 size={14} className="text-health-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium">Record shared</div>
                          <div className="text-xs text-muted-foreground">
                            {formatDate(new Date().toISOString())}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </GlassCard>
              </SlideUp>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      
      {record && (
        <RecordSharing
          recordId={record.id}
          recordName={record.title}
          isOpen={showSharingDialog}
          onClose={() => setShowSharingDialog(false)}
        />
      )}
    </div>
  );
};

export default RecordDetails;
