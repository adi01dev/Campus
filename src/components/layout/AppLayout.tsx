import { ReactNode, useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Menu, Bell, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { NotificationPopup } from '@/components/ui/notification-popup';
import { MessagePopup } from '@/components/ui/message-popup';

interface AppLayoutProps {
  children?: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [messageOpen, setMessageOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  const navigate = useNavigate();
  const { toast } = useToast();

  // ✅ Combined Auth + User load logic
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const userStr = localStorage.getItem('user');

    if (!token || !userStr) {
      navigate('/login', { replace: true });
      return;
    }

    try {
      const parsedUser = JSON.parse(userStr);
      setUser(parsedUser);
    } catch {
      localStorage.removeItem('user');
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  // 🌀 Optional loading screen before redirect or layout load
  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen text-muted-foreground">
        Loading...
      </div>
    );
  }

  // 🔔 Handlers
  const handleNotificationClick = () => setNotificationOpen(!notificationOpen);
  const handleMessagesClick = () => setMessageOpen(!messageOpen);

  return (
    <div className="min-h-screen bg-background academic-pattern">
      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden fixed top-4 left-4 z-50 bg-card shadow-md hover:shadow-lg transition-all"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-80">
          <Sidebar user={user} />
        </SheetContent>
      </Sheet>

      {/* Desktop Layout */}
      <div className="lg:flex">
        <div className="hidden lg:block w-80 fixed inset-y-0 z-30">
          <Sidebar user={user} />
        </div>

        <div className="lg:ml-80 flex-1">
          <Header user={user} />

          {/* Quick Action Bar */}
          <div className="sticky top-16 z-20 bg-background/80 backdrop-blur-sm border-b border-border px-4 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <span className="text-sm text-muted-foreground">
                  System Status: All services operational
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleNotificationClick}
                  className="relative hover:bg-primary/10"
                >
                  <Bell className="w-4 h-4" />
                  <Badge variant="destructive" className="absolute -top-1 -right-1 w-5 h-5 text-xs p-0 flex items-center justify-center">
                    3
                  </Badge>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMessagesClick}
                  className="relative hover:bg-primary/10"
                >
                  <MessageSquare className="w-4 h-4" />
                  <Badge variant="secondary" className="absolute -top-1 -right-1 w-5 h-5 text-xs p-0 flex items-center justify-center">
                    2
                  </Badge>
                </Button>
              </div>
            </div>
          </div>

          {/* ✅ Render nested dashboard routes */}
          <main className="p-6 pt-4">
            <div className="animate-fade-in-up">
              {children || <Outlet />}
            </div>
          </main>

          {/* Footer */}
          <footer className="border-t border-border bg-card/50 px-6 py-8 mt-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="font-semibold mb-4 text-foreground">CampusConnect</h3>
                <p className="text-sm text-muted-foreground">
                  Empowering educational excellence through innovative technology solutions.
                </p>
              </div>
              {/* ... rest of your footer ... */}
            </div>
            <div className="border-t border-border mt-8 pt-6 text-center">
              <p className="text-sm text-muted-foreground">
                © 2025 CampusConnect ERP. All Rights Reserved | Version 2.1.0
              </p>
            </div>
          </footer>
        </div>
      </div>

      <NotificationPopup isOpen={notificationOpen} onClose={() => setNotificationOpen(false)} />
      <MessagePopup isOpen={messageOpen} onClose={() => setMessageOpen(false)} />
    </div>
  );
};

export default AppLayout;