import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  TextInput,
} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import {useGetEventQuery} from '../../services/api/eventsApi';
import {usePurchaseTicketsMutation} from '../../services/api/ticketsApi';
import {useCreatePaymentIntentMutation} from '../../services/api/paymentsApi';
import {Button, Card, Typography, Input} from '../../components';
import {useTheme} from '../../hooks/useTheme';

export const CheckoutScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const {eventId} = route.params as {eventId: string};
  const {data: eventData} = useGetEventQuery(eventId);
  const [purchaseTickets, {isLoading}] = usePurchaseTicketsMutation();
  const [createPaymentIntent] = useCreatePaymentIntentMutation();

  const [selectedTickets, setSelectedTickets] = useState<
    Array<{
      ticketTypeId: string;
      quantity: number;
      attendees: Array<{
        firstName: string;
        lastName: string;
        email?: string;
      }>;
    }>
  >([]);

  const event = eventData?.data;

  const calculateTotal = () => {
    if (!event) return 0;
    return selectedTickets.reduce((total, ticket) => {
      const ticketType = event.ticketTypes?.find(
        tt => tt.id === ticket.ticketTypeId,
      );
      return total + (ticketType?.price || 0) * ticket.quantity;
    }, 0);
  };

  const handlePurchase = async () => {
    if (!event || selectedTickets.length === 0) {
      Alert.alert('Error', 'Please select tickets');
      return;
    }

    try {
      // Create payment intent
      const paymentIntentResult = await createPaymentIntent({
        amount: calculateTotal(),
        currency: 'USD',
        eventId: event.id,
      }).unwrap();

      if (!paymentIntentResult.data?.clientSecret) {
        throw new Error('Failed to create payment intent');
      }

      // TODO: Integrate Stripe payment sheet here
      // For now, simulate payment success
      Alert.alert('Success', 'Payment processed successfully', [
        {
          text: 'OK',
          onPress: () => {
            navigation.navigate('TicketList' as never);
          },
        },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Payment failed');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {event && (
          <>
            <Card style={styles.eventCard}>
              <Typography variant="h3">{event.title}</Typography>
              <Typography variant="body">
                {new Date(event.startDate).toLocaleDateString()}
              </Typography>
            </Card>

            <Card style={styles.ticketsCard}>
              <Typography variant="h4" style={styles.sectionTitle}>
                Select Tickets
              </Typography>
              {event.ticketTypes?.map(ticketType => (
                <View key={ticketType.id} style={styles.ticketTypeRow}>
                  <View>
                    <Typography variant="body">{ticketType.name}</Typography>
                    <Typography variant="caption">
                      ${ticketType.price} each
                    </Typography>
                  </View>
                  <TextInput
                    style={styles.quantityInput}
                    keyboardType="numeric"
                    placeholder="0"
                    onChangeText={text => {
                      const quantity = parseInt(text) || 0;
                      if (quantity > 0) {
                        setSelectedTickets([
                          {
                            ticketTypeId: ticketType.id,
                            quantity,
                            attendees: Array(quantity)
                              .fill(0)
                              .map(() => ({firstName: '', lastName: ''})),
                          },
                        ]);
                      } else {
                        setSelectedTickets([]);
                      }
                    }}
                  />
                </View>
              ))}
            </Card>

            <Card style={styles.summaryCard}>
              <Typography variant="h4" style={styles.sectionTitle}>
                Order Summary
              </Typography>
              <View style={styles.summaryRow}>
                <Typography variant="body">Subtotal</Typography>
                <Typography variant="body">${calculateTotal().toFixed(2)}</Typography>
              </View>
              <View style={styles.summaryRow}>
                <Typography variant="body">Total</Typography>
                <Typography variant="h4">${calculateTotal().toFixed(2)}</Typography>
              </View>
            </Card>

            <Button
              title="Complete Purchase"
              onPress={handlePurchase}
              loading={isLoading}
              fullWidth
              style={styles.purchaseButton}
            />
          </>
        )}
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
  eventCard: {
    marginBottom: 16,
  },
  ticketsCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  ticketTypeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 8,
    width: 60,
    textAlign: 'center',
  },
  summaryCard: {
    marginBottom: 24,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  purchaseButton: {
    marginBottom: 32,
  },
});
