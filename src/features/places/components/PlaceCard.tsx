import {
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { useAppTheme, type AppTheme } from '@/src/theme';

export type PlaceCardProps = {
  category: string;
  countryLabel: string;
  name: string;
  onLongPress?: () => void;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  thumbnailUrl?: string | null;
};

export function PlaceCard({
  category,
  countryLabel,
  name,
  onLongPress,
  onPress,
  style,
  thumbnailUrl,
}: PlaceCardProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <TouchableOpacity
      activeOpacity={0.84}
      style={[styles.card, style]}
      onLongPress={onLongPress}
      onPress={onPress}
    >
      {thumbnailUrl ? (
        <Image source={{ uri: thumbnailUrl }} style={styles.thumbnail} />
      ) : (
        <View style={styles.thumbnail} />
      )}
      <Text style={styles.categoryBadge}>{category}</Text>
      <Text ellipsizeMode="tail" numberOfLines={1} style={styles.title}>
        {name}
      </Text>
      <Text style={styles.meta}>{countryLabel}</Text>
    </TouchableOpacity>
  );
}

export function AddPlaceCard({ onPress }: { onPress?: () => void }) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <TouchableOpacity activeOpacity={0.84} style={styles.addCard} onPress={onPress}>
      <View style={styles.addPreview}>
        <Text style={styles.addIcon}>+</Text>
      </View>
      <Text style={styles.addText}>플레이스 추가</Text>
    </TouchableOpacity>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    addCard: {
      backgroundColor: 'transparent',
      borderRadius: 8,
      gap: 8,
      padding: 12,
      width: '48%',
    },
    addIcon: {
      color: theme.semantic.primary,
      fontSize: 28,
      fontWeight: '900',
      lineHeight: 30,
    },
    addPreview: {
      alignItems: 'center',
      aspectRatio: 16 / 9,
      backgroundColor: theme.semantic.input,
      borderColor: theme.semantic.borderStrong,
      borderRadius: 6,
      borderStyle: 'dashed',
      borderWidth: 1,
      justifyContent: 'center',
      width: '100%',
    },
    addText: { color: theme.semantic.textSecondary, fontWeight: '800' },
    card: {
      backgroundColor: theme.semantic.surface,
      borderColor: theme.semantic.border,
      borderRadius: 8,
      borderWidth: 1,
      gap: 8,
      height: 194,
      padding: 12,
      width: '48%',
    },
    categoryBadge: {
      alignSelf: 'flex-start',
      backgroundColor: theme.semantic.primary,
      borderRadius: 12,
      color: theme.semantic.onPrimary,
      fontSize: 12,
      fontWeight: '800',
      overflow: 'hidden',
      paddingHorizontal: 9,
      paddingVertical: 4,
    },
    meta: { color: theme.semantic.textMuted, fontSize: 13 },
    thumbnail: { backgroundColor: theme.semantic.mediaPlaceholder, borderRadius: 6, height: 96 },
    title: { color: theme.semantic.text, fontSize: 16, fontWeight: '800', minHeight: 20 },
  });
