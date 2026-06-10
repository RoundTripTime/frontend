import { useCallback, useMemo, useState } from 'react';
import { RefreshControl, ScrollView, type ScrollViewProps, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppTheme } from '@/src/theme';

export type RefreshPolicy = {
  indicatorTopInsetOffset: number;
  minimumIndicatorTopOffset: number;
};

type RefreshableScrollViewProps = Omit<
  ScrollViewProps,
  'onRefresh' | 'refreshControl' | 'onScroll' | 'onScrollBeginDrag' | 'onScrollEndDrag'
> & {
  onRefresh: () => Promise<unknown> | unknown;
  policy?: Partial<RefreshPolicy>;
};

const DEFAULT_REFRESH_POLICY: RefreshPolicy = {
  indicatorTopInsetOffset: 16,
  minimumIndicatorTopOffset: 56,
};

export function RefreshableScrollView({
  children,
  contentContainerStyle,
  onRefresh,
  policy,
  ...props
}: RefreshableScrollViewProps) {
  const theme = useAppTheme();
  const safeAreaInsets = useSafeAreaInsets();
  const refreshPolicy = useMemo(() => ({ ...DEFAULT_REFRESH_POLICY, ...policy }), [policy]);
  const progressViewOffset = Math.max(
    safeAreaInsets.top + refreshPolicy.indicatorTopInsetOffset,
    refreshPolicy.minimumIndicatorTopOffset,
  );
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    Promise.resolve(onRefresh())
      .catch(() => undefined)
      .finally(() => {
        setRefreshing(false);
      });
  }, [onRefresh]);

  return (
    <ScrollView
      {...props}
      alwaysBounceVertical
      contentContainerStyle={[styles.scrollContentHost, contentContainerStyle]}
      refreshControl={
        <RefreshControl
          colors={[theme.semantic.primary]}
          progressBackgroundColor={theme.semantic.surface}
          progressViewOffset={progressViewOffset}
          refreshing={refreshing}
          tintColor={theme.semantic.primary}
          onRefresh={handleRefresh}
        />
      }
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContentHost: { flexGrow: 1 },
});
