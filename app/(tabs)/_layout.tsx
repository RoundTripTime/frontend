import { Tabs } from 'expo-router';
import React from 'react';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { HapticTab } from '@/src/components/haptic-tab';
import { IconSymbol } from '@/src/components/ui/icon-symbol';
import { appThemes } from '@/src/theme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const theme = appThemes[colorScheme === 'dark' ? 'dark' : 'light'];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.semantic.primary,
        tabBarInactiveTintColor: theme.semantic.textMuted,
        tabBarStyle: {
          backgroundColor: theme.semantic.surface,
          borderTopColor: theme.semantic.border,
        },
        tabBarButton: HapticTab,
      }}
    >
      {/*
        화면: 하단 탭 레이아웃
        기능: 홈, 플랜, 커뮤니티, 둘러보기, 설정 탭 화면을 연결한다.
        가능한 다음 이동 화면: S-02, S-06, S-10, S-11, S-12
      */}
      <Tabs.Screen
        name="index"
        options={{
          title: '홈',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="plans"
        options={{
          title: '플랜',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="calendar" color={color} />,
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: '커뮤니티',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.2.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: '둘러보기',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: '설정',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="gearshape.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
