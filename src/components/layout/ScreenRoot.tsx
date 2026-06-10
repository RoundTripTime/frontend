import { type ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppTheme, type AppTheme } from '@/src/theme';

type ScreenRootProps = {
  applyBottomInset?: boolean;
  applyHorizontalInsets?: boolean;
  applyTopInset?: boolean;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function ScreenRoot({
  applyBottomInset = false,
  applyHorizontalInsets = false,
  applyTopInset = false,
  children,
  style,
}: ScreenRootProps) {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const styles = createStyles(theme);

  return (
    <View
      style={[
        styles.root,
        style,
        {
          paddingBottom: applyBottomInset ? insets.bottom : undefined,
          paddingLeft: applyHorizontalInsets ? insets.left : undefined,
          paddingRight: applyHorizontalInsets ? insets.right : undefined,
          paddingTop: applyTopInset ? insets.top : undefined,
        },
      ]}
    >
      {children}
    </View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    root: {
      backgroundColor: theme.semantic.background,
      flex: 1,
    },
  });
