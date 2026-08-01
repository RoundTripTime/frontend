import { type ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppTheme, type AppTheme } from '@/src/theme';

type ScreenOverlayProps = {
  applyBottomInset?: boolean;
  applyHorizontalInsets?: boolean;
  applyTopInset?: boolean;
  children?: ReactNode;
  insetSpacing?: number;
  pointerEvents?: 'auto' | 'box-none' | 'box-only' | 'none';
  style?: StyleProp<ViewStyle>;
};

export function ScreenOverlay({
  applyBottomInset = false,
  applyHorizontalInsets = false,
  applyTopInset = false,
  children,
  insetSpacing,
  pointerEvents = 'box-none',
  style,
}: ScreenOverlayProps) {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const styles = createStyles(theme);
  const spacing = insetSpacing ?? theme.spacing.lg;

  return (
    <View
      pointerEvents={pointerEvents}
      style={[
        styles.overlay,
        style,
        {
          paddingBottom: applyBottomInset ? insets.bottom + spacing : undefined,
          paddingLeft: applyHorizontalInsets ? insets.left + spacing : undefined,
          paddingRight: applyHorizontalInsets ? insets.right + spacing : undefined,
          paddingTop: applyTopInset ? insets.top + spacing : undefined,
        },
      ]}
    >
      {children}
    </View>
  );
}

const createStyles = (_theme: AppTheme) =>
  StyleSheet.create({
    overlay: {
      ...StyleSheet.absoluteFillObject,
    },
  });
