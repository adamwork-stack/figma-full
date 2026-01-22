import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import {useGetNotificationsQuery} from '../../services/api/notificationsApi';
import {useMarkAsReadMutation, useMarkAllAsReadMutation} from '../../services/api/notificationsApi';
import {Card, Typography, Button} from '../../components';
import {Notification} from '../../types/api';

export const NotificationsScreen: React.FC = () => {
  const [unreadOnly, setUnreadOnly] = useState(false);
  const {data, isLoading, refetch} = useGetNotificationsQuery({
    unreadOnly: unreadOnly || undefined,
  });
  const [markAsRead] = useMarkAsReadMutation();
  const [markAllAsRead] = useMarkAllAsReadMutation();

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const renderNotificationItem = ({item}: {item: Notification}) => {
    return (
      <TouchableOpacity
        onPress={() => !item.read && handleMarkAsRead(item.id)}>
        <Card
          style={[
            styles.notificationCard,
            !item.read && styles.unreadCard,
          ]}>
          <Typography variant="h4" style={styles.notificationTitle}>
            {item.title}
          </Typography>
          <Typography variant="body" style={styles.notificationMessage}>
            {item.message}
          </Typography>
          <Typography variant="caption" style={styles.notificationDate}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Typography>
          {!item.read && (
            <View style={styles.unreadIndicator} />
          )}
        </Card>
      </TouchableOpacity>
    );
  };

  const unreadCount = data?.data?.filter(n => !n.read).length || 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button
          title={unreadOnly ? 'Show All' : 'Show Unread Only'}
          onPress={() => setUnreadOnly(!unreadOnly)}
          variant="tertiary"
          size="small"
        />
        {unreadCount > 0 && (
          <Button
            title="Mark All Read"
            onPress={handleMarkAllAsRead}
            variant="tertiary"
            size="small"
          />
        )}
      </View>

      <FlatList
        data={data?.data || []}
        renderItem={renderNotificationItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Typography variant="h3">No notifications</Typography>
            <Typography variant="body" style={styles.emptyText}>
              {unreadOnly
                ? 'You have no unread notifications'
                : 'You have no notifications yet'}
            </Typography>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  listContent: {
    padding: 16,
  },
  notificationCard: {
    marginBottom: 12,
    position: 'relative',
  },
  unreadCard: {
    backgroundColor: '#F0F8FF',
  },
  notificationTitle: {
    marginBottom: 8,
  },
  notificationMessage: {
    marginBottom: 8,
    color: '#666666',
  },
  notificationDate: {
    color: '#999999',
  },
  unreadIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#007AFF',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    marginTop: 8,
    color: '#666666',
    textAlign: 'center',
  },
});
