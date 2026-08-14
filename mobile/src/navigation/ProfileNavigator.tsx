import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MyProfileScreen } from '../screens/profile/MyProfileScreen';
import { MyVenuesScreen } from '../screens/venue/MyVenuesScreen';
import { VenueFormScreen } from '../screens/venue/VenueFormScreen';
import { ProfileStackParamList } from './types';
import { colors } from '../theme/theme';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export function ProfileNavigator() {
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
        name="MyProfile"
        component={MyProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MyVenues"
        component={MyVenuesScreen}
        options={{ title: '' }}
      />
      <Stack.Screen
        name="VenueForm"
        component={VenueFormScreen}
        options={{ title: '' }}
      />
    </Stack.Navigator>
  );
}
