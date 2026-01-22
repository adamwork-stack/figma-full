import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import {Card, Typography} from '../../components';

export const SettingsScreen: React.FC = () => {
  const [pushNotifications, setPushNotifications] = React.useState(true);
  const [emailNotifications, setEmailNotifications] = React.useState(true);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Card style={styles.section}>
          <Typography variant="h4" style={styles.sectionTitle}>
            Notifications
          </Typography>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Typography variant="body">Push Notifications</Typography>
              <Typography variant="caption" style={styles.settingDescription}>
                Receive push notifications on your device
              </Typography>
            </View>
            <Switch
              value={pushNotifications}
              onValueChange={setPushNotifications}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Typography variant="body">Email Notifications</Typography>
              <Typography variant="caption" style={styles.settingDescription}>
                Receive notifications via email
              </Typography>
            </View>
            <Switch
              value={emailNotifications}
              onValueChange={setEmailNotifications}
            />
          </View>
        </Card>

        <Card style={styles.section}>
          <Typography variant="h4" style={styles.sectionTitle}>
            About
          </Typography>

          <TouchableOpacity style={styles.menuItem}>
            <Typography variant="body">Terms & Conditions</Typography>
            <Typography variant="caption">{'>'}</Typography>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Typography variant="body">Privacy Policy</Typography>
            <Typography variant="caption">{'>'}</Typography>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Typography variant="body">App Version</Typography>
            <Typography variant="caption">1.0.0</Typography>
          </TouchableOpacity>
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
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingDescription: {
    marginTop: 4,
    color: '#666666',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
});
