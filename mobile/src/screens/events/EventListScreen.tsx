import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useGetEventsQuery} from '../../services/api/eventsApi';
import {Card, Typography} from '../../components';
import {Event} from '../../types/api';
import {useTheme} from '../../hooks/useTheme';

export const EventListScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const [page, setPage] = useState(1);
  const {data, isLoading, refetch, isFetching} = useGetEventsQuery({
    page,
    limit: 20,
  });

  const handleRefresh = () => {
    setPage(1);
    refetch();
  };

  const handleLoadMore = () => {
    if (data?.pagination.hasNext && !isFetching) {
      setPage(page + 1);
    }
  };

  const renderEventItem = ({item}: {item: Event}) => {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('EventDetail' as never, {eventId: item.id} as never)
        }>
        <Card style={styles.eventCard}>
          {item.image && (
            <View style={styles.imageContainer}>
              <Typography variant="caption">Event Image</Typography>
            </View>
          )}
          <Typography variant="h3" style={styles.eventTitle}>
            {item.title}
          </Typography>
          <Typography variant="body" style={styles.eventDescription}>
            {item.description.substring(0, 100)}...
          </Typography>
          <View style={styles.eventInfo}>
            <Typography variant="caption">
              {new Date(item.startDate).toLocaleDateString()}
            </Typography>
            <Typography variant="caption">
              {item.location.city}, {item.location.country}
            </Typography>
          </View>
          <Typography variant="body" style={styles.price}>
            ${item.price.min} - ${item.price.max}
          </Typography>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data?.data || []}
        renderItem={renderEventItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Typography variant="h3">No events found</Typography>
            <Typography variant="body" style={styles.emptyText}>
              Try adjusting your filters or check back later
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
  eventCard: {
    marginBottom: 16,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventTitle: {
    marginBottom: 8,
  },
  eventDescription: {
    marginBottom: 12,
    color: '#666666',
  },
  eventInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  price: {
    fontWeight: '700',
    color: '#000000',
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
