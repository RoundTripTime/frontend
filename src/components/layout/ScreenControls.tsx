import { type ReactNode } from 'react';
import {
  ScrollView,
  StyleSheet,
  type ScrollViewProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { useAppTheme, type AppTheme } from '@/src/theme';

type ScreenControlsLayout = 'row' | 'grid';

type ScreenControlsProps = {
  children?: ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
  layout?: ScreenControlsLayout;
  scrollProps?: Omit<ScrollViewProps, 'children' | 'contentContainerStyle' | 'horizontal'>;
  style?: StyleProp<ViewStyle>;
};

export function ScreenControls({
  children,
  contentContainerStyle,
  layout = 'row',
  scrollProps,
  style,
}: ScreenControlsProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <ScrollView
      {...scrollProps}
      horizontal
      contentContainerStyle={[
        styles.content,
        layout === 'grid' && styles.gridContent,
        contentContainerStyle,
      ]}
      showsHorizontalScrollIndicator={scrollProps?.showsHorizontalScrollIndicator ?? false}
      style={[styles.controls, style]}
    >
      {children}
    </ScrollView>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    content: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: theme.spacing.sm,
      paddingRight: theme.spacing.lg,
    },
    controls: {
      flexBasis: '10%',
      maxHeight: '12%',
      minHeight: '8%',
    },
    gridContent: {
      alignContent: 'flex-start',
      alignItems: 'flex-start',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
    },
  });
