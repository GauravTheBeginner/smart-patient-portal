
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import FadeIn from '@/components/animations/FadeIn';
import SlideUp from '@/components/animations/SlideUp';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(true);
  const [theme, setTheme] = useState('system');
  const [language, setLanguage] = useState('en');
  const [dataRetention, setDataRetention] = useState('30');

  const handleSaveSettings = () => {
    toast({
      title: 'Settings saved',
      description: 'Your settings have been updated successfully.',
    });
  };

  return (
    <FadeIn className="container max-w-4xl py-8 pt-24">
      <SlideUp>
        <h1 className="text-3xl font-bold mb-8">Settings</h1>
      </SlideUp>
      
      <div className="space-y-6">
        <SlideUp delay={100}>
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize how the application looks and feels.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Theme</Label>
                <RadioGroup value={theme} onValueChange={setTheme} className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="light" id="theme-light" />
                    <Label htmlFor="theme-light">Light</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dark" id="theme-dark" />
                    <Label htmlFor="theme-dark">Dark</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="system" id="theme-system" />
                    <Label htmlFor="theme-system">System</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </SlideUp>
        
        <SlideUp delay={200}>
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Configure how and when you receive notifications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Switch 
                  id="notifications" 
                  checked={notifications} 
                  onCheckedChange={setNotifications} 
                />
                <Label htmlFor="notifications">
                  Enable notifications
                </Label>
              </div>
              
              {notifications && (
                <>
                  <Separator className="my-4" />
                  <div className="space-y-4 pl-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notify-appointments">Appointment reminders</Label>
                      <Switch id="notify-appointments" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notify-messages">New messages</Label>
                      <Switch id="notify-messages" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notify-updates">Health record updates</Label>
                      <Switch id="notify-updates" defaultChecked />
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </SlideUp>
        
        <SlideUp delay={300}>
          <Card>
            <CardHeader>
              <CardTitle>Privacy & Data</CardTitle>
              <CardDescription>
                Manage how your data is stored and processed.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="data-retention">Data retention period</Label>
                <Select value={dataRetention} onValueChange={setDataRetention}>
                  <SelectTrigger id="data-retention">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 days</SelectItem>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="365">1 year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Separator className="my-4" />
              
              <Button variant="outline" className="w-full">
                Export My Data
              </Button>
              
              <Button variant="destructive" className="w-full">
                Delete My Account
              </Button>
            </CardContent>
          </Card>
        </SlideUp>
      </div>
      
      <div className="mt-8 flex justify-end space-x-4">
        <Button variant="outline" onClick={() => navigate('/dashboard')}>Cancel</Button>
        <Button onClick={handleSaveSettings}>Save Settings</Button>
      </div>
    </FadeIn>
  );
};

export default Settings;
