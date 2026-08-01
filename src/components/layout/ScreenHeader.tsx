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

type ScreenHeaderProps = {
  action?: ReactNode;
  children?: ReactNode;
  meta?: ReactNode;
  style?: StyleProp<ViewStyle>;
  subtitle?: ReactNode;
  subtitleStyle?: StyleProp<TextStyle>;
  title: ReactNode;
  titleStyle?: StyleProp<TextStyle>;
};

export function ScreenHeader({
  action,
  children,
  meta,
  style,
  subtitle,
  subtitleStyle,
  title,
  titleStyle,
}: ScreenHeaderProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View style={[styles.header, style]}>
      {meta ? <View style={styles.meta}>{meta}</View> : null}
      <View style={styles.titleRow}>
        <View style={styles.titleCopy}>
          <Text style={[styles.title, titleStyle]}>{title}</Text>
          {subtitle ? <Text style={[styles.subtitle, subtitleStyle]}>{subtitle}</Text> : null}
        </View>
        {action ? <View style={styles.action}>{action}</View> : null}
      </View>
      {children}
    </View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    action: {
      alignItems: 'flex-end',
      flexShrink: 0,
    },
    header: {
      gap: theme.spacing.md,
    },
    meta: {
      gap: theme.spacing.xs,
    },
    subtitle: {
      color: theme.semantic.textMuted,
      fontSize: theme.typography.size.body,
      lineHeight: theme.typography.lineHeight.body,
    },
    title: {
      color: theme.semantic.text,
      fontSize: theme.typography.size.display,
      fontWeight: '900',
      lineHeight: theme.typography.lineHeight.display,
    },
    titleCopy: {
      flex: 1,
      gap: theme.spacing.xs,
      minWidth: 0,
    },
    titleRow: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: theme.spacing.md,
      justifyContent: 'space-between',
    },
  });
