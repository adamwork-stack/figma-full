import React from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import {theme} from '../../theme/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: keyof typeof theme.spacing;
  shadow?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  padding = 'md',
  shadow = true,
}) => {
  return (
    <View
      style={[
        styles.card,
        {padding: theme.spacing[padding]},
        shadow && styles.shadow,
        style,
      ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: theme.spacing.md,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
