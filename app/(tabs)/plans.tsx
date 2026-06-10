import { Ionicons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import * as Clipboard from 'expo-clipboard';
import { Link, useRouter, type Href } from 'expo-router';
import { useRef, useState } from 'react';
import {
  Alert,
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import {
  itineraryKeys,
  useDeleteItineraryMutation,
  useItinerariesQuery,
  useItineraryShareMutation,
} from '@/src/api/itineraries/hooks';
import { DevScreenHeader } from '@/src/components/DevScreenHeader';
import {
  ScreenBody,
  ScreenFooter,
  ScreenHeader,
  ScreenRoot,
  ScreenScroll,
} from '@/src/components/layout';
import { PlanListSkeleton } from '@/src/components/LoadingSkeleton';
import {
  createPlanListItemViewModel,
  type PlanListItemViewModel,
} from '@/src/features/plans/viewModel';
import { useMinimumLoading } from '@/src/hooks/useMinimumLoading';
import { useAppTheme, type AppTheme } from '@/src/theme';

const ACTION_WIDTH = 92;
const ACTION_THRESHOLD = 54;
const LEFT_ACTION_WIDTH_RATIO = 0.5;
const LEFT_RESISTANCE_DISTANCE_RATIO = 0.22;
const DELETE_TRIGGER_RATIO = 0.65;
const DELETE_TRIGGER_MIN_OFFSET = 220;
const DELETE_FLING_RATIO = 0.38;
const DELETE_FLING_VELOCITY = 1200;
const SNAP_DURATION_MS = 140;
const DELETE_COLLAPSE_DURATION_MS = 180;

function toResistedLeftOffset(fingerOffset: number, maxOffset: number) {
  'worklet';

  if (fingerOffset >= 0 || maxOffset <= 0) {
    return fingerOffset;
  }

  const distance = Math.abs(fingerOffset);
  const resistanceDistance = maxOffset * LEFT_RESISTANCE_DISTANCE_RATIO;
  const mappedDistance = (maxOffset * distance) / (distance + resistanceDistance);

  return -mappedDistance;
}

export default function PlansScreen() {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const queryClient = useQueryClient();
  const plansQuery = useItinerariesQuery();
  const deleteItineraryMutation = useDeleteItineraryMutation();
  const itineraryShareMutation = useItineraryShareMutation();
  const isInitialLoading = useMinimumLoading(plansQuery.isPending && !plansQuery.data);
  const plans = (plansQuery.data?.items ?? []).map(createPlanListItemViewModel);

  const handleSharePlan = async (plan: PlanListItemViewModel) => {
    try {
      const share = await itineraryShareMutation.mutateAsync(plan.id);
      await Clipboard.setStringAsync(share.share_url);
      Alert.alert('공유 링크 복사', '플랜 공유 링크를 복사했어요.');
    } catch {
      Alert.alert('공유 실패', '공유 링크를 만들지 못했어요.');
    }
  };

  const handleDeletePlan = async (plan: PlanListItemViewModel) => {
    try {
      await deleteItineraryMutation.mutateAsync(plan.id);
      await queryClient.invalidateQueries({ queryKey: itineraryKeys.lists });
    } catch (error) {
      Alert.alert('삭제 실패', '플랜을 삭제하지 못했어요.');
      throw error;
    }
  };

  return (
    <ScreenRoot>
      <ScreenScroll contentContainerStyle={styles.container} onRefresh={() => plansQuery.refetch()}>
        <ScreenHeader
          meta={<DevScreenHeader screenName="플랜 목록" screenNumber="S-06" />}
          title="내 플랜"
        />
        {/*
          화면: 플랜 목록 (S-06)
          기능: 진행 중이거나 완성된 여행 플랜을 목록으로 관리하고 새 플랜 생성을 시작한다.
          가능한 다음 이동 화면: S-06N, S-07
        */}
        <ScreenBody style={styles.body}>
          {isInitialLoading ? (
            <PlanListSkeleton />
          ) : (
            plans.map((plan) => (
              <SwipePlanCard
                key={plan.id}
                plan={plan}
                styles={styles}
                theme={theme}
                onDelete={handleDeletePlan}
                onShare={handleSharePlan}
              />
            ))
          )}
          {!isInitialLoading && plans.length === 0 ? (
            <Text style={styles.cardMeta}>아직 만든 플랜이 없습니다.</Text>
          ) : null}
        </ScreenBody>
      </ScreenScroll>
      <ScreenFooter>
        <Link href={'/plans/new' as Href} asChild>
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>+ 새 플랜 만들기</Text>
          </TouchableOpacity>
        </Link>
      </ScreenFooter>
    </ScreenRoot>
  );
}

type SwipePlanCardProps = {
  plan: PlanListItemViewModel;
  styles: ReturnType<typeof createStyles>;
  theme: AppTheme;
  onDelete: (plan: PlanListItemViewModel) => Promise<void>;
  onShare: (plan: PlanListItemViewModel) => Promise<void>;
};

function SwipePlanCard({ plan, styles, theme, onDelete, onShare }: SwipePlanCardProps) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [isDeleted, setIsDeleted] = useState(false);
  const didSwipeRef = useRef(false);
  const isOpenRef = useRef(false);
  const translateX = useSharedValue(0);
  const deleteActionX = useSharedValue(0);
  const startX = useSharedValue(0);
  const measuredHeight = useSharedValue(0);
  const collapsedHeight = useSharedValue(-1);
  const cardWidth = useSharedValue(0);

  const close = () => {
    isOpenRef.current = false;
    translateX.value = withTiming(0, { duration: SNAP_DURATION_MS });
  };

  const markSwipeGesture = () => {
    didSwipeRef.current = true;
  };

  const markOpen = (isOpen: boolean) => {
    isOpenRef.current = isOpen;
  };

  const restoreAfterDeleteFailure = () => {
    isOpenRef.current = false;
    deleteActionX.value = withTiming(0, { duration: SNAP_DURATION_MS });
    translateX.value = withTiming(0, { duration: SNAP_DURATION_MS });
    collapsedHeight.value = withTiming(
      measuredHeight.value,
      { duration: DELETE_COLLAPSE_DURATION_MS },
      () => {
        collapsedHeight.value = -1;
      },
    );
  };

  const completeDelete = () => {
    void onDelete(plan)
      .then(() => setIsDeleted(true))
      .catch(restoreAfterDeleteFailure);
  };

  const collapseAfterSwipeOut = () => {
    collapsedHeight.value = measuredHeight.value;
    collapsedHeight.value = withTiming(0, { duration: DELETE_COLLAPSE_DURATION_MS }, () => {
      runOnJS(completeDelete)();
    });
  };

  const handleLayout = (event: LayoutChangeEvent) => {
    const nextHeight = event.nativeEvent.layout.height;

    if (nextHeight > 0) {
      measuredHeight.value = nextHeight;
    }

    cardWidth.value = event.nativeEvent.layout.width;
  };

  const handleShare = () => {
    void onShare(plan);
    close();
  };

  const handleDelete = () => {
    deleteActionX.value = withTiming(-width, { duration: SNAP_DURATION_MS });
    translateX.value = withTiming(-width, { duration: SNAP_DURATION_MS }, () => {
      runOnJS(collapseAfterSwipeOut)();
    });
  };

  const handlePressCard = () => {
    if (didSwipeRef.current) {
      didSwipeRef.current = false;
      if (isOpenRef.current) {
        close();
      }
      return;
    }

    if (isOpenRef.current) {
      close();
      return;
    }

    router.push(`/plans/${plan.id}` as Href);
  };

  const panGesture = Gesture.Pan()
    .activeOffsetX([-12, 12])
    .failOffsetY([-14, 14])
    .onBegin(() => {
      startX.value = translateX.value;
    })
    .onUpdate((event) => {
      const fingerOffset = startX.value + event.translationX;
      const maxLeftOffset = cardWidth.value * LEFT_ACTION_WIDTH_RATIO;
      translateX.value = toResistedLeftOffset(fingerOffset, maxLeftOffset);

      if (Math.abs(event.translationX) > 8) {
        runOnJS(markSwipeGesture)();
      }
    })
    .onEnd((event) => {
      const deleteOffset = Math.max(
        cardWidth.value * DELETE_TRIGGER_RATIO,
        DELETE_TRIGGER_MIN_OFFSET,
      );
      const flingOffset = cardWidth.value * DELETE_FLING_RATIO;
      const shouldDelete =
        -event.translationX >= deleteOffset ||
        (-event.translationX >= flingOffset && event.velocityX < -DELETE_FLING_VELOCITY);

      if (shouldDelete) {
        deleteActionX.value = withTiming(-width, { duration: SNAP_DURATION_MS });
        translateX.value = withTiming(-width, { duration: SNAP_DURATION_MS }, () => {
          runOnJS(collapseAfterSwipeOut)();
        });
        return;
      }

      if (translateX.value > ACTION_THRESHOLD) {
        translateX.value = withTiming(ACTION_WIDTH, { duration: SNAP_DURATION_MS }, () => {
          runOnJS(markOpen)(true);
        });
        return;
      }

      translateX.value = withTiming(0, { duration: SNAP_DURATION_MS }, () => {
        runOnJS(markOpen)(false);
      });
    });

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const leftActionStyle = useAnimatedStyle(() => ({
    opacity: Math.min(1, Math.max(0, translateX.value / ACTION_WIDTH)),
  }));

  const rightActionStyle = useAnimatedStyle(() => ({
    opacity: Math.min(
      1,
      Math.max(0, -translateX.value / Math.max(1, cardWidth.value * LEFT_ACTION_WIDTH_RATIO)),
    ),
    transform: [{ translateX: deleteActionX.value }],
  }));

  const hostStyle = useAnimatedStyle(() => {
    if (collapsedHeight.value < 0) {
      return {};
    }

    return {
      height: collapsedHeight.value,
      opacity: collapsedHeight.value <= 0 ? 0 : 1,
    };
  });

  if (isDeleted) {
    return null;
  }

  return (
    <Animated.View style={[styles.swipeHost, hostStyle]} onLayout={handleLayout}>
      <Animated.View style={[styles.actionPane, styles.shareAction, leftActionStyle]}>
        <Pressable style={styles.actionButton} onPress={handleShare}>
          <Ionicons color={theme.semantic.onPrimary} name="share-outline" size={21} />
          <Text style={styles.actionText}>공유</Text>
        </Pressable>
      </Animated.View>
      <Animated.View style={[styles.actionPane, styles.deleteAction, rightActionStyle]}>
        <Pressable style={styles.actionButton} onPress={handleDelete}>
          <Ionicons color={theme.semantic.onPrimary} name="trash-outline" size={21} />
          <Text style={styles.actionText}>삭제</Text>
        </Pressable>
      </Animated.View>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={cardStyle}>
          <Pressable style={styles.card} onPress={handlePressCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{plan.title}</Text>
              {plan.isPrivate ? (
                <View style={styles.lockBadge}>
                  <Ionicons
                    color={theme.semantic.textSecondary}
                    name="lock-closed-outline"
                    size={16}
                  />
                </View>
              ) : null}
            </View>
            <View style={styles.infoList}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>장소</Text>
                <Text style={styles.infoValue}>
                  {plan.destinationLabel} · {plan.placeCountLabel}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>기간</Text>
                <Text style={styles.infoValue}>{plan.dateRangeLabel}</Text>
              </View>
              <View style={[styles.infoRow, styles.lastInfoRow]}>
                <Text style={styles.infoLabel}>인원</Text>
                <Text style={styles.infoValue}>{plan.partyLabel}</Text>
              </View>
            </View>
          </Pressable>
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: { gap: theme.spacing.lg, padding: theme.spacing.lg },
    body: { gap: theme.spacing.lg },
    primaryButton: {
      backgroundColor: theme.semantic.primary,
      borderRadius: theme.radius.md,
      padding: theme.spacing.md,
    },
    primaryButtonText: { color: theme.semantic.onPrimary, fontWeight: '800', textAlign: 'center' },
    card: {
      backgroundColor: theme.semantic.surface,
      borderColor: theme.semantic.border,
      borderRadius: 10,
      borderWidth: 1,
      gap: 16,
      padding: 18,
    },
    cardHeader: { alignItems: 'flex-start', flexDirection: 'row', gap: 12 },
    cardTitle: { color: theme.semantic.text, flex: 1, fontSize: 22, fontWeight: '900' },
    lockBadge: {
      alignItems: 'center',
      backgroundColor: theme.semantic.surfaceMuted,
      borderRadius: 16,
      height: 32,
      justifyContent: 'center',
      width: 32,
    },
    cardMeta: { color: theme.semantic.textMuted },
    swipeHost: { borderRadius: 10, overflow: 'hidden' },
    actionPane: {
      bottom: 0,
      position: 'absolute',
      top: 0,
    },
    shareAction: {
      backgroundColor: theme.semantic.primary,
      left: 0,
      width: ACTION_WIDTH,
    },
    deleteAction: {
      backgroundColor: theme.semantic.danger,
      right: 0,
      width: '50%',
    },
    actionButton: {
      alignItems: 'center',
      flex: 1,
      gap: 6,
      justifyContent: 'center',
    },
    actionText: { color: theme.semantic.onPrimary, fontSize: 13, fontWeight: '900' },
    infoList: {
      borderColor: theme.semantic.border,
      borderRadius: 8,
      borderWidth: 1,
      overflow: 'hidden',
    },
    infoRow: {
      alignItems: 'center',
      borderBottomColor: theme.semantic.border,
      borderBottomWidth: 1,
      flexDirection: 'row',
      gap: 12,
      paddingHorizontal: 12,
      paddingVertical: 11,
    },
    lastInfoRow: { borderBottomWidth: 0 },
    infoLabel: { color: theme.semantic.textMuted, fontSize: 13, fontWeight: '800', width: 42 },
    infoValue: { color: theme.semantic.textSecondary, flex: 1, fontSize: 14, fontWeight: '700' },
  });
