import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type FeedStackParamList = {
  Feed: undefined;
  PostDetail: { postId: number };
  VenueProfile: { venueId: number };
  BandProfile: { bandId: number };
};

export type CreateStackParamList = {
  CreatePost: undefined;
};

export type ProfileStackParamList = {
  MyProfile: undefined;
  MyVenues: undefined;
  VenueForm: { venueId?: number };
};

export type MainTabParamList = {
  FeedTab: undefined;
  CreateTab: undefined;
  ProfileTab: undefined;
};

export type AuthStackScreenProps<T extends keyof AuthStackParamList> =
  NativeStackScreenProps<AuthStackParamList, T>;

export type FeedStackScreenProps<T extends keyof FeedStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<FeedStackParamList, T>,
    BottomTabScreenProps<MainTabParamList>
  >;

export type ProfileStackScreenProps<T extends keyof ProfileStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<ProfileStackParamList, T>,
    BottomTabScreenProps<MainTabParamList>
  >;

export type CreateStackScreenProps<T extends keyof CreateStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<CreateStackParamList, T>,
    BottomTabScreenProps<MainTabParamList>
  >;
