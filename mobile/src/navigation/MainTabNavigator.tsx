import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FeedNavigator } from './FeedNavigator';
import { CreateNavigator } from './CreateNavigator';
import { ProfileNavigator } from './ProfileNavigator';
import { MainTabParamList } from './types';
import { colors } from '../theme/theme';

const Tab = createBottomTabNavigator<MainTabParamList>();

const ICONS: Record<keyof MainTabParamList, string> = {
  FeedTab: '🏠',
  CreateTab: '➕',
  ProfileTab: '👤',
};

export function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textFaint,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        tabBarIcon: () => (
          <Text style={{ fontSize: 18 }}>
            {ICONS[route.name as keyof MainTabParamList]}
          </Text>
        ),
      })}
    >
      <Tab.Screen
        name="FeedTab"
        component={FeedNavigator}
        options={{ title: 'Feed' }}
      />
      <Tab.Screen
        name="CreateTab"
        component={CreateNavigator}
        options={{ title: 'Publicar' }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileNavigator}
        options={{ title: 'Perfil' }}
      />
    </Tab.Navigator>
  );
}
