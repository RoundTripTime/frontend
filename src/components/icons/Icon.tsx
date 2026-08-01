import { Ionicons } from '@expo/vector-icons';

import { colors, type ColorToken } from '@/src/theme/colors';

type IconName = keyof typeof Ionicons.glyphMap;

type IconProps = {
  name: IconName;
  size?: number;
  color?: ColorToken;
};

export function Icon({ name, size = 24, color = 'ink' }: IconProps) {
  return <Ionicons name={name} size={size} color={colors[color]} />;
}

export type { IconName, IconProps };
