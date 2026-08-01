import { type ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppTheme, type AppTheme } from '@/src/theme';

type ScreenFooterProps = {
  applyBottomInset?: boolean;
  children?: ReactNode;
  insetSpacing?: number;
  style?: StyleProp<ViewStyle>;
};

export function ScreenFooter({
  applyBottomInset = true,
  children,
  insetSpacing,
  style,
}: ScreenFooterProps) {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const styles = createStyles(theme);
  const spacing = insetSpacing ?? theme.spacing.lg;

  return (
    <View
      style={[
        styles.footer,
        style,
        {
          paddingBottom: applyBottomInset ? insets.bottom + spacing : spacing,
          paddingHorizontal: spacing,
          paddingTop: spacing,
        },
      ]}
    >
      {children}
    </View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    footer: {
      backgroundColor: theme.semantic.background,
      gap: theme.spacing.md,
    },
  });
