import Constants from 'expo-constants';
import { StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '@/src/theme';

type DevScreenHeaderProps = {
  screenName: string;
  screenNumber: string;
};

const appMode = Constants.expoConfig?.extra?.appMode as
  | { showDevScreenHeader?: boolean }
  | undefined;
const showDevScreenHeader = appMode?.showDevScreenHeader ?? true;

export function DevScreenHeader({ screenName, screenNumber }: DevScreenHeaderProps) {
  const theme = useAppTheme();

  if (!showDevScreenHeader) {
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
        <Text style={[styles.number, { color: theme.semantic.onPrimary }]}>{screenNumber}</Text>
        <Text style={[styles.name, { color: theme.semantic.onPrimary }]} numberOfLines={1}>
          {screenName}
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
    zIndex: 100,
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
