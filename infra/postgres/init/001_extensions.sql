-- Enable PostGIS support for geolocation queries (venues latitude/longitude, radius search, etc.)
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
