import { Image } from 'expo-image';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { SkeletonBlock } from '@/src/components/LoadingSkeleton';

type AvatarProps = {
  size: number;
  uri?: string | null;
};

export function Avatar({ size, uri }: AvatarProps) {
  const [didFail, setDidFail] = useState(false);
  const normalizedUri = uri?.trim();

  if (!normalizedUri || didFail) {
    return <SkeletonBlock height={size} width={size} borderRadius={size / 2} />;
  }

  return (
    <View style={{ borderRadius: size / 2, height: size, overflow: 'hidden', width: size }}>
      <Image
        contentFit="cover"
        source={{ uri: normalizedUri }}
        style={styles.image}
        onError={() => {
          setDidFail(true);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  image: { height: '100%', width: '100%' },
});
