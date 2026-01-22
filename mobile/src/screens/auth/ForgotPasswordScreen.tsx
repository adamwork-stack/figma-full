import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Button, Input, Typography} from '../../components';
import {useTheme} from '../../hooks/useTheme';

export const ForgotPasswordScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (): boolean => {
    setEmailError('');
    if (!email.trim()) {
      setEmailError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email');
      return false;
    }
    return true;
  };

  const handleResetPassword = async () => {
    if (!validateEmail()) {
      return;
    }

    setIsLoading(true);
    // TODO: Implement forgot password API call
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        'Email Sent',
        'If an account exists with this email, you will receive password reset instructions.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ],
      );
    }, 1000);
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
            Forgot Password?
          </Typography>
          <Typography variant="body" style={styles.subtitle}>
            Enter your email address and we'll send you instructions to reset
            your password.
          </Typography>

          <View style={styles.form}>
            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              error={emailError}
            />

            <Button
              title="Send Reset Instructions"
              onPress={handleResetPassword}
              loading={isLoading}
              fullWidth
              style={styles.resetButton}
            />

            <Button
              title="Back to Sign In"
              onPress={() => navigation.goBack()}
              variant="text"
              style={styles.backButton}
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
    justifyContent: 'center',
    padding: 24,
  },
  content: {
    width: '100%',
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    marginBottom: 32,
    textAlign: 'center',
    color: '#666666',
  },
  form: {
    width: '100%',
  },
  resetButton: {
    marginTop: 16,
  },
  backButton: {
    marginTop: 16,
  },
});
