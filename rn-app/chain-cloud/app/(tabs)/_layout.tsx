import { Tabs } from "expo-router";
import React from "react";
import { Platform, Animated } from "react-native";
import { BlurView } from "expo-blur";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const tabBarHeight = Platform.OS === 'ios' ? 85 : 60;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        tabBarInactiveTintColor: Colors[colorScheme ?? "light"].text,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: () => (
          <BlurView
            intensity={80}
            tint={colorScheme ?? "light"}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          />
        ),
        tabBarStyle: {
          height: tabBarHeight,
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          backgroundColor: 'transparent',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginBottom: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Animated.View
              style={{
                transform: [{ scale: focused ? 1.1 : 1 }],
              }}
            >
              <IconSymbol size={28} name="house.fill" color={color} />
            </Animated.View>
          ),
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: "Stats",
          tabBarIcon: ({ color, focused }) => (
            <Animated.View
              style={{
                transform: [{ scale: focused ? 1.1 : 1 }],
              }}
            >
              <IconSymbol size={28} name="chart.bar.fill" color={color} />
            </Animated.View>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, focused }) => (
            <Animated.View
              style={{
                transform: [{ scale: focused ? 1.1 : 1 }],
              }}
            >
              <IconSymbol size={28} name="gear" color={color} />
            </Animated.View>
          ),
        }}
      />
    </Tabs>
  );
}
