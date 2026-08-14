import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CreatePostScreen } from '../screens/posts/CreatePostScreen';
import { CreateStackParamList } from './types';
import { colors } from '../theme/theme';

const Stack = createNativeStackNavigator<CreateStackParamList>();

export function CreateNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="CreatePost" component={CreatePostScreen} />
    </Stack.Navigator>
  );
}
