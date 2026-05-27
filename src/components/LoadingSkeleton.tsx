import { useEffect } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { useAppTheme, type AppTheme } from '@/src/theme';

type SkeletonBlockProps = {
  height: number;
  width?: ViewStyle['width'];
  borderRadius?: number;
  style?: ViewStyle;
};

export function SkeletonBlock({ height, width = '100%', borderRadius, style }: SkeletonBlockProps) {
  const theme = useAppTheme();
  const opacity = useSharedValue(0.55);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: 720 }), -1, true);
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          backgroundColor: theme.semantic.mediaPlaceholder,
          borderRadius: borderRadius ?? theme.radius.md,
          height,
          width,
        },
        style,
        animatedStyle,
      ]}
    />
  );
}

export function CardGridSkeleton({ count = 4 }: { count?: number }) {
  const theme = useAppTheme();

  return (
    <View style={styles.grid}>
      {Array.from({ length: count }).map((_, index) => (
        <View key={index} style={[styles.gridCard, { backgroundColor: theme.semantic.surface }]}>
          <SkeletonBlock height={96} borderRadius={theme.radius.sm} />
          <SkeletonBlock height={18} width="54%" />
          <SkeletonBlock height={16} width="78%" />
          <SkeletonBlock height={14} width="44%" />
        </View>
      ))}
    </View>
  );
}

export function PlanListSkeleton({ count = 3 }: { count?: number }) {
  const theme = useAppTheme();

  return (
    <View style={styles.list}>
      {Array.from({ length: count }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.planCard,
            {
              backgroundColor: theme.semantic.surface,
              borderColor: theme.semantic.border,
            },
          ]}
        >
          <SkeletonBlock height={26} width="72%" />
          <View style={[styles.infoList, { borderColor: theme.semantic.border }]}>
            <SkeletonRow theme={theme} />
            <SkeletonRow theme={theme} />
            <SkeletonRow theme={theme} isLast />
          </View>
        </View>
      ))}
    </View>
  );
}

export function FeedSkeleton({ count = 3 }: { count?: number }) {
  const theme = useAppTheme();

  return (
    <View style={styles.list}>
      {Array.from({ length: count }).map((_, index) => (
        <View key={index} style={[styles.feedCard, { backgroundColor: theme.semantic.surface }]}>
          <View style={styles.feedHeader}>
            <SkeletonBlock height={36} width={36} borderRadius={18} />
            <SkeletonBlock height={16} width="34%" />
          </View>
          <SkeletonBlock height={16} width="94%" />
          <SkeletonBlock height={16} width="72%" />
          <SkeletonBlock height={44} width="100%" />
          <SkeletonBlock height={14} width="42%" />
        </View>
      ))}
    </View>
  );
}

function SkeletonRow({ theme, isLast = false }: { theme: AppTheme; isLast?: boolean }) {
  return (
    <View
      style={[
        styles.infoRow,
        {
          borderBottomColor: theme.semantic.border,
          borderBottomWidth: isLast ? 0 : 1,
        },
      ]}
    >
      <SkeletonBlock height={14} width={38} />
      <SkeletonBlock height={14} width="58%" />
    </View>
  );
}

const styles = StyleSheet.create({
  feedCard: { borderRadius: 8, gap: 12, padding: 16 },
  feedHeader: { alignItems: 'center', flexDirection: 'row', gap: 10 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  gridCard: {
    borderRadius: 8,
    gap: 8,
    padding: 12,
    width: '48%',
  },
  infoList: {
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
  },
  infoRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  list: { gap: 16 },
  planCard: {
    borderRadius: 10,
    borderWidth: 1,
    gap: 16,
    padding: 18,
  },
});
