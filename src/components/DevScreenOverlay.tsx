import { usePathname } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { shouldShowDevScreenHeader } from '@/src/lib/appMode';
import { useAppTheme } from '@/src/theme';

type ScreenMeta = {
  name: string;
  number: string;
};

const screenMetaByPath: { pattern: RegExp; meta: ScreenMeta }[] = [
  { pattern: /^\/$/, meta: { name: '홈 / 내 장소', number: 'S-02' } },
  { pattern: /^\/onboarding$/, meta: { name: '온보딩', number: 'S-01' } },
  { pattern: /^\/receive$/, meta: { name: '링크 수신 / 분석 중', number: 'S-03' } },
  { pattern: /^\/places\/recent$/, meta: { name: '최근 추가한 장소', number: 'S-04' } },
  { pattern: /^\/places\/[^/]+$/, meta: { name: '장소 상세', number: 'S-05' } },
  { pattern: /^\/plans$/, meta: { name: '플랜 목록', number: 'S-06' } },
  { pattern: /^\/plans\/new$/, meta: { name: '새 플랜 만들기', number: 'S-06N' } },
  { pattern: /^\/plans\/[^/]+$/, meta: { name: '플랜 상세 / 편집', number: 'S-07' } },
  { pattern: /^\/plans\/[^/]+\/map$/, meta: { name: '플랜 지도 스플릿 뷰', number: 'S-07-M' } },
  { pattern: /^\/plans\/[^/]+\/agent$/, meta: { name: 'Planning Agent 대화', number: 'S-08' } },
  { pattern: /^\/plans\/[^/]+\/share$/, meta: { name: '플랜 공유 / 상세', number: 'S-09' } },
  { pattern: /^\/explore$/, meta: { name: '둘러보기', number: 'S-10' } },
  { pattern: /^\/community$/, meta: { name: '커뮤니티', number: 'S-11' } },
  {
    pattern: /^\/community\/posts\/[^/]+$/,
    meta: { name: '커뮤니티 포스트 상세', number: 'S-11A' },
  },
  { pattern: /^\/community\/market$/, meta: { name: '플랜 마켓 목록', number: 'S-11M' } },
  {
    pattern: /^\/community\/market\/register$/,
    meta: { name: '플랜 마켓 등록', number: 'S-11MR' },
  },
  {
    pattern: /^\/community\/market\/[^/]+$/,
    meta: { name: '플랜 마켓 상세 / 미리보기 / 열람', number: 'S-11MP' },
  },
  {
    pattern: /^\/community\/market\/[^/]+\/credits$/,
    meta: { name: '광고 시청 / 크레딧 충전', number: 'S-11MAD' },
  },
  { pattern: /^\/settings$/, meta: { name: '설정', number: 'S-12' } },
  { pattern: /^\/settings\/profile$/, meta: { name: '프로필 수정', number: 'S-12-P' } },
];

function getScreenMeta(pathname: string) {
  return screenMetaByPath.find((item) => item.pattern.test(pathname))?.meta;
}

export function DevScreenOverlay() {
  const pathname = usePathname();
  const theme = useAppTheme();
  const screenMeta = getScreenMeta(pathname);

  if (!shouldShowDevScreenHeader || !screenMeta) {
    return null;
  }

  return (
    <View pointerEvents="none" style={styles.container}>
      <View
        style={[
          styles.badge,
          {
            backgroundColor: theme.semantic.primary,
            borderColor: theme.semantic.border,
          },
        ]}
      >
        <Text style={[styles.number, { color: theme.semantic.onPrimary }]}>
          {screenMeta.number}
        </Text>
        <Text style={[styles.name, { color: theme.semantic.onPrimary }]} numberOfLines={1}>
          {screenMeta.name}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    maxWidth: '92%',
    opacity: 0.92,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  container: {
    left: 12,
    position: 'absolute',
    right: 12,
    top: 8,
    zIndex: 1000,
    elevation: 1000,
  },
  name: {
    flexShrink: 1,
    fontSize: 12,
    fontWeight: '700',
  },
  number: {
    fontSize: 12,
    fontWeight: '900',
  },
});
