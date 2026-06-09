import { Ionicons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DraggableFlatList, {
  ScaleDecorator,
  type RenderItemParams,
} from 'react-native-draggable-flatlist';

import {
  itineraryKeys,
  useItineraryQuery,
  useUpdateItineraryMutation,
  useUpdateItineraryItemMutation,
} from '@/src/api/itineraries/hooks';
import { DevScreenHeader } from '@/src/components/DevScreenHeader';
import {
  applyScheduleToRows,
  buildScheduleRows,
  getRowTimeLabels,
  getSchedulePatches,
  type ScheduleRow,
} from '@/src/features/plans/scheduleModel';
import { createPlanDetailViewModel } from '@/src/features/plans/viewModel';
import { useAppTheme, type AppTheme } from '@/src/theme';

import type { Itinerary } from '@/src/api/itineraries/types';

export default function PlanEditScreen() {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const queryClient = useQueryClient();
  const { planId } = useLocalSearchParams<{ planId: string }>();
  const currentPlanId = planId ?? '';
  const planQuery = useItineraryQuery(currentPlanId);
  const updatePlanMutation = useUpdateItineraryMutation();
  const updateItemMutation = useUpdateItineraryItemMutation(currentPlanId);
  const plan = useMemo(
    () => (planQuery.data ? createPlanDetailViewModel(planQuery.data) : null),
    [planQuery.data],
  );
  const [rows, setRows] = useState<ScheduleRow[]>([]);
  const [savingRows, setSavingRows] = useState(false);
  const [titleDraft, setTitleDraft] = useState('');
  const [titleEditing, setTitleEditing] = useState(false);
  const initialRows = useMemo(
    () =>
      planQuery.data
        ? buildScheduleRows(
            planQuery.data.start_date,
            planQuery.data.end_date,
            plan?.allItems ?? [],
          )
        : [],
    [plan?.allItems, planQuery.data],
  );
  const timeLabels = useMemo(() => getRowTimeLabels(rows), [rows]);

  useEffect(() => {
    if (!savingRows) {
      setRows(initialRows);
    }
  }, [initialRows, savingRows]);

  useEffect(() => {
    if (!titleEditing && !savingRows && plan?.title) {
      setTitleDraft(plan.title);
    }
  }, [plan?.title, savingRows, titleEditing]);

  const saveRows = useCallback(async () => {
    const normalizedRows = applyScheduleToRows(rows);
    const patches = getSchedulePatches(normalizedRows, initialRows);
    const nextTitle = titleDraft.trim();
    const titleChanged =
      !!planQuery.data && nextTitle.length > 0 && nextTitle !== planQuery.data.title;

    setRows(normalizedRows);
    setTitleEditing(false);

    if (patches.length === 0 && !titleChanged) {
      router.replace('/plans');
      return;
    }

    setSavingRows(true);

    try {
      await Promise.all(
        [
          titleChanged
            ? updatePlanMutation.mutateAsync({
                body: { title: nextTitle },
                itineraryId: currentPlanId,
              })
            : null,
          ...patches.map(({ body, item }) =>
            updateItemMutation.mutateAsync({
              body,
              itemId: item.itemId,
            }),
          ),
        ].filter(Boolean),
      );
      queryClient.setQueryData<Itinerary>(itineraryKeys.detail(currentPlanId), (current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,
          title: titleChanged ? nextTitle : current.title,
          items: current.items.map((item) => {
            const patch = patches.find(
              ({ item: patchedItem }) => patchedItem.itemId === item.item_id,
            );

            return patch ? { ...item, ...patch.body } : item;
          }),
        };
      });
      router.replace('/plans');
    } catch {
      Alert.alert('저장 실패', '일정을 저장하지 못했어요. 잠시 후 다시 시도해주세요.');
    } finally {
      setSavingRows(false);
    }
  }, [
    currentPlanId,
    initialRows,
    planQuery.data,
    queryClient,
    rows,
    titleDraft,
    updateItemMutation,
    updatePlanMutation,
  ]);

  const handleDragEnd = useCallback(({ data }: { data: ScheduleRow[] }) => {
    const nextRows = applyScheduleToRows(data);

    setRows(nextRows);
  }, []);

  return (
    <View style={styles.screen}>
      <PlanDetailHeader
        plan={plan}
        styles={styles}
        queryFailed={!planQuery.isLoading && !plan}
        titleDraft={titleDraft}
        titleEditing={titleEditing}
        onTitleBlur={() => setTitleEditing(false)}
        onTitleChange={setTitleDraft}
        onTitleEditStart={() => setTitleEditing(true)}
        titleIconColor={theme.semantic.textMuted}
      />
      {planQuery.isLoading ? (
        <View style={styles.loadingState}>
          <ActivityIndicator color={theme.semantic.primary} />
          <Text style={styles.place}>플랜을 불러오는 중입니다.</Text>
        </View>
      ) : null}
      {plan ? (
        <>
          <View style={styles.listShell}>
            <DraggableFlatList
              activationDistance={12}
              autoscrollSpeed={90}
              autoscrollThreshold={80}
              containerStyle={styles.scheduleList}
              contentContainerStyle={styles.scheduleListContent}
              data={rows}
              keyExtractor={(item) => item.id}
              onDragEnd={handleDragEnd}
              renderItem={(params) => (
                <ScheduleRowItem {...params} styles={styles} timeLabels={timeLabels} />
              )}
            />
          </View>
          <PlanDetailFooter
            isSaving={savingRows || updatePlanMutation.isPending || updateItemMutation.isPending}
            onSave={() => {
              void saveRows();
            }}
            styles={styles}
          />
        </>
      ) : null}
    </View>
  );
}

function PlanDetailHeader({
  onTitleBlur,
  onTitleChange,
  onTitleEditStart,
  plan,
  queryFailed,
  styles,
  titleDraft,
  titleEditing,
  titleIconColor,
}: {
  onTitleBlur: () => void;
  onTitleChange: (value: string) => void;
  onTitleEditStart: () => void;
  plan: ReturnType<typeof createPlanDetailViewModel> | null;
  queryFailed: boolean;
  styles: ReturnType<typeof createStyles>;
  titleDraft: string;
  titleEditing: boolean;
  titleIconColor: string;
}) {
  return (
    <View style={styles.headerContent}>
      <DevScreenHeader screenName="플랜 상세 / 편집" screenNumber="S-07" />
      {/*
        화면: 플랜 상세 / 편집 (S-07)
        기능: 여행 정보, 날짜별 장소 배치, 미배치 장소 풀, 지도, 공유, OTA 예약, 저장 액션을 제공한다.
        가능한 다음 이동 화면: S-05, S-07-M, S-08, S-09
      */}
      {queryFailed ? <Text style={styles.place}>플랜 정보를 불러오지 못했습니다.</Text> : null}
      {plan ? (
        <>
          <View style={styles.titleRow}>
            {titleEditing ? (
              <TextInput
                autoFocus
                onBlur={onTitleBlur}
                onChangeText={onTitleChange}
                onSubmitEditing={onTitleBlur}
                returnKeyType="done"
                style={styles.titleInput}
                value={titleDraft}
              />
            ) : (
              <TouchableOpacity
                activeOpacity={0.75}
                onPress={onTitleEditStart}
                style={styles.titleButton}
              >
                <Text style={styles.title}>{titleDraft || plan.title}</Text>
                <Ionicons color={titleIconColor} name="pencil-outline" size={15} />
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.meta}>{plan.meta}</Text>
        </>
      ) : null}
    </View>
  );
}

function PlanDetailFooter({
  isSaving,
  onSave,
  styles,
}: {
  isSaving: boolean;
  onSave: () => void;
  styles: ReturnType<typeof createStyles>;
}) {
  return (
    <View style={styles.footerContent}>
      {isSaving ? <Text style={styles.savingText}>일정을 저장하는 중입니다.</Text> : null}
      <TouchableOpacity style={styles.primaryButton} onPress={onSave}>
        <Text style={styles.primaryButtonText}>저장</Text>
      </TouchableOpacity>

      <View style={styles.bookingGrid}>
        <TouchableOpacity style={styles.bookingBlock}>
          <Text style={styles.sectionTitle}>숙소 예약</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bookingBlock}>
          <Text style={styles.sectionTitle}>항공 예약</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function ScheduleRowItem({
  drag,
  isActive,
  item,
  styles,
  timeLabels,
}: RenderItemParams<ScheduleRow> & {
  styles: ReturnType<typeof createStyles>;
  timeLabels: Map<string, string>;
}) {
  if (item.type === 'day') {
    return (
      <View style={styles.section}>
        <View style={styles.dayHeader}>
          <Text style={styles.sectionTitle}>{item.title}</Text>
          <Text style={styles.dayDate}>{item.dateLabel}</Text>
        </View>
      </View>
    );
  }

  if (item.type === 'unassigned') {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{item.title}</Text>
      </View>
    );
  }

  const timeLabel = timeLabels.get(item.item.itemId) ?? '미배치';

  return (
    <ScaleDecorator>
      <TouchableOpacity
        activeOpacity={0.9}
        disabled={isActive}
        onLongPress={drag}
        style={[styles.schedulePlaceCard, isActive && styles.activeSchedulePlaceCard]}
      >
        <View style={styles.draggableHeader}>
          <View style={styles.placeCopy}>
            <Text style={styles.placeName}>{item.item.name}</Text>
            <Text style={styles.place}>{timeLabel}</Text>
          </View>
          <Text style={styles.dragHandleText}>길게 눌러 이동</Text>
        </View>
      </TouchableOpacity>
    </ScaleDecorator>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    activeSchedulePlaceCard: {
      backgroundColor: theme.semantic.primarySoft,
      borderColor: theme.semantic.primary,
      borderWidth: 1,
    },
    bookingBlock: {
      alignItems: 'center',
      backgroundColor: theme.semantic.primarySoft,
      borderRadius: 8,
      flex: 1,
      gap: 8,
      justifyContent: 'center',
      padding: 14,
    },
    bookingGrid: { flexDirection: 'row', gap: 10 },
    container: { backgroundColor: theme.semantic.background, gap: 14, padding: 20 },
    dayDate: { color: theme.semantic.textMuted, fontWeight: '800' },
    dayHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
    dragHandleText: { color: theme.semantic.textSecondary, fontSize: 12, fontWeight: '900' },
    draggableHeader: { alignItems: 'flex-start', flexDirection: 'row', gap: 10 },
    footerContent: { gap: 14, paddingTop: 2 },
    headerContent: { gap: 10 },
    listShell: { flex: 1, minHeight: 240 },
    loadingState: { alignItems: 'center', gap: 10, padding: 24 },
    meta: { color: theme.semantic.textMuted },
    place: { color: theme.semantic.textSecondary },
    placeCopy: { flex: 1, gap: 4 },
    placeName: { color: theme.semantic.text, fontSize: 16, fontWeight: '900' },
    primaryButton: { backgroundColor: theme.semantic.primary, borderRadius: 8, padding: 16 },
    primaryButtonText: { color: theme.semantic.onPrimary, fontWeight: '800', textAlign: 'center' },
    savingText: { color: theme.semantic.textMuted, fontWeight: '800', textAlign: 'center' },
    schedulePlaceCard: {
      backgroundColor: theme.semantic.input,
      borderRadius: 8,
      gap: 12,
      padding: 12,
    },
    scheduleList: { flex: 1 },
    scheduleListContent: { gap: 14, paddingVertical: 2 },
    screen: { backgroundColor: theme.semantic.background, flex: 1, gap: 14, padding: 20 },
    section: { backgroundColor: theme.semantic.surface, borderRadius: 8, gap: 10, padding: 14 },
    sectionTitle: { color: theme.semantic.text, fontSize: 17, fontWeight: '800' },
    title: { color: theme.semantic.text, fontSize: 28, fontWeight: '800' },
    titleButton: { alignItems: 'center', flexDirection: 'row', gap: 6 },
    titleInput: {
      color: theme.semantic.text,
      fontSize: 28,
      fontWeight: '800',
      margin: 0,
      padding: 0,
    },
    titleRow: { alignItems: 'flex-start' },
  });
