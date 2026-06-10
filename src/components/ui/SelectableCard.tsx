import { type ReactNode } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type GestureResponderEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { useAppTheme, type AppTheme } from '@/src/theme';

type SelectableCardProps = {
  children?: ReactNode;
  disabled?: boolean;
  left?: ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
  right?: ReactNode;
  selected?: boolean;
  showIndicator?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function SelectableCard({
  children,
  disabled = false,
  left,
  onPress,
  right,
  selected = false,
  showIndicator = true,
  style,
}: SelectableCardProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <Pressable
      disabled={disabled}
      style={({ pressed }) => [
        styles.card,
        selected && styles.selectedCard,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
    >
      {left ? <View>{left}</View> : null}
      <View style={styles.content}>{children}</View>
      {right ? <View>{right}</View> : null}
      {showIndicator ? (
        <View style={[styles.indicator, selected && styles.selectedIndicator]}>
          <Text style={styles.indicatorText}>{selected ? '✓' : ''}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    card: {
      alignItems: 'center',
      backgroundColor: theme.semantic.surface,
      borderColor: theme.semantic.border,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      flexDirection: 'row',
      gap: theme.spacing.md,
      minWidth: 0,
      padding: theme.spacing.md,
    },
    content: {
      flex: 1,
      gap: theme.spacing.sm,
      minWidth: 0,
    },
    disabled: { opacity: 0.45 },
    indicator: {
      alignItems: 'center',
      borderColor: theme.semantic.borderStrong,
      borderRadius: theme.radius.lg,
      borderWidth: 1,
      justifyContent: 'center',
      minHeight: theme.spacing.xl,
      minWidth: theme.spacing.xl,
    },
    indicatorText: {
      color: theme.semantic.onPrimary,
      fontWeight: '900',
      textAlign: 'center',
    },
    pressed: { opacity: 0.84 },
    selectedCard: {
      backgroundColor: theme.semantic.primarySoft,
      borderColor: theme.semantic.primary,
    },
    selectedIndicator: {
      backgroundColor: theme.semantic.primary,
      borderColor: theme.semantic.primary,
    },
  });
