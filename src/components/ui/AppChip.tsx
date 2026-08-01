import { type ReactNode } from 'react';
import {
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

export type AppChipVariant = 'accent' | 'default' | 'primary';

type AppChipProps = {
  children: ReactNode;
  disabled?: boolean;
  left?: ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
  right?: ReactNode;
  selected?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  variant?: AppChipVariant;
};

export function AppChip({
  children,
  disabled = false,
  left,
  onPress,
  right,
  selected = false,
  style,
  textStyle,
  variant = 'default',
}: AppChipProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <Pressable
      disabled={disabled}
      style={({ pressed }) => [
        styles.chip,
        styles[variant],
        selected && styles.selected,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
    >
      {left ? <View>{left}</View> : null}
      <Text style={[styles.text, selected && styles.selectedText, textStyle]}>{children}</Text>
      {right ? <View>{right}</View> : null}
    </Pressable>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    accent: {
      backgroundColor: theme.semantic.accentSoft,
    },
    chip: {
      alignItems: 'center',
      borderRadius: theme.radius.xl,
      flexDirection: 'row',
      gap: theme.spacing.xs,
      justifyContent: 'center',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
    },
    default: {
      backgroundColor: theme.semantic.surfaceMuted,
    },
    disabled: { opacity: 0.45 },
    pressed: { opacity: 0.84 },
    primary: {
      backgroundColor: theme.semantic.primarySoft,
    },
    selected: {
      backgroundColor: theme.semantic.primarySoft,
    },
    selectedText: {
      color: theme.semantic.primaryDeep,
      fontWeight: '800',
    },
    text: {
      color: theme.semantic.textSecondary,
      fontWeight: '700',
      textAlign: 'center',
    },
  });
