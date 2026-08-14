export enum UserRole {
  USER = 'user',
  VENUE_ADMIN = 'venue_admin',
  BAND_ADMIN = 'band_admin',
  SUPERADMIN = 'superadmin',
}

export enum PostType {
  EVENT = 'event',
  PROMO = 'promo',
  MERCH = 'merch',
  NEWS = 'news',
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  favoriteGenres: string[];
  createdAt: string;
}

export interface Region {
  id: number;
  name: string;
  code: string;
  isActive: boolean;
}

export interface SubscriptionPlan {
  id: number;
  name: string;
  showAds: boolean;
  featuredInFeed: boolean;
  price: string;
}

export interface Venue {
  id: number;
  ownerId: number;
  regionId: number;
  region?: Region;
  planId: number | null;
  plan?: SubscriptionPlan | null;
  name: string;
  slug: string;
  description: string | null;
  address: string;
  neighborhood: string | null;
  city: string;
  latitude: string | null;
  longitude: string | null;
  logoUrl: string | null;
  bannerUrl: string | null;
  mpQrUrl: string | null;
  mpLink: string | null;
  services: Record<string, unknown>;
  createdAt: string;
}

export interface Band {
  id: number;
  ownerId: number;
  name: string;
  slug: string;
  genre: string;
  bio: string | null;
  logoUrl: string | null;
  bannerUrl: string | null;
  instagramUrl: string | null;
  facebookUrl: string | null;
  youtubeEmbedUrls: string[];
  mpLink: string | null;
  createdAt: string;
}

export interface Post {
  id: number;
  venueId: number;
  venue?: Venue;
  bandId: number | null;
  band?: Band | null;
  postType: PostType;
  title: string;
  content: string;
  mediaUrls: string[];
  youtubeUrl: string | null;
  ticketLink: string | null;
  price: string | null;
  eventDate: string | null;
  createdAt: string;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiEnvelope<T> {
  success: boolean;
  statusCode: number;
  data: T;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}
