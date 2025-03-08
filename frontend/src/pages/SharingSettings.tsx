
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { AlertCircle, Info, Plus, Share2, User } from 'lucide-react';
import FadeIn from '@/components/animations/FadeIn';
import SlideUp from '@/components/animations/SlideUp';
import RecordSharing from '@/components/ui-custom/RecordSharing';
import { toast } from '@/hooks/use-toast';
import { useNavigate, useLocation } from 'react-router-dom';

const SharingSettings = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('providers');
  const [globalSharing, setGlobalSharing] = useState(false);
  const [showSharingDialog, setShowSharingDialog] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState('sample-record-123');
  const [familyMembers, setFamilyMembers] = useState<Array<{id: number, name: string, relation: string, shared: boolean}>>([]);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRelation, setNewMemberRelation] = useState('');
  const [connectedApps, setConnectedApps] = useState<Array<{id: number, name: string, access: string, lastUsed: string}>>([]);
  
  const [providers, setProviders] = useState([
    { id: 1, name: 'Dr. Sarah Johnson', speciality: 'Primary Care', shared: true },
    { id: 2, name: 'Dr. Michael Chen', speciality: 'Cardiology', shared: false },
    { id: 3, name: 'Dr. Emily Rodriguez', speciality: 'Endocrinology', shared: true },
  ]);

  // Check for tab parameter in URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab && ['providers', 'family', 'apps'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [location]);

  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/sharing?tab=${value}`, { replace: true });
  };

  const handleGlobalSharingChange = (checked: boolean) => {
    setGlobalSharing(checked);
    toast({
      title: checked ? 'Global sharing enabled' : 'Global sharing disabled',
      description: checked 
        ? 'Your records can now be shared with authorized providers' 
        : 'Your records are now private',
    });
  };

  const handleProviderSharingChange = (id: number, checked: boolean) => {
    setProviders(providers.map(provider => 
      provider.id === id ? { ...provider, shared: checked } : provider
    ));
    
    toast({
      title: checked ? 'Provider access granted' : 'Provider access revoked',
      description: `Sharing settings updated for ${providers.find(p => p.id === id)?.name}`,
    });
  };

  const handleSaveChanges = () => {
    toast({
      title: 'Sharing preferences saved',
      description: 'Your sharing settings have been updated successfully.',
    });
    navigate('/dashboard');
  };

  const handleOpenSharingDialog = (recordId = 'sample-record-123') => {
    setSelectedRecord(recordId);
    setShowSharingDialog(true);
  };

  const handleCloseSharingDialog = () => {
    setShowSharingDialog(false);
  };

  const handleAddFamilyMember = () => {
    if (newMemberName.trim() === '') {
      toast({
        title: 'Name required',
        description: 'Please enter a name for the family member',
        variant: 'destructive',
      });
      return;
    }
    
    const newMember = {
      id: Date.now(),
      name: newMemberName,
      relation: newMemberRelation || 'Family Member',
      shared: false
    };
    
    setFamilyMembers([...familyMembers, newMember]);
    setNewMemberName('');
    setNewMemberRelation('');
    
    toast({
      title: 'Family member added',
      description: `${newMember.name} has been added to your sharing list`,
    });
  };

  const handleFamilyMemberSharingChange = (id: number, checked: boolean) => {
    setFamilyMembers(familyMembers.map(member => 
      member.id === id ? { ...member, shared: checked } : member
    ));
  };

  return (
    <FadeIn className="container max-w-4xl py-8 pt-24">
      {/* Heading with info */}
      <SlideUp>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Sharing Settings</h1>
          <Button variant="outline" size="sm" className="flex items-center gap-1.5">
            <Info size={16} />
            <span>Privacy Guide</span>
          </Button>
        </div>
      </SlideUp>
      
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="providers">
            <User size={14} className="mr-1.5" />
            Healthcare Providers
          </TabsTrigger>
          <TabsTrigger value="family">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            Family & Caregivers
          </TabsTrigger>
          <TabsTrigger value="apps">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5">
              <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
              <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
              <line x1="6" y1="6" x2="6.01" y2="6"></line>
              <line x1="6" y1="18" x2="6.01" y2="18"></line>
            </svg>
            Connected Apps
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="providers" className="space-y-6">
          <SlideUp delay={100}>
            <Card>
              <CardHeader>
                <CardTitle>Global Sharing Preferences</CardTitle>
                <CardDescription>
                  Control how your health records are shared with healthcare providers.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <Switch 
                    id="global-sharing" 
                    checked={globalSharing} 
                    onCheckedChange={handleGlobalSharingChange} 
                  />
                  <Label htmlFor="global-sharing">
                    {globalSharing ? 'Records are being shared with authorized providers' : 'Records are private'}
                  </Label>
                </div>
                
                {globalSharing && (
                  <div className="mt-4 flex items-start p-4 border border-amber-200 bg-amber-50 rounded-md">
                    <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 mr-3 flex-shrink-0" />
                    <p className="text-sm text-amber-800">
                      Global sharing allows all authorized providers to access your basic health information. 
                      You can customize access for specific providers below.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </SlideUp>
          
          <SlideUp delay={200}>
            <Card>
              <CardHeader>
                <CardTitle>Provider-Specific Settings</CardTitle>
                <CardDescription>
                  Customize sharing settings for individual healthcare providers.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {providers.map((provider, index) => (
                  <div key={provider.id}>
                    {index > 0 && <Separator className="my-4" />}
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-md font-medium">{provider.name}</h3>
                        <p className="text-sm text-muted-foreground">{provider.speciality}</p>
                      </div>
                      <Switch 
                        checked={provider.shared} 
                        onCheckedChange={(checked) => handleProviderSharingChange(provider.id, checked)} 
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button variant="outline" className="flex items-center gap-1.5">
                  <Plus size={16} />
                  Add New Provider
                </Button>
              </CardFooter>
            </Card>
          </SlideUp>
          
          <SlideUp delay={300}>
            <Card>
              <CardHeader>
                <CardTitle>Record Sharing</CardTitle>
                <CardDescription>
                  Share specific medical records with healthcare providers or family members.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Use the sharing dialog to control who can access your specific medical records.
                </p>
                <Button onClick={() => handleOpenSharingDialog()} className="flex items-center gap-1.5">
                  <Share2 size={16} />
                  Open Sharing Dialog
                </Button>
              </CardContent>
            </Card>
          </SlideUp>
        </TabsContent>
        
        <TabsContent value="family" className="space-y-6">
          <SlideUp delay={100}>
            <Card>
              <CardHeader>
                <CardTitle>Family & Caregiver Access</CardTitle>
                <CardDescription>
                  Manage how your health information can be accessed by family members and caregivers.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {familyMembers.length === 0 ? (
                  <p className="text-muted-foreground mb-4">
                    No family members or caregivers have been added yet. Add someone to share your health records with them.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {familyMembers.map((member, index) => (
                      <div key={member.id}>
                        {index > 0 && <Separator className="my-4" />}
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-md font-medium">{member.name}</h3>
                            <p className="text-sm text-muted-foreground">{member.relation}</p>
                          </div>
                          <Switch 
                            checked={member.shared} 
                            onCheckedChange={(checked) => handleFamilyMemberSharingChange(member.id, checked)} 
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="mt-6 space-y-4 border-t pt-4">
                  <h3 className="text-sm font-medium">Add New Family Member or Caregiver</h3>
                  <div className="flex flex-wrap gap-3">
                    <Input 
                      placeholder="Name" 
                      value={newMemberName}
                      onChange={(e) => setNewMemberName(e.target.value)}
                      className="flex-1 min-w-[200px]"
                    />
                    <Input 
                      placeholder="Relationship (e.g., Spouse, Child)" 
                      value={newMemberRelation}
                      onChange={(e) => setNewMemberRelation(e.target.value)}
                      className="flex-1 min-w-[200px]"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleAddFamilyMember} className="flex items-center gap-1.5">
                  <Plus size={16} />
                  Add Family Member
                </Button>
              </CardFooter>
            </Card>
          </SlideUp>
        </TabsContent>
        
        <TabsContent value="apps" className="space-y-6">
          <SlideUp delay={100}>
            <Card>
              <CardHeader>
                <CardTitle>Connected Applications</CardTitle>
                <CardDescription>
                  Manage third-party applications that have access to your health data.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {connectedApps.length === 0 ? (
                  <div className="text-center py-6">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
                        <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
                        <line x1="6" y1="6" x2="6.01" y2="6"></line>
                        <line x1="6" y1="18" x2="6.01" y2="18"></line>
                      </svg>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      You haven't connected any third-party applications yet.
                    </p>
                    <p className="text-sm text-muted-foreground mb-6">
                      Connect apps to sync your health data and get the most out of your medical information.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* App listings would go here */}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-center sm:justify-start">
                <Button variant="outline" className="flex items-center gap-1.5">
                  <Plus size={16} />
                  Connect New App
                </Button>
              </CardFooter>
            </Card>
          </SlideUp>
        </TabsContent>
      </Tabs>
      
      <div className="mt-8 flex justify-end space-x-4">
        <Button variant="outline" onClick={() => navigate('/dashboard')}>Cancel</Button>
        <Button onClick={handleSaveChanges}>Save Changes</Button>
      </div>

      {/* Add RecordSharing with required props */}
      <RecordSharing
        recordId={selectedRecord}
        recordName="Medical Summary Record"
        isOpen={showSharingDialog}
        onClose={handleCloseSharingDialog}
      />
    </FadeIn>
  );
};

export default SharingSettings;
