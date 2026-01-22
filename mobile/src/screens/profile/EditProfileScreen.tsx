import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useGetCurrentUserQuery, useUpdateUserMutation} from '../../services/api/usersApi';
import {Button, Input, Typography} from '../../components';

export const EditProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const {data} = useGetCurrentUserQuery();
  const [updateUser, {isLoading}] = useUpdateUserMutation();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (data?.data) {
      setFirstName(data.data.firstName || '');
      setLastName(data.data.lastName || '');
      setEmail(data.data.email || '');
      setPhone(data.data.phone || '');
    }
  }, [data]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await updateUser({
        firstName,
        lastName,
        email,
        phone: phone || undefined,
      }).unwrap();

      Alert.alert('Success', 'Profile updated successfully', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update profile');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">
        <View style={styles.content}>
          <Typography variant="h1" style={styles.title}>
            Edit Profile
          </Typography>

          <View style={styles.form}>
            <Input
              label="First Name"
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Enter your first name"
              autoCapitalize="words"
              error={errors.firstName}
            />

            <Input
              label="Last Name"
              value={lastName}
              onChangeText={setLastName}
              placeholder="Enter your last name"
              autoCapitalize="words"
              error={errors.lastName}
            />

            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              error={errors.email}
            />

            <Input
              label="Phone (Optional)"
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              error={errors.phone}
            />

            <Button
              title="Save Changes"
              onPress={handleSave}
              loading={isLoading}
              fullWidth
              style={styles.saveButton}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  content: {
    width: '100%',
  },
  title: {
    marginBottom: 32,
  },
  form: {
    width: '100%',
  },
  saveButton: {
    marginTop: 16,
  },
});
