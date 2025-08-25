import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Eye, Users, Pill, Home, Bell } from "lucide-react";
import CreateRecordTab from "./CreateRecordTab";
import ViewHealthRecordsTab from "./ViewHealthRecordsTab";
import PatientManagementTab from "./PatientManagementTab";
import PrescriptionsTab from "./PrescriptionsTab";

export const MobileLayout = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      patientName: "Arjun Sharma",
      message: "Medical summary ready for review",
      timestamp: "2 min ago",
      isRead: false,
      recordId: "rec_001"
    },
    {
      id: "2", 
      patientName: "Priya Patel",
      message: "Processing completed",
      timestamp: "5 min ago",
      isRead: false,
      recordId: "rec_002"
    }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
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
            <div className="p-4 space-y-6 h-full">
              <h2 className="text-2xl font-bold">Welcome to 1hat doc app</h2>
              
              {/* Dashboard Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50 p-4 rounded-lg border">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">24</div>
                  <div className="text-sm text-blue-600/80 dark:text-blue-400/80">Total Patients</div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50 p-4 rounded-lg border">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">12</div>
                  <div className="text-sm text-green-600/80 dark:text-green-400/80">Today's Consultations</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50 p-4 rounded-lg border">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">8</div>
                  <div className="text-sm text-purple-600/80 dark:text-purple-400/80">Pending Reviews</div>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/50 p-4 rounded-lg border">
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">5</div>
                  <div className="text-sm text-orange-600/80 dark:text-orange-400/80">Follow-ups Due</div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setActiveTab("create-record")}
                    className="w-full p-4 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-lg flex items-center justify-between hover:from-primary/90 hover:to-primary/70 transition-all"
                  >
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5" />
                      <span className="font-medium">Record New Consultation</span>
                    </div>
                    <span className="text-sm opacity-80">→</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab("view-records")}
                    className="w-full p-4 bg-gradient-to-r from-secondary to-secondary/80 text-secondary-foreground rounded-lg flex items-center justify-between hover:from-secondary/90 hover:to-secondary/70 transition-all"
                  >
                    <div className="flex items-center space-x-3">
                      <Eye className="w-5 h-5" />
                      <span className="font-medium">View Patient Records</span>
                    </div>
                    <span className="text-sm opacity-80">→</span>
                  </button>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="create-record" className="h-full m-0">
            <CreateRecordTab />
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
          <TabsList className="grid w-full grid-cols-5 h-16 bg-transparent">
            <TabsTrigger 
              value="home" 
              className="flex flex-col gap-1 h-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Home size={20} />
              <span className="text-xs">Home</span>
            </TabsTrigger>
            <TabsTrigger 
              value="create-record" 
              className="flex flex-col gap-1 h-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <FileText size={20} />
              <span className="text-xs">Create</span>
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