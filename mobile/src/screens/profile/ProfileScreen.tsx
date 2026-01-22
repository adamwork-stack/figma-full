import React, {useEffect} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import {useGetCurrentUserQuery} from '../../services/api/usersApi';
import {logoutUser} from '../../store/slices/authSlice';
import {Button, Card, Typography} from '../../components';
import {RootState, AppDispatch} from '../../store/store';

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const {user: authUser} = useSelector((state: RootState) => state.auth);
  const {data, refetch} = useGetCurrentUserQuery();

  useEffect(() => {
    refetch();
  }, [refetch]);

  const user = data?.data || authUser;

  const handleLogout = () => {
    dispatch(logoutUser());
    navigation.reset({
      index: 0,
      routes: [{name: 'Auth' as never}],
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Card style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            {user?.avatar ? (
              <Image source={{uri: user.avatar}} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Typography variant="h2">
                  {user?.firstName?.[0] || 'U'}
                  {user?.lastName?.[0] || ''}
                </Typography>
              </View>
            )}
          </View>

          <Typography variant="h2" style={styles.name}>
            {user?.firstName} {user?.lastName}
          </Typography>
          <Typography variant="body" style={styles.email}>
            {user?.email}
          </Typography>
          {user?.phone && (
            <Typography variant="body" style={styles.phone}>
              {user.phone}
            </Typography>
          )}
        </Card>

        <View style={styles.menu}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('EditProfile' as never)}>
            <Typography variant="body">Edit Profile</Typography>
            <Typography variant="caption">{'>'}</Typography>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('Notifications' as never)}>
            <Typography variant="body">Notifications</Typography>
            <Typography variant="caption">{'>'}</Typography>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('Settings' as never)}>
            <Typography variant="body">Settings</Typography>
            <Typography variant="caption">{'>'}</Typography>
          </TouchableOpacity>
        </View>

        <Button
          title="Logout"
          onPress={handleLogout}
          variant="secondary"
          fullWidth
          style={styles.logoutButton}
        />
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
  profileCard: {
    alignItems: 'center',
    paddingVertical: 32,
    marginBottom: 16,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    marginBottom: 8,
  },
  email: {
    color: '#666666',
    marginBottom: 4,
  },
  phone: {
    color: '#666666',
  },
  menu: {
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 8,
  },
  logoutButton: {
    marginTop: 16,
  },
});
