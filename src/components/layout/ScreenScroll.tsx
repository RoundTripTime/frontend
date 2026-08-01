import { type ReactNode } from 'react';
import {
  ScrollView,
  type ScrollViewProps,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { RefreshableScrollView } from '@/src/components/RefreshableScrollView';
import { useAppTheme, type AppTheme } from '@/src/theme';

type ScreenScrollProps = {
  applyBottomInset?: boolean;
  applyHorizontalInsets?: boolean;
  applyTopInset?: boolean;
  children?: ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
  insetSpacing?: number;
  onRefresh?: () => Promise<unknown> | unknown;
  scrollProps?: Omit<ScrollViewProps, 'children' | 'contentContainerStyle' | 'refreshControl'>;
  style?: StyleProp<ViewStyle>;
};

export function ScreenScroll({
  applyBottomInset = false,
  applyHorizontalInsets = false,
  applyTopInset = false,
  children,
  contentContainerStyle,
  insetSpacing,
  onRefresh,
  scrollProps,
  style,
}: ScreenScrollProps) {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const styles = createStyles(theme);
  const spacing = insetSpacing ?? theme.spacing.lg;
  const safeAreaContentStyle = {
    paddingBottom: applyBottomInset ? insets.bottom + spacing : undefined,
    paddingLeft: applyHorizontalInsets ? insets.left + spacing : undefined,
    paddingRight: applyHorizontalInsets ? insets.right + spacing : undefined,
    paddingTop: applyTopInset ? insets.top + spacing : undefined,
  };

  if (onRefresh) {
    return (
      <RefreshableScrollView
        {...scrollProps}
        contentContainerStyle={[styles.content, contentContainerStyle, safeAreaContentStyle]}
        keyboardShouldPersistTaps={scrollProps?.keyboardShouldPersistTaps ?? 'handled'}
        style={[styles.scroll, style]}
        onRefresh={onRefresh}
      >
        {children}
      </RefreshableScrollView>
    );
  }

  return (
    <ScrollView
      {...scrollProps}
      contentContainerStyle={[styles.content, contentContainerStyle, safeAreaContentStyle]}
      keyboardShouldPersistTaps={scrollProps?.keyboardShouldPersistTaps ?? 'handled'}
      style={[styles.scroll, style]}
    >
      {children}
    </ScrollView>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    content: {
      backgroundColor: theme.semantic.background,
      flexGrow: 1,
      gap: theme.spacing.lg,
      padding: theme.spacing.lg,
    },
    scroll: {
      backgroundColor: theme.semantic.background,
      flex: 1,
    },
  });
