import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import {useRoute} from '@react-navigation/native';
import {useGetTicketQuery} from '../../services/api/ticketsApi';
import {Card, Typography} from '../../components';

export const TicketDetailScreen: React.FC = () => {
  const route = useRoute();
  const {ticketId} = route.params as {ticketId: string};
  const {data, isLoading} = useGetTicketQuery(ticketId);

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
        <Typography variant="h3">Ticket not found</Typography>
      </View>
    );
  }

  const ticket = data.data;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Card style={styles.ticketCard}>
          <Typography variant="h1" style={styles.eventTitle}>
            {ticket.event.title}
          </Typography>

          <View style={styles.infoSection}>
            <Typography variant="body">
              {new Date(ticket.event.startDate).toLocaleDateString()} -{' '}
              {new Date(ticket.event.endDate).toLocaleDateString()}
            </Typography>
            <Typography variant="caption">
              {ticket.event.location.name}
            </Typography>
            <Typography variant="caption">
              {ticket.event.location.address}, {ticket.event.location.city}
            </Typography>
          </View>

          <View style={styles.ticketInfo}>
            <Typography variant="h4">Ticket Information</Typography>
            <View style={styles.infoRow}>
              <Typography variant="body">Type:</Typography>
              <Typography variant="body">{ticket.ticketType.name}</Typography>
            </View>
            <View style={styles.infoRow}>
              <Typography variant="body">Quantity:</Typography>
              <Typography variant="body">{ticket.quantity}</Typography>
            </View>
            <View style={styles.infoRow}>
              <Typography variant="body">Total Paid:</Typography>
              <Typography variant="body">
                ${ticket.totalPrice} {ticket.currency}
              </Typography>
            </View>
            <View style={styles.infoRow}>
              <Typography variant="body">Status:</Typography>
              <Typography variant="body">{ticket.status}</Typography>
            </View>
          </View>

          {ticket.qrCode && (
            <View style={styles.qrSection}>
              <Typography variant="h4" style={styles.qrTitle}>
                QR Code
              </Typography>
              <View style={styles.qrContainer}>
                <Typography variant="caption">
                  QR Code will be displayed here
                </Typography>
                {/* In a real implementation, use react-native-qrcode-svg */}
              </View>
            </View>
          )}
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    padding: 16,
  },
  ticketCard: {
    padding: 20,
  },
  eventTitle: {
    marginBottom: 16,
  },
  infoSection: {
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  ticketInfo: {
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  qrSection: {
    marginTop: 24,
  },
  qrTitle: {
    marginBottom: 16,
    textAlign: 'center',
  },
  qrContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
});
