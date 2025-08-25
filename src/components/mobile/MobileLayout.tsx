import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Eye, Users, Pill, Home, Bell, Calendar, TrendingUp, ShoppingCart, Upload } from "lucide-react";
import CreateRecordTab from "./CreateRecordTab";
import ViewHealthRecordsTab from "./ViewHealthRecordsTab";
import PatientManagementTab from "./PatientManagementTab";
import PrescriptionsTab from "./PrescriptionsTab";

export const MobileLayout = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [homeSubTab, setHomeSubTab] = useState<'consultations' | 'pending'>('consultations');
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      patientName: "Arjun Sharma",
      message: "Ready for Review",
      timestamp: "2 min ago",
      isRead: false,
      recordId: "rec_001"
    },
    {
      id: "2", 
      patientName: "Priya Patel",
      message: "Ready for Review",
      timestamp: "5 min ago",
      isRead: false,
      recordId: "rec_002"
    }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [statsToggle, setStatsToggle] = useState<'today' | 'weekly'>('today');
  const unreadCount = notifications.filter(n => !n.isRead).length;
  const [notificationRecordData, setNotificationRecordData] = useState<any>(null);

  const handleNotificationClick = (notification: any) => {
    // Mark as read
    setNotifications(prev => 
      prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n)
    );
    // Set notification data and navigate to records tab
    setNotificationRecordData({
      patientName: notification.patientName,
      recordId: notification.recordId
    });
    setActiveTab("view-records");
    setShowNotifications(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">1hat doc app</h1>
          <div className="flex items-center space-x-3">
            {/* Notification Bell */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="relative text-primary-foreground hover:bg-white/20 p-2"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <Badge 
                    className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-red-500 text-white"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>
              
              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-background border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                  <div className="p-3 border-b">
                    <h3 className="font-semibold text-foreground">Notifications</h3>
                  </div>
                  {notifications.length > 0 ? (
                    <div className="space-y-1">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-3 hover:bg-accent cursor-pointer border-l-4 ${
                            notification.isRead ? 'border-l-transparent' : 'border-l-primary'
                          }`}
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-sm text-foreground">
                                {notification.patientName}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {notification.timestamp}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {notification.message}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-muted-foreground">
                      No notifications
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-sm font-medium">Dr</span>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden pb-16">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsContent value="home" className="h-full m-0">
            <div className="h-full flex flex-col">
              {/* Stats Toggle and Numbers */}
              <div className="p-4 pb-0 space-y-4">
                {/* Week/Today Toggle */}
                <div className="bg-muted p-1 rounded-lg">
                  <div className="flex">
                    <button
                      onClick={() => setStatsToggle('today')}
                      className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        statsToggle === 'today'
                          ? 'bg-background text-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Today
                    </button>
                    <button
                      onClick={() => setStatsToggle('weekly')}
                      className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        statsToggle === 'weekly'
                          ? 'bg-background text-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      This Week
                    </button>
                  </div>
                </div>

                {/* Stats Numbers */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-card rounded-lg p-4 shadow-sm">
                    <div className="text-2xl font-bold text-primary">
                      {statsToggle === 'today' ? '8' : '42'}
                    </div>
                    <div className="text-sm text-muted-foreground">Consultations</div>
                  </div>
                  <div className="bg-card rounded-lg p-4 shadow-sm">
                    <div className="text-2xl font-bold text-orange-500">
                      {notifications.filter(n => !n.isRead).length}
                    </div>
                    <div className="text-sm text-muted-foreground">Pending Reviews</div>
                  </div>
                </div>
              </div>

              {/* Create Record Section */}
              <div className="flex-1 overflow-hidden">
                <CreateRecordTab />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="view-records" className="h-full m-0">
            <ViewHealthRecordsTab 
              fromNotification={!!notificationRecordData} 
              notificationData={notificationRecordData}
            />
          </TabsContent>
          <TabsContent value="patient-management" className="h-full m-0">
            <div className="p-6 space-y-6 h-full flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <Users className="w-12 h-12 text-primary" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Treatment Plans</h2>
                <p className="text-muted-foreground max-w-sm">
                  Exciting features for managing treatment plans are coming soon! 🚀
                </p>
              </div>
              <div className="text-xs text-muted-foreground">
                Stay tuned for updates
              </div>
            </div>
          </TabsContent>
          <TabsContent value="prescriptions" className="h-full m-0">
            <PrescriptionsTab />
          </TabsContent>
        </Tabs>
      </div>

      {/* Bottom Tab Navigation - Fixed to bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t shadow-lg z-50">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 h-16 bg-transparent">
            <TabsTrigger 
              value="home" 
              className="flex flex-col gap-1 h-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Home size={20} />
              <span className="text-xs">Home</span>
            </TabsTrigger>
            <TabsTrigger 
              value="view-records" 
              className="flex flex-col gap-1 h-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Eye size={20} />
              <span className="text-xs">Records</span>
            </TabsTrigger>
            <TabsTrigger 
              value="patient-management" 
              className="flex flex-col gap-1 h-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Users size={20} />
              <span className="text-xs">Treatment</span>
            </TabsTrigger>
            <TabsTrigger 
              value="prescriptions" 
              className="flex flex-col gap-1 h-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Pill size={20} />
              <span className="text-xs">Prescriptions</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};