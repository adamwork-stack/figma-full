import {NavigatorScreenParams} from '@react-navigation/native';

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
};

export type AuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Events: undefined;
  Tickets: undefined;
  Profile: undefined;
};

export type EventsStackParamList = {
  EventList: undefined;
  EventDetail: {eventId: string};
  Search: undefined;
  Filters: undefined;
};

export type TicketsStackParamList = {
  TicketList: undefined;
  TicketDetail: {ticketId: string};
  Checkout: {eventId: string};
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
