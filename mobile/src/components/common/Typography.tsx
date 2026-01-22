import React from 'react';
import {Text, StyleSheet, TextProps, TextStyle} from 'react-native';
import {theme} from '../../theme/theme';

export type TypographyVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'body'
  | 'caption'
  | 'small';

interface TypographyProps extends TextProps {
  variant?: TypographyVariant;
  color?: string;
  weight?: 'regular' | 'medium' | 'bold';
  align?: 'left' | 'center' | 'right';
  style?: TextStyle;
}

export const Typography: React.FC<TypographyProps> = ({
  variant = 'body',
  color,
  weight,
  align = 'left',
  style,
  children,
  ...textProps
}) => {
  const getTextStyle = (): TextStyle => {
    const variantStyles: Record<TypographyVariant, TextStyle> = {
      h1: {
        fontSize: theme.typography.fontSize.h1,
        lineHeight: theme.typography.lineHeight.h1,
        fontWeight: theme.typography.fontWeight.bold,
      },
      h2: {
        fontSize: theme.typography.fontSize.h2,
        lineHeight: theme.typography.lineHeight.h2,
        fontWeight: theme.typography.fontWeight.bold,
      },
      h3: {
        fontSize: theme.typography.fontSize.h3,
        lineHeight: theme.typography.lineHeight.h3,
        fontWeight: theme.typography.fontWeight.bold,
      },
      h4: {
        fontSize: theme.typography.fontSize.h4,
        lineHeight: theme.typography.lineHeight.h4,
        fontWeight: theme.typography.fontWeight.medium,
      },
      body: {
        fontSize: theme.typography.fontSize.body,
        lineHeight: theme.typography.lineHeight.body,
        fontWeight: theme.typography.fontWeight.regular,
      },
      caption: {
        fontSize: theme.typography.fontSize.caption,
        lineHeight: theme.typography.lineHeight.caption,
        fontWeight: theme.typography.fontWeight.regular,
      },
      small: {
        fontSize: theme.typography.fontSize.small,
        lineHeight: theme.typography.lineHeight.small,
        fontWeight: theme.typography.fontWeight.regular,
      },
    };

    return {
      ...variantStyles[variant],
      color: color || theme.colors.text.primary,
      fontWeight: weight ? theme.typography.fontWeight[weight] : undefined,
      textAlign: align,
      ...style,
    };
  };

  return (
    <Text style={getTextStyle()} {...textProps}>
      {children}
    </Text>
  );
};
