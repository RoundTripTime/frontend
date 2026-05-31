import { StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '@/src/theme';

type EmptyStateProps = {
  description?: string;
  title: string;
};

export function EmptyState({ description, title }: EmptyStateProps) {
  const theme = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.semantic.surfaceMuted }]}>
      <Text style={[styles.title, { color: theme.semantic.text }]}>{title}</Text>
      {description ? (
        <Text style={[styles.description, { color: theme.semantic.textMuted }]}>{description}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  description: {
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 19,
  },
  title: {
    fontSize: 16,
    fontWeight: '900',
  },
});
