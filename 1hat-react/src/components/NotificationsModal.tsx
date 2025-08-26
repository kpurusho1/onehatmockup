import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
  Alert,
  ScrollView,
} from 'react-native';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  date: string;
  read: boolean;
  type: 'appointment' | 'message' | 'reminder' | 'system' | 'update';
}

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Appointment Reminder',
    message: 'You have an appointment with Sarah Johnson tomorrow at 10:00 AM',
    time: '10:23 AM',
    date: 'Today',
    read: false,
    type: 'appointment',
  },
  {
    id: '2',
    title: 'New Message',
    message: 'Dr. Michael Lee sent you a message regarding patient case #4582',
    time: '9:15 AM',
    date: 'Today',
    read: false,
    type: 'message',
  },
  {
    id: '3',
    title: 'Prescription Update',
    message: 'Prescription for Thomas Wilson has been approved',
    time: '8:45 AM',
    date: 'Today',
    read: true,
    type: 'update',
  },
  {
    id: '4',
    title: 'System Update',
    message: '1hat app has been updated to version 1.2.0',
    time: '7:30 AM',
    date: 'Today',
    read: true,
    type: 'system',
  },
];

interface FilterOption {
  label: string;
  value: string | null;
}

interface ScrollableFilterProps {
  options: FilterOption[];
  selectedValue: string | null;
  onSelect: (value: string | null) => void;
}

const ScrollableFilter: React.FC<ScrollableFilterProps> = ({ 
  options, 
  selectedValue, 
  onSelect 
}) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollableFilter}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.label}
          style={[
            styles.filterOption,
            selectedValue === option.value && styles.selectedFilterOption
          ]}
          onPress={() => onSelect(option.value)}
        >
          <Text style={[
            styles.filterOptionText,
            selectedValue === option.value && styles.selectedFilterOptionText
          ]}>
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

interface NotificationsModalProps {
  visible: boolean;
  onClose: () => void;
}

const NotificationsModal: React.FC<NotificationsModalProps> = ({ visible, onClose }) => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<string | null>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'appointment':
        return '🗓️';
      case 'message':
        return '✉️';
      case 'reminder':
        return '⏰';
      case 'system':
        return '🔧';
      case 'update':
        return '🔔';
      default:
        return '📋';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    if (unreadCount === 0) {
      Alert.alert('No Unread Notifications', 'All notifications are already read.');
      return;
    }
    
    setNotifications(
      notifications.map(notification => ({ ...notification, read: true }))
    );
    
    Alert.alert('Success', 'All notifications marked as read');
  };

  const deleteNotification = (id: string) => {
    Alert.alert(
      'Delete Notification',
      'Are you sure you want to delete this notification?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setNotifications(notifications.filter(notification => notification.id !== id));
          }
        },
      ]
    );
  };

  const filteredNotifications = filter 
    ? notifications.filter(notification => notification.type === filter)
    : notifications;

  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity 
      style={[styles.notificationItem, !item.read && styles.unreadNotification]}
      onPress={() => {
        markAsRead(item.id);
        // In a real app, this would navigate to the relevant screen
        Alert.alert(item.title, item.message);
      }}
    >
      <View style={styles.notificationIconContainer}>
        <Text style={styles.notificationIcon}>{getNotificationIcon(item.type)}</Text>
      </View>
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text style={styles.notificationTitle}>{item.title}</Text>
          <Text style={styles.notificationTime}>{item.time}</Text>
        </View>
        <Text style={styles.notificationMessage} numberOfLines={2}>
          {item.message}
        </Text>
        <Text style={styles.notificationDate}>{item.date}</Text>
      </View>
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => deleteNotification(item.id)}
      >
        <Text style={styles.deleteIcon}>🗑️</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📭</Text>
      <Text style={styles.emptyTitle}>No Notifications</Text>
      <Text style={styles.emptyMessage}>
        You don't have any {filter ? `${filter} ` : ''}notifications at the moment.
      </Text>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Notifications</Text>
            {unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadCount}>{unreadCount}</Text>
              </View>
            )}
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.filterContainer}>
            <ScrollableFilter 
              options={[
                { label: 'All', value: null },
                { label: 'Appointments', value: 'appointment' },
                { label: 'Messages', value: 'message' },
                { label: 'Reminders', value: 'reminder' },
                { label: 'System', value: 'system' },
                { label: 'Updates', value: 'update' },
              ]}
              selectedValue={filter}
              onSelect={setFilter}
            />
          </View>

          <FlatList
            data={filteredNotifications}
            renderItem={renderNotificationItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.notificationsList}
            ListEmptyComponent={renderEmptyComponent}
          />

          <View style={styles.actionBar}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={markAllAsRead}
              disabled={unreadCount === 0}
            >
              <Text style={[
                styles.actionButtonText, 
                unreadCount === 0 && styles.disabledButtonText
              ]}>
                Mark All as Read
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#f8fafc',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '80%',
  },
  modalHeader: {
    backgroundColor: '#1c2f7f',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  filterContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    backgroundColor: 'white',
  },
  scrollableFilter: {
    paddingHorizontal: 16,
  },
  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    marginRight: 8,
  },
  selectedFilterOption: {
    backgroundColor: '#1c2f7f',
  },
  filterOptionText: {
    color: '#64748b',
    fontWeight: '500',
  },
  selectedFilterOptionText: {
    color: 'white',
  },
  notificationsList: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  notificationItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  unreadNotification: {
    borderLeftWidth: 4,
    borderLeftColor: '#1c2f7f',
  },
  notificationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationIcon: {
    fontSize: 20,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  notificationTime: {
    fontSize: 12,
    color: '#94a3b8',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 6,
  },
  notificationDate: {
    fontSize: 12,
    color: '#94a3b8',
  },
  deleteButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteIcon: {
    fontSize: 16,
    color: '#94a3b8',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  actionBar: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    backgroundColor: 'white',
  },
  actionButton: {
    backgroundColor: '#f1f5f9',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    fontWeight: '500',
    color: '#1c2f7f',
  },
  disabledButtonText: {
    opacity: 0.5,
  },
  unreadBadge: {
    backgroundColor: '#ef4444',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 10,
  },
  unreadCount: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default NotificationsModal;
