import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import {useGetEventQuery} from '../../services/api/eventsApi';
import {Button, Typography, Card} from '../../components';
import {useTheme} from '../../hooks/useTheme';

export const EventDetailScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const {eventId} = route.params as {eventId: string};
  const {data, isLoading} = useGetEventQuery(eventId);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Typography variant="h3">Loading...</Typography>
      </View>
    );
  }

  if (!data?.data) {
    return (
      <View style={styles.container}>
        <Typography variant="h3">Event not found</Typography>
      </View>
    );
  }

  const event = data.data;

  return (
    <ScrollView style={styles.container}>
      {event.image && (
        <View style={styles.imageContainer}>
          <Typography variant="caption">Event Image</Typography>
        </View>
      )}

      <View style={styles.content}>
        <Typography variant="h1" style={styles.title}>
          {event.title}
        </Typography>

        <View style={styles.infoRow}>
          <Typography variant="body">
            {new Date(event.startDate).toLocaleDateString()} -{' '}
            {new Date(event.endDate).toLocaleDateString()}
          </Typography>
        </View>

        <View style={styles.infoRow}>
          <Typography variant="body">
            {event.location.name}
          </Typography>
          <Typography variant="caption">
            {event.location.address}, {event.location.city},{' '}
            {event.location.country}
          </Typography>
        </View>

        <Card style={styles.descriptionCard}>
          <Typography variant="h4" style={styles.sectionTitle}>
            Description
          </Typography>
          <Typography variant="body">{event.description}</Typography>
        </Card>

        <Card style={styles.ticketsCard}>
          <Typography variant="h4" style={styles.sectionTitle}>
            Tickets
          </Typography>
          {event.ticketTypes?.map(ticketType => (
            <View key={ticketType.id} style={styles.ticketType}>
              <Typography variant="body">{ticketType.name}</Typography>
              <Typography variant="body">
                ${ticketType.price} ({ticketType.available} available)
              </Typography>
            </View>
          ))}
        </Card>

        <Button
          title="Buy Tickets"
          onPress={() =>
            navigation.navigate('Checkout' as never, {eventId: event.id} as never)
          }
          fullWidth
          style={styles.buyButton}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  imageContainer: {
    width: '100%',
    height: 300,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 16,
  },
  title: {
    marginBottom: 16,
  },
  infoRow: {
    marginBottom: 12,
  },
  descriptionCard: {
    marginTop: 24,
    marginBottom: 16,
  },
  ticketsCard: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  ticketType: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  buyButton: {
    marginTop: 16,
  },
});
