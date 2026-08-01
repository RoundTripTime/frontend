import { type ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  type GestureResponderEvent,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

import { useAppTheme, type AppTheme } from '@/src/theme';

export type AppButtonVariant = 'danger' | 'ghost' | 'outline' | 'primary' | 'secondary';

type AppButtonProps = {
  children: ReactNode;
  disabled?: boolean;
  left?: ReactNode;
  loading?: boolean;
  onPress?: (event: GestureResponderEvent) => void;
  right?: ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  variant?: AppButtonVariant;
};

export function AppButton({
  children,
  disabled = false,
  left,
  loading = false,
  onPress,
  right,
  style,
  textStyle,
  variant = 'primary',
}: AppButtonProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const isDisabled = disabled || loading;
  const contentColor = getButtonContentColor(theme, variant);

  return (
    <Pressable
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.button,
        styles[variant],
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
    >
      {loading ? <ActivityIndicator color={contentColor} /> : left ? <View>{left}</View> : null}
      <Text style={[styles.text, { color: contentColor }, textStyle]}>{children}</Text>
      {right ? <View>{right}</View> : null}
    </Pressable>
  );
}

function getButtonContentColor(theme: AppTheme, variant: AppButtonVariant) {
  if (variant === 'outline' || variant === 'ghost' || variant === 'secondary') {
    return theme.semantic.primaryDeep;
  }

  return theme.semantic.onPrimary;
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    button: {
      alignItems: 'center',
      borderRadius: theme.radius.md,
      borderWidth: 1,
      flexDirection: 'row',
      gap: theme.spacing.sm,
      justifyContent: 'center',
      minWidth: '32%',
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
    },
    danger: {
      backgroundColor: theme.semantic.danger,
      borderColor: theme.semantic.danger,
    },
    disabled: { opacity: 0.45 },
    ghost: {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
    },
    outline: {
      backgroundColor: 'transparent',
      borderColor: theme.semantic.borderStrong,
    },
    pressed: { opacity: 0.84 },
    primary: {
      backgroundColor: theme.semantic.primary,
      borderColor: theme.semantic.primary,
    },
    secondary: {
      backgroundColor: theme.semantic.primarySoft,
      borderColor: theme.semantic.primarySoft,
    },
    text: {
      flexShrink: 1,
      fontWeight: '800',
      textAlign: 'center',
    },
  });
