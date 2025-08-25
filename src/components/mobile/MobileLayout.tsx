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
            <div className="p-4 space-y-6 h-full">
              <h2 className="text-2xl font-bold">Welcome to 1hat doc app</h2>
              
              {/* Stats Toggle */}
              <div className="flex justify-center">
                <div className="bg-muted p-1 rounded-lg">
                  <div className="flex">
                    <button
                      onClick={() => setStatsToggle('today')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        statsToggle === 'today'
                          ? 'bg-background text-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Today
                    </button>
                    <button
                      onClick={() => setStatsToggle('weekly')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        statsToggle === 'weekly'
                          ? 'bg-background text-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Weekly
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Dashboard Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50 p-4 rounded-lg border">
                  <div className="flex items-center space-x-2 mb-2">
                    <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm text-blue-600/80 dark:text-blue-400/80">Total Patients</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {statsToggle === 'today' ? '24' : '156'}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50 p-4 rounded-lg border">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="text-sm text-green-600/80 dark:text-green-400/80">Consultations</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {statsToggle === 'today' ? '12' : '89'}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50 p-4 rounded-lg border">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    <span className="text-sm text-purple-600/80 dark:text-purple-400/80">Pending Reviews</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {statsToggle === 'today' ? '8' : '23'}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/50 p-4 rounded-lg border">
                  <div className="flex items-center space-x-2 mb-2">
                    <Bell className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    <span className="text-sm text-orange-600/80 dark:text-orange-400/80">Follow-ups Due</span>
                  </div>
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {statsToggle === 'today' ? '5' : '18'}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-center">What are you looking to do?</h3>
                <div className="grid grid-cols-2 gap-4">
                  {/* Record New Consultation */}
                  <button
                    onClick={() => setActiveTab("create-record")}
                    className="aspect-square bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 flex flex-col items-center justify-center space-y-3 hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105"
                  >
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-sm">Record New</div>
                      <div className="font-semibold text-sm">Consultation</div>
                    </div>
                  </button>
                  
                  {/* View Patient Records */}
                  <button
                    onClick={() => setActiveTab("view-records")}
                    className="aspect-square bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl p-6 flex flex-col items-center justify-center space-y-3 hover:from-orange-600 hover:to-orange-700 transition-all transform hover:scale-105"
                  >
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <Eye className="w-6 h-6" />
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-sm">View Patient</div>
                      <div className="font-semibold text-sm">Records</div>
                    </div>
                  </button>
                  
                  {/* Manage Prescriptions */}
                  <button
                    onClick={() => setActiveTab("prescriptions")}
                    className="aspect-square bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-6 flex flex-col items-center justify-center space-y-3 hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105"
                  >
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <Pill className="w-6 h-6" />
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-sm">Manage</div>
                      <div className="font-semibold text-sm">Prescriptions</div>
                    </div>
                  </button>
                  
                  {/* Upload Records */}
                  <button
                    className="aspect-square bg-gradient-to-br from-red-500 to-red-600 text-white rounded-2xl p-6 flex flex-col items-center justify-center space-y-3 hover:from-red-600 hover:to-red-700 transition-all transform hover:scale-105"
                  >
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-sm">Upload</div>
                      <div className="font-semibold text-sm">Records</div>
                    </div>
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