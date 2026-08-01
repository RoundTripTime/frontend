import { type ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { useAppTheme, type AppTheme } from '@/src/theme';

export type SurfaceCardVariant = 'muted' | 'outlined' | 'soft' | 'surface';

type SurfaceCardProps = {
  children?: ReactNode;
  left?: ReactNode;
  right?: ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: SurfaceCardVariant;
};

export function SurfaceCard({
  children,
  left,
  right,
  style,
  variant = 'surface',
}: SurfaceCardProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View style={[styles.card, styles[variant], style]}>
      {left ? <View>{left}</View> : null}
      <View style={styles.content}>{children}</View>
      {right ? <View>{right}</View> : null}
    </View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    card: {
      borderRadius: theme.radius.md,
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
    muted: {
      backgroundColor: theme.semantic.surfaceMuted,
      borderColor: theme.semantic.surfaceMuted,
      borderWidth: 1,
    },
    outlined: {
      backgroundColor: theme.semantic.surface,
      borderColor: theme.semantic.border,
      borderWidth: 1,
    },
    soft: {
      backgroundColor: theme.semantic.primarySoft,
      borderColor: theme.semantic.primarySoft,
      borderWidth: 1,
    },
    surface: {
      backgroundColor: theme.semantic.surface,
      borderColor: theme.semantic.border,
      borderWidth: 1,
    },
  });
