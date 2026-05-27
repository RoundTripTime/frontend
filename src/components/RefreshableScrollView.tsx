import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  type ScrollViewProps,
  StyleSheet,
  type StyleProp,
  View,
  type ViewStyle,
} from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppTheme } from '@/src/theme';

type RefreshPhase = 'idle' | 'pulling' | 'ready' | 'refreshing' | 'settling' | 'applying';

export type RefreshPolicy = {
  thresholdOffset: number;
  releaseSettleDurationMs: number;
  minimumVisibleDurationMs: number;
  indicatorTopInsetOffset: number;
  minimumIndicatorTopOffset: number;
  indicatorSize: number;
  loadingHoldOffset: number;
  offsetAnimationDurationMs: number;
};

type RefreshableScrollViewProps = Omit<
  ScrollViewProps,
  'onRefresh' | 'refreshControl' | 'onScroll' | 'onScrollBeginDrag' | 'onScrollEndDrag'
> & {
  onRefresh: () => Promise<unknown> | unknown;
  indicatorContainerStyle?: StyleProp<ViewStyle>;
  policy?: Partial<RefreshPolicy>;
};

const DEFAULT_REFRESH_POLICY: RefreshPolicy = {
  indicatorSize: 36,
  indicatorTopInsetOffset: 16,
  loadingHoldOffset: 44,
  minimumIndicatorTopOffset: 56,
  minimumVisibleDurationMs: 700,
  offsetAnimationDurationMs: 180,
  releaseSettleDurationMs: 160,
  thresholdOffset: 72,
};

export function RefreshableScrollView({
  children,
  contentContainerStyle,
  indicatorContainerStyle,
  onRefresh,
  policy,
  scrollEventThrottle = 16,
  ...props
}: RefreshableScrollViewProps) {
  const theme = useAppTheme();
  const safeAreaInsets = useSafeAreaInsets();
  const refreshPolicy = useMemo(() => ({ ...DEFAULT_REFRESH_POLICY, ...policy }), [policy]);
  const indicatorTopOffset = Math.max(
    safeAreaInsets.top + refreshPolicy.indicatorTopInsetOffset,
    refreshPolicy.minimumIndicatorTopOffset,
  );
  const [phase, setPhase] = useState<RefreshPhase>('idle');
  const contentOffset = useSharedValue(0);
  const phaseRef = useRef<RefreshPhase>('idle');
  const draggingRef = useRef(false);
  const refreshPromiseSettledRef = useRef(false);
  const minimumVisibleSettledRef = useRef(false);
  const refreshPromiseRef = useRef<Promise<unknown> | null>(null);
  const releaseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const visibleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setRefreshPhase = useCallback((nextPhase: RefreshPhase) => {
    phaseRef.current = nextPhase;
    setPhase(nextPhase);
  }, []);

  const clearTimers = useCallback(() => {
    if (releaseTimeoutRef.current) {
      clearTimeout(releaseTimeoutRef.current);
      releaseTimeoutRef.current = null;
    }

    if (visibleTimeoutRef.current) {
      clearTimeout(visibleTimeoutRef.current);
      visibleTimeoutRef.current = null;
    }
  }, []);

  const finishRefresh = useCallback(() => {
    clearTimers();
    refreshPromiseRef.current = null;
    refreshPromiseSettledRef.current = false;
    minimumVisibleSettledRef.current = false;
    setRefreshPhase('idle');
  }, [clearTimers, setRefreshPhase]);

  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, [clearTimers]);

  const applyWhenResponseSettles = useCallback(() => {
    if (refreshPromiseSettledRef.current && minimumVisibleSettledRef.current) {
      setRefreshPhase('applying');
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      finishRefresh();
    }
  }, [finishRefresh, setRefreshPhase]);

  const beginReleaseSequence = useCallback(() => {
    if (phaseRef.current !== 'refreshing') {
      return;
    }

    setRefreshPhase('settling');
    releaseTimeoutRef.current = setTimeout(() => {
      visibleTimeoutRef.current = setTimeout(() => {
        minimumVisibleSettledRef.current = true;
        applyWhenResponseSettles();
      }, refreshPolicy.minimumVisibleDurationMs);
    }, refreshPolicy.releaseSettleDurationMs);
  }, [
    applyWhenResponseSettles,
    refreshPolicy.minimumVisibleDurationMs,
    refreshPolicy.releaseSettleDurationMs,
    setRefreshPhase,
  ]);

  const beginRefresh = useCallback(() => {
    if (refreshPromiseRef.current) {
      return;
    }

    setRefreshPhase('refreshing');
    refreshPromiseSettledRef.current = false;
    minimumVisibleSettledRef.current = false;
    refreshPromiseRef.current = Promise.resolve(onRefresh())
      .catch(() => undefined)
      .finally(() => {
        refreshPromiseSettledRef.current = true;

        if (!draggingRef.current) {
          applyWhenResponseSettles();
        }
      });
  }, [applyWhenResponseSettles, onRefresh, setRefreshPhase]);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetY = event.nativeEvent.contentOffset.y;

      if (refreshPromiseRef.current) {
        return;
      }

      if (offsetY >= 0) {
        if (phaseRef.current === 'pulling' || phaseRef.current === 'ready') {
          setRefreshPhase('idle');
        }
        return;
      }

      if (Math.abs(offsetY) >= refreshPolicy.thresholdOffset) {
        setRefreshPhase('ready');
        beginRefresh();
        return;
      }

      if (phaseRef.current === 'idle') {
        setRefreshPhase('pulling');
      }
    },
    [beginRefresh, refreshPolicy.thresholdOffset, setRefreshPhase],
  );

  const handleScrollBeginDrag = useCallback(() => {
    draggingRef.current = true;
  }, []);

  const handleScrollEndDrag = useCallback(() => {
    draggingRef.current = false;

    if (!refreshPromiseRef.current) {
      setRefreshPhase('idle');
      return;
    }

    beginReleaseSequence();
  }, [beginReleaseSequence, setRefreshPhase]);

  const showIndicator =
    phase === 'ready' || phase === 'refreshing' || phase === 'settling' || phase === 'applying';
  const holdContentOffset = phase === 'refreshing' || phase === 'settling';

  useEffect(() => {
    contentOffset.value = withTiming(holdContentOffset ? refreshPolicy.loadingHoldOffset : 0, {
      duration: refreshPolicy.offsetAnimationDurationMs,
    });
  }, [
    contentOffset,
    holdContentOffset,
    refreshPolicy.loadingHoldOffset,
    refreshPolicy.offsetAnimationDurationMs,
  ]);

  const animatedContentStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: contentOffset.value }],
  }));

  return (
    <View style={styles.host}>
      <ScrollView
        {...props}
        alwaysBounceVertical
        contentContainerStyle={styles.scrollContentHost}
        onScroll={handleScroll}
        onScrollBeginDrag={handleScrollBeginDrag}
        onScrollEndDrag={handleScrollEndDrag}
        scrollEventThrottle={scrollEventThrottle}
      >
        <Animated.View style={[contentContainerStyle, animatedContentStyle]}>
          {children}
        </Animated.View>
      </ScrollView>
      {showIndicator ? (
        <View
          pointerEvents="none"
          style={[
            styles.indicatorHost,
            {
              top: indicatorTopOffset,
            },
            indicatorContainerStyle,
          ]}
        >
          <View
            style={[
              styles.indicator,
              {
                backgroundColor: theme.semantic.surface,
                borderColor: theme.semantic.border,
                height: refreshPolicy.indicatorSize,
                width: refreshPolicy.indicatorSize,
              },
            ]}
          >
            <ActivityIndicator color={theme.semantic.primary} size="small" />
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  host: { flex: 1 },
  scrollContentHost: { flexGrow: 1 },
  indicator: {
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    elevation: 6,
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.16,
    shadowRadius: 8,
  },
  indicatorHost: {
    alignItems: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    zIndex: 200,
  },
});
