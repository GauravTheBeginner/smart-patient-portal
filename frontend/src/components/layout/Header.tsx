
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Bell, FileText, Home, Menu, Settings, Share2, X, LogIn, LogOut, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import FadeIn from '@/components/animations/FadeIn';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { isAuthenticated, user, signOut } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(2);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    { name: 'Home', path: '/', icon: <Home size={16} /> },
    { name: 'Dashboard', path: '/dashboard', icon: <FileText size={16} /> },
    { name: 'Sharing', path: '/sharing', icon: <Share2 size={16} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={16} /> },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleNotificationClick = () => {
    // In a real app, this would mark notifications as read
    setNotificationCount(0);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled ? 'backdrop-blur-md bg-background/80 shadow-sm' : 'bg-transparent',
        mobileMenuOpen && isMobile && 'bg-background shadow-sm'
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="font-semibold text-xl flex items-center">
              <div className="w-8 h-8 rounded-full bg-health-500 flex items-center justify-center mr-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 12H18L15 21L9 3L6 12H2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span>MedSync</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link 
                key={item.path}
                to={item.path}
                className={cn(
                  'px-3 py-2 rounded-md text-sm font-medium flex items-center',
                  isActive(item.path) 
                    ? 'text-health-600 bg-health-50' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors'
                )}
              >
                <span className="mr-1.5">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative"
                onClick={handleNotificationClick}
                aria-label={`${notificationCount} unread notifications`}
              >
                <Bell size={18} />
                {notificationCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-health-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                    {notificationCount}
                  </span>
                )}
              </Button>
            )}

            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </Button>
            )}

            {!isAuthenticated ? (
              <Button variant="health" size="sm" asChild>
                <Link to="/signin">
                  <LogIn className="mr-1.5" size={16} />
                  Sign In
                </Link>
              </Button>
            ) : (
              !isMobile && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <User size={16} />
                      <span className="hidden sm:inline">{user?.name || 'Account'}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                      <FileText className="mr-2" size={16} />
                      My Records
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/settings')}>
                      <Settings className="mr-2" size={16} />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="text-red-500 focus:text-red-500">
                      <LogOut className="mr-2" size={16} />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobile && (
        <FadeIn
          className={cn(
            'absolute top-16 left-0 right-0 bg-background border-t border-border',
            mobileMenuOpen ? 'block' : 'hidden'
          )}
        >
          <nav className="container mx-auto py-3 px-4 flex flex-col space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'px-4 py-3 rounded-md text-sm font-medium flex items-center',
                  isActive(item.path)
                    ? 'text-health-600 bg-health-50'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                )}
              >
                <span className="mr-2">{item.icon}</span>
                {item.name}
              </Link>
            ))}
            
            {isAuthenticated && (
              <Button
                variant="ghost"
                size="sm"
                className="justify-start px-4 py-3 h-auto text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={handleSignOut}
              >
                <LogOut size={16} className="mr-2" />
                Sign Out
              </Button>
            )}
          </nav>
        </FadeIn>
      )}
    </header>
  );
};

export default Header;
