# WaterCloset Search/Browse Bathrooms Page

## Overview
The search page (`/search`) provides a comprehensive interface for users to find and browse bathroom listings. It features a map view, list view, location search with autocomplete, and advanced filtering options.

## Files Created/Modified

### Core Page
- `/app/pages/search.vue` - Main search page with map/list toggle and filtering

### Components
- `/app/components/search/MapView.vue` - Interactive map using Leaflet and Geoapify tiles
- `/app/components/search/PropertyCard.vue` - Property listing card component
- `/app/components/search/FilterSidebar.vue` - Advanced filtering sidebar
- `/app/components/search/LocationSearch.vue` - Location search with Geoapify autocomplete

### API Routes
- `/app/server/api/[...slug].ts` - Generic proxy for all Payload API requests
- `/app/server/api/properties/nearby.get.ts` - Nearby properties search using geolocation

## Features Implemented

### 1. Map View
- **Library**: Leaflet with Geoapify tiles
- **Features**:
  - Interactive map markers for each property
  - Custom pin icons that change color when selected
  - Popup showing property name and price on marker click
  - Auto-fit bounds to show all properties
  - Pan to location on search

### 2. List View
- **Grid Layout**: Responsive grid (1 column mobile, 2 on tablet, 3 on desktop)
- **Property Cards**: Show image, name, location, price, rating, and amenities
- **Click to Details**: Navigate to property detail page

### 3. Location Search
- **Geoapify Autocomplete**: Real-time location suggestions as you type
- **Current Location**: Button to use browser geolocation
- **Reverse Geocoding**: Convert coordinates to human-readable addresses

### 4. Filtering
- **Price Range**: Dual slider for min/max price per hour
- **Property Types**: Residential, Commercial, Restaurant, Hotel
- **Amenities**: Wheelchair accessible, baby changing, shower, bidet, etc.
- **Minimum Rating**: Filter by average rating (0-5 stars)
- **Active Filter Count**: Badge showing number of active filters
- **Reset Filters**: One-click reset to defaults

### 5. Mobile Responsive
- **Toggle Views**: Switch between map and list on mobile
- **Filter Drawer**: Slide-out filter panel on mobile
- **Sticky Header**: Search bar stays visible while scrolling

### 6. Geolocation
- **Auto-detect**: Gets user location on page load
- **Nearby Search**: Fetches properties within 50km radius
- **Distance Calculation**: Haversine formula for accurate distances

## Data Structure

### Property Interface
```typescript
interface Property {
  id: string
  name: string
  description?: any // Rich text from Payload
  pricePerMinute: number // In cents
  photos?: Array<{
    image: { url: string; alt?: string }
    caption?: string
  }>
  location?: {
    address?: string
    city?: string
    state?: string
    zipCode?: string
    coordinates?: {
      type: string
      coordinates: [number, number] // [lng, lat] PostGIS format
    }
  }
  amenities?: string[] // Array of amenity values
  type?: string // Property type
  stats?: {
    averageRating?: number
    reviewCount?: number
  }
  status?: string
}
```

### Amenity Mapping
The app uses internal values that map to display labels:
- `wheelchair` → "Wheelchair Accessible"
- `baby_changing` → "Baby Changing Station"
- `shower` → "Shower"
- `bidet` → "Bidet"
- `air_freshener` → "Air Freshener"
- `hand_dryer` → "Hand Dryer"
- `paper_towels` → "Paper Towels"
- `feminine` → "Feminine Products"
- `mirror` → "Mirror"
- `climate` → "Climate Controlled"
- `private` → "Private"
- `gender_neutral` → "Gender Neutral"

## API Integration

### Endpoints Used
1. **GET `/api/properties`** - Fetch all active properties
2. **GET `/api/properties/nearby`** - Search properties by location
   - Query params: `lat`, `lng`, `radius` (in meters)
   - Returns properties sorted by distance

### Geoapify API
- **Autocomplete**: `https://api.geoapify.com/v1/geocode/autocomplete`
- **Reverse Geocode**: `https://api.geoapify.com/v1/geocode/reverse`
- **Map Tiles**: `https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png`

API Key is configured in `/apps/api/.env` as `GEOAPIFY_API_KEY`

## Configuration

### Environment Variables
```env
# In apps/api/.env
GEOAPIFY_API_KEY=a2d082683a4d4290b5879815f5388db9
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3001

# In nuxt.config.ts (auto-configured)
NUXT_PUBLIC_GEOAPIFY_KEY=a2d082683a4d4290b5879815f5388db9
```

### Nuxt Config Changes
- Commented out the `/api/**` proxy route rule
- Now using custom Nitro server routes in `/app/server/api/`

## Usage

### Navigate to Search Page
```
http://localhost:3002/search
```

### URL Query Parameters
The search page supports URL parameters:
- `lat` - Latitude
- `lng` - Longitude
- `location` - Location name (display only)

Example: `/search?lat=37.7749&lng=-122.4194&location=San Francisco, CA`

## Filter Behavior

### Price Conversion
- Properties store `pricePerMinute` in cents
- UI displays and filters by price per hour in dollars
- Conversion: `(pricePerMinute / 100) * 60`

### Property Type Matching
- Case-insensitive matching
- Partial string matching (e.g., "residential" matches "Residential")

### Amenity Filtering
- Requires ALL selected amenities to be present (AND logic)
- Uses internal amenity values for matching

## Known Limitations

1. **Database Required**: Needs Payload CMS running with PostgreSQL
2. **Sample Data**: No properties will show unless database is seeded
3. **Image Fallback**: Uses `/placeholder-bathroom.jpg` if no photos uploaded
4. **Distance Calculation**: Server-side filtering (not using PostGIS spatial queries)

## Next Steps

To make the search page fully functional:

1. **Seed Database**: Add sample properties with coordinates
   ```bash
   npm run db:start
   # Then seed properties via Payload admin
   ```

2. **Upload Images**: Add photos to properties in Payload admin

3. **Test Geolocation**: Allow browser location access to test nearby search

4. **Performance**: Consider implementing PostGIS spatial queries for better performance at scale

## Testing the Page

1. Start the development server:
   ```bash
   npm run dev:web
   ```

2. Navigate to `http://localhost:3002/search`

3. Grant location permissions when prompted (or search manually)

4. Try filtering by:
   - Price range
   - Property type
   - Amenities
   - Minimum rating

5. Test map interactions:
   - Click markers to see property info
   - Click property cards to highlight on map
   - Toggle between map and list view on mobile
