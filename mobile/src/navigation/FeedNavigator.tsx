import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FeedScreen } from '../screens/feed/FeedScreen';
import { PostDetailScreen } from '../screens/feed/PostDetailScreen';
import { VenueProfileScreen } from '../screens/venue/VenueProfileScreen';
import { BandProfileScreen } from '../screens/band/BandProfileScreen';
import { FeedStackParamList } from './types';
import { colors } from '../theme/theme';

const Stack = createNativeStackNavigator<FeedStackParamList>();

export function FeedNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerTitleStyle: { color: colors.text },
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen
        name="Feed"
        component={FeedScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PostDetail"
        component={PostDetailScreen}
        options={{ title: '' }}
      />
      <Stack.Screen
        name="VenueProfile"
        component={VenueProfileScreen}
        options={{ title: '' }}
      />
      <Stack.Screen
        name="BandProfile"
        component={BandProfileScreen}
        options={{ title: '' }}
      />
    </Stack.Navigator>
  );
}
