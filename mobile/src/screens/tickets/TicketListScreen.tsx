import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useGetTicketsQuery} from '../../services/api/ticketsApi';
import {Card, Typography} from '../../components';
import {Ticket} from '../../types/api';

export const TicketListScreen: React.FC = () => {
  const navigation = useNavigation();
  const {data, isLoading, refetch} = useGetTicketsQuery();

  const renderTicketItem = ({item}: {item: Ticket}) => {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('TicketDetail' as never, {ticketId: item.id} as never)
        }>
        <Card style={styles.ticketCard}>
          <Typography variant="h3" style={styles.eventTitle}>
            {item.event.title}
          </Typography>
          <Typography variant="body" style={styles.ticketInfo}>
            {item.ticketType.name} × {item.quantity}
          </Typography>
          <Typography variant="caption">
            {new Date(item.event.startDate).toLocaleDateString()}
          </Typography>
          <View style={styles.statusContainer}>
            <Typography
              variant="caption"
              style={[
                styles.status,
                item.status === 'confirmed' && styles.statusConfirmed,
              ]}>
              {item.status.toUpperCase()}
            </Typography>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data?.data || []}
        renderItem={renderTicketItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Typography variant="h3">No tickets yet</Typography>
            <Typography variant="body" style={styles.emptyText}>
              Purchase tickets to events to see them here
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
  listContent: {
    padding: 16,
  },
  ticketCard: {
    marginBottom: 16,
  },
  eventTitle: {
    marginBottom: 8,
  },
  ticketInfo: {
    marginBottom: 4,
    color: '#666666',
  },
  statusContainer: {
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  status: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: '#E0E0E0',
    color: '#666666',
  },
  statusConfirmed: {
    backgroundColor: '#4CAF50',
    color: '#FFFFFF',
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
