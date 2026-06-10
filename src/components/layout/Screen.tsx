import { type ReactNode } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  type ScrollViewProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { RefreshableScrollView } from '@/src/components/RefreshableScrollView';
import { useAppTheme, type AppTheme } from '@/src/theme';

type ScreenProps = {
  bodyStyle?: StyleProp<ViewStyle>;
  children?: ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
  footer?: ReactNode;
  footerStyle?: StyleProp<ViewStyle>;
  header?: ReactNode;
  onRefresh?: () => Promise<unknown> | unknown;
  overlay?: ReactNode;
  overlayStyle?: StyleProp<ViewStyle>;
  scroll?: boolean;
  scrollProps?: Omit<ScrollViewProps, 'contentContainerStyle' | 'refreshControl'>;
  style?: StyleProp<ViewStyle>;
};

type ScreenRootProps = {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

type ScreenScrollProps = {
  children?: ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
  onRefresh?: () => Promise<unknown> | unknown;
  scrollProps?: Omit<ScrollViewProps, 'contentContainerStyle' | 'refreshControl'>;
  style?: StyleProp<ViewStyle>;
};

type ScreenBodyProps = {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

type ScreenFooterProps = {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

type ScreenOverlayProps = {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function Screen({
  bodyStyle,
  children,
  contentContainerStyle,
  footer,
  footerStyle,
  header,
  onRefresh,
  overlay,
  overlayStyle,
  scroll = false,
  scrollProps,
  style,
}: ScreenProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const body = (
    <View style={[styles.body, bodyStyle]}>
      {header ? <View style={styles.headerHost}>{header}</View> : null}
      {children}
    </View>
  );

  return (
    <View style={[styles.screen, style]}>
      {onRefresh ? (
        <RefreshableScrollView
          {...scrollProps}
          contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
          style={styles.scroll}
          onRefresh={onRefresh}
        >
          {body}
        </RefreshableScrollView>
      ) : scroll ? (
        <ScrollView
          {...scrollProps}
          contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
          style={styles.scroll}
        >
          {body}
        </ScrollView>
      ) : (
        <View style={[styles.content, contentContainerStyle]}>{body}</View>
      )}
      {footer ? <View style={[styles.footer, footerStyle]}>{footer}</View> : null}
      {overlay ? <View style={[styles.overlay, overlayStyle]}>{overlay}</View> : null}
    </View>
  );
}

export function ScreenRoot({ children, style }: ScreenRootProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return <View style={[styles.screen, style]}>{children}</View>;
}

export function ScreenScroll({
  children,
  contentContainerStyle,
  onRefresh,
  scrollProps,
  style,
}: ScreenScrollProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  if (onRefresh) {
    return (
      <RefreshableScrollView
        {...scrollProps}
        contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
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
      contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
      style={[styles.scroll, style]}
    >
      {children}
    </ScrollView>
  );
}

export function ScreenBody({ children, style }: ScreenBodyProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return <View style={[styles.body, style]}>{children}</View>;
}

export function ScreenFooter({ children, style }: ScreenFooterProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return <View style={[styles.footer, style]}>{children}</View>;
}

export function ScreenOverlay({ children, style }: ScreenOverlayProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return <View style={[styles.overlay, style]}>{children}</View>;
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    body: {
      flex: 1,
      gap: theme.spacing.lg,
    },
    content: {
      flex: 1,
      gap: theme.spacing.lg,
      padding: theme.spacing.lg,
    },
    footer: {
      gap: theme.spacing.md,
      padding: theme.spacing.lg,
    },
    headerHost: {
      gap: theme.spacing.sm,
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      pointerEvents: 'box-none',
    },
    screen: {
      backgroundColor: theme.semantic.background,
      flex: 1,
    },
    scroll: {
      backgroundColor: theme.semantic.background,
      flex: 1,
    },
    scrollContent: {
      backgroundColor: theme.semantic.background,
      flexGrow: 1,
      gap: theme.spacing.lg,
      padding: theme.spacing.lg,
    },
  });
