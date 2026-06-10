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

type ScreenSectionProps = {
  action?: ReactNode;
  children?: ReactNode;
  inset?: boolean;
  style?: StyleProp<ViewStyle>;
  title?: ReactNode;
  titleStyle?: StyleProp<TextStyle>;
};

export function ScreenSection({
  action,
  children,
  inset = true,
  style,
  title,
  titleStyle,
}: ScreenSectionProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View style={[styles.section, inset && styles.inset, style]}>
      {title || action ? (
        <View style={styles.header}>
          {title ? <Text style={[styles.title, titleStyle]}>{title}</Text> : <View />}
          {action ? <View style={styles.action}>{action}</View> : null}
        </View>
      ) : null}
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
      alignItems: 'center',
      flexDirection: 'row',
      gap: theme.spacing.md,
      justifyContent: 'space-between',
    },
    inset: {
      backgroundColor: theme.semantic.surface,
      borderRadius: theme.radius.md,
      padding: theme.spacing.md,
    },
    section: {
      gap: theme.spacing.md,
      minWidth: 0,
    },
    title: {
      color: theme.semantic.text,
      flex: 1,
      fontSize: theme.typography.size.body,
      fontWeight: '800',
      lineHeight: theme.typography.lineHeight.body,
    },
  });
