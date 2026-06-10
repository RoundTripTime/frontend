import { type ReactNode } from 'react';
import {
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

import { useAppTheme, type AppTheme } from '@/src/theme';

export type BadgeVariant = 'danger' | 'default' | 'primary' | 'success' | 'warning';

type BadgeProps = {
  children: ReactNode;
  left?: ReactNode;
  right?: ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  variant?: BadgeVariant;
};

export function Badge({
  children,
  left,
  right,
  style,
  textStyle,
  variant = 'default',
}: BadgeProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View style={[styles.badge, styles[variant], style]}>
      {left ? <View>{left}</View> : null}
      <Text style={[styles.text, styles[`${variant}Text`], textStyle]}>{children}</Text>
      {right ? <View>{right}</View> : null}
    </View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    badge: {
      alignItems: 'center',
      alignSelf: 'flex-start',
      borderRadius: theme.radius.xl,
      flexDirection: 'row',
      gap: theme.spacing.xs,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
    },
    danger: { backgroundColor: theme.semantic.dangerSoft },
    dangerText: { color: theme.semantic.danger },
    default: { backgroundColor: theme.semantic.surfaceMuted },
    defaultText: { color: theme.semantic.textSecondary },
    primary: { backgroundColor: theme.semantic.primary },
    primaryText: { color: theme.semantic.onPrimary },
    success: { backgroundColor: theme.semantic.successSoft },
    successText: { color: theme.semantic.success },
    text: {
      fontSize: theme.typography.size.caption,
      fontWeight: '800',
      textAlign: 'center',
    },
    warning: { backgroundColor: theme.semantic.warningSoft },
    warningText: { color: theme.semantic.warning },
  });
