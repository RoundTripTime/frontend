import { useMemo, useRef } from 'react';
import {
  Animated,
  PanResponder,
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
  type ViewStyle,
} from 'react-native';

import type { ReactNode } from 'react';

type MapOverlaySheetProps = {
  children: ReactNode;
  collapsedHeight?: number;
  expandedRatio?: number;
  style?: ViewStyle;
};

export function MapOverlaySheet({
  children,
  collapsedHeight = 112,
  expandedRatio = 0.58,
  style,
}: MapOverlaySheetProps) {
  const { height } = useWindowDimensions();
  const expandedHeight = Math.max(collapsedHeight, Math.round(height * expandedRatio));
  const collapsedTranslateY = expandedHeight - collapsedHeight;
  const translateY = useRef(new Animated.Value(collapsedTranslateY)).current;
  const lastTranslateY = useRef(collapsedTranslateY);

  const animateTo = (nextValue: number) => {
    lastTranslateY.current = nextValue;
    Animated.spring(translateY, {
      damping: 28,
      mass: 0.7,
      overshootClamping: true,
      stiffness: 260,
      toValue: nextValue,
      useNativeDriver: true,
    }).start();
  };

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dy) > 8,
        onPanResponderGrant: () => {
          translateY.stopAnimation((value) => {
            lastTranslateY.current = value;
          });
        },
        onPanResponderMove: (_, gesture) => {
          const nextValue = Math.min(
            collapsedTranslateY,
            Math.max(0, lastTranslateY.current + gesture.dy),
          );
          translateY.setValue(nextValue);
        },
        onPanResponderRelease: (_, gesture) => {
          const shouldExpand =
            gesture.vy < -0.35 || lastTranslateY.current + gesture.dy < collapsedTranslateY / 2;
          animateTo(shouldExpand ? 0 : collapsedTranslateY);
        },
        onPanResponderTerminate: () => animateTo(collapsedTranslateY),
        onStartShouldSetPanResponder: () => false,
        onStartShouldSetPanResponderCapture: () => false,
        onMoveShouldSetPanResponderCapture: (_, gesture) =>
          Math.abs(gesture.dy) > 8 && Math.abs(gesture.dy) > Math.abs(gesture.dx),
      }),
    [collapsedTranslateY, translateY],
  );

  return (
    <Animated.View
      style={[styles.sheet, { height: expandedHeight, transform: [{ translateY }] }, style]}
      {...panResponder.panHandlers}
    >
      <Pressable
        accessibilityRole="button"
        style={styles.handleHitBox}
        onPress={() => {
          translateY.stopAnimation((value) => {
            animateTo(value > collapsedTranslateY / 2 ? 0 : collapsedTranslateY);
          });
        }}
      >
        <View style={styles.handle} />
      </Pressable>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  handle: {
    alignSelf: 'center',
    backgroundColor: '#9CA3AF',
    borderRadius: 2,
    height: 4,
    width: 42,
  },
  handleHitBox: {
    justifyContent: 'center',
    minHeight: 26,
  },
  sheet: {
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    bottom: 0,
    left: 0,
    overflow: 'hidden',
    position: 'absolute',
    right: 0,
  },
});
