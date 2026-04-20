import React, { useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { MapPin, Search, Navigation, Heart } from 'lucide-react';
import AIGuardianBuddy from '@/components/AIGuardianBuddy';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { GEOAPIFY_KEY, NAV_API_KEY, OPENCAGE_API_KEY } from '@/lib/config';

// Import images
import templeImage from '@/assets/temple-complex.jpg';
import mountainImage from '@/assets/mountain-viewpoint.jpg';
import foodMarketImage from '@/assets/food-market.jpg';
import adventureImage from '@/assets/adventure-center.jpg';

// Tourist attractions with real images
const attractions = [
  {
    id: 1,
    name: 'Ancient Temple Complex',
    category: 'Culture',
    coordinates: [28.6139, 77.2090] as [number, number],
    description: 'A magnificent 800-year-old temple with intricate carvings and rich history.',
    funTip: 'Legend says making a wish here on a full moon brings good luck! 🌕',
    rating: 4.8,
    image: templeImage,
    safetyLevel: 'high',
    fullDescription: 'This ancient temple complex dates back to the 12th century and features stunning Indo-Islamic architecture.'
  },
  {
    id: 2,
    name: 'Charminar',
    category: 'Culture', 
    coordinates: [17.3616, 78.4747] as [number, number],
    description: 'Historic monument and mosque in Hyderabad, India. Built in 1591.',
    funTip: 'The four minarets represent the first four Caliphs of Islam! 🕌',
    rating: 4.9,
    image: templeImage,
    safetyLevel: 'high',
    fullDescription: 'Charminar is a monument and mosque located in Hyderabad, Telangana, India. The landmark has become known globally as a symbol of Hyderabad and is listed among the most recognized structures in India.'
  },
  {
    id: 3,
    name: 'Mountain Peak Viewpoint',
    category: 'Nature',
    coordinates: [28.6239, 77.2190] as [number, number],
    description: 'Breathtaking panoramic views of the valley below.',
    funTip: 'Best sunrise spot in the region - but bring a jacket, it gets chilly! 🌅',
    rating: 4.9,
    image: mountainImage,
    safetyLevel: 'medium',
    fullDescription: 'Located at 2,400 meters above sea level, this viewpoint offers spectacular 360-degree views.'
  },
  {
    id: 4,
    name: 'Local Food Market',
    category: 'Food',
    coordinates: [28.6039, 77.1990] as [number, number],
    description: 'Authentic local cuisine and traditional delicacies.',
    funTip: 'Try the spicy samosas, but have milk ready! The vendors love to prank tourists. 🌶️',
    rating: 4.7,
    image: foodMarketImage,
    safetyLevel: 'high',
    fullDescription: 'This bustling market has been serving authentic local cuisine for over 100 years.'
  },
  {
    id: 5,
    name: 'Adventure Sports Center',
    category: 'Adventure',
    coordinates: [28.6340, 77.2290] as [number, number],
    description: 'Zip-lining, rock climbing, and river rafting activities.',
    funTip: 'Don\'t forget to scream - it\'s scientifically proven to make rides more fun! 🎢',
    rating: 4.6,
    image: adventureImage,
    safetyLevel: 'low',
    fullDescription: 'Adrenaline junkies paradise! Features the longest zip-line in the region (2.5km).'
  }
];

const categoryColors = {
  Culture: '#8B5CF6',
  Nature: '#10B981',
  Food: '#F59E0B',
  Adventure: '#EF4444'
};

const Map: React.FC = () => {
  const [selectedAttraction, setSelectedAttraction] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showGuardian, setShowGuardian] = useState(true);

  // Map state
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [placeQuery, setPlaceQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ name: string; lat: number; lon: number; formatted?: string }[]>([]);
  const [selectedDestination, setSelectedDestination] = useState<{ name: string; lat: number; lon: number } | null>(null);
  const [routeCoords, setRouteCoords] = useState<LatLngExpression[] | null>(null);
  const [nearbyPlaces, setNearbyPlaces] = useState<Array<{ id: string; name: string; category: string; lat: number; lon: number; address?: string }>>([]);

  const apiKey = useMemo(() => GEOAPIFY_KEY, []);

  // Fix default marker icons in Vite
  const DefaultIcon = useMemo(() => {
    return L.icon({
      iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).toString(),
      iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).toString(),
      shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).toString(),
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });
  }, []);
  
  // Create custom icons for different marker types
  const UserLocationIcon = useMemo(() => {
    return L.divIcon({
      className: 'custom-div-icon',
      html: '<div style="background-color: #3b82f6; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; font-size: 12px;">📍</div>',
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });
  }, []);

  const AttractionIcon = useMemo(() => {
    return L.divIcon({
      className: 'custom-div-icon',
      html: '<div style="background-color: #10b981; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; font-size: 14px;">🏛️</div>',
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  }, []);

  const DestinationIcon = useMemo(() => {
    return L.divIcon({
      className: 'custom-div-icon',
      html: '<div style="background-color: #f59e0b; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; font-size: 14px;">🎯</div>',
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (L.Marker as any).prototype.options.icon = DefaultIcon;

  // Geolocation
  React.useEffect(() => {
    if (!('geolocation' in navigator)) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation([pos.coords.latitude, pos.coords.longitude]);
      },
      () => {
        // Fallback to a default (Delhi) if user denies
        setUserLocation([28.6139, 77.2090]);
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 10000 }
    );
  }, []);

  const SearchAndRouteControls: React.FC = () => {
    const map = useMap();

    React.useEffect(() => {
      if (userLocation) {
        map.setView(userLocation as LatLngExpression, 13);
      }
    }, [userLocation, map]);

    React.useEffect(() => {
      if (selectedDestination) {
        map.flyTo([selectedDestination.lat, selectedDestination.lon], 14);
      }
    }, [selectedDestination, map]);

    React.useEffect(() => {
      if (routeCoords && routeCoords.length > 1) {
        const bounds = L.latLngBounds(routeCoords as [number, number][]);
        map.fitBounds(bounds.pad(0.2));
      }
    }, [routeCoords, map]);

    return null;
  };

  // Work around type noise from react-leaflet typings in our setup
  const RMapContainer = MapContainer as unknown as React.FC<any>;
  const RTileLayer = TileLayer as unknown as React.FC<any>;

  async function fetchRouteAndDraw(start: [number, number], end: [number, number]) {
    try {
      const wp = `${start[0]},${start[1]}|${end[0]},${end[1]}`;
      // Try NAV_API_KEY first; if it fails, retry with GEOAPIFY_KEY
      const tryKeys = [NAV_API_KEY, apiKey].filter(Boolean) as string[];
      let poly: LatLngExpression[] | null = null;
      // eslint-disable-next-line no-restricted-syntax
      for (const key of tryKeys) {
        const url = `https://api.geoapify.com/v1/routing?waypoints=${encodeURIComponent(wp)}&mode=drive&apiKey=${key}`;
        const res = await fetch(url);
        if (!res.ok) continue;
        const data = await res.json();
        const coords = data?.features?.[0]?.geometry?.coordinates?.[0] || [];
        if (coords.length > 0) {
          poly = coords.map((c: [number, number]) => [c[1], c[0]]);
          break;
        }
      }
      setRouteCoords(poly);
    } catch {
      setRouteCoords(null);
    }
  }

  const openInGoogleMaps = (attraction: any) => {
    const [lat, lng] = attraction.coordinates;
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${attraction.name}`;
    window.open(url, '_blank');
  };

  const filteredAttractions = attractions.filter(attraction => {
    const matchesSearch = attraction.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         attraction.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || attraction.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categoryToImage: Record<string, string> = {
    Culture: templeImage,
    Nature: mountainImage,
    Food: foodMarketImage,
    Adventure: adventureImage,
  };

  function mapGeoapifyCategoryToOurCategory(categories: string[] | undefined): keyof typeof categoryToImage {
    const cats = categories || [];
    if (cats.some((c) => c.includes('catering') || c.includes('restaurant') || c.includes('food')))
      return 'Food';
    if (cats.some((c) => c.includes('tourism') || c.includes('museum') || c.includes('attraction') || c.includes('religion')))
      return 'Culture';
    if (cats.some((c) => c.includes('outdoors') || c.includes('natural')))
      return 'Nature';
    if (cats.some((c) => c.includes('sport') || c.includes('activity')))
      return 'Adventure';
    return 'Culture';
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border p-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <MapPin className="h-6 w-6 text-primary" />
                Interactive Map (Free OpenStreetMap)
              </h1>
              <p className="text-muted-foreground">Discover amazing places around you</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search attractions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
              
              <div className="flex gap-2">
                {['All', 'Culture', 'Nature', 'Food', 'Adventure'].map((category) => (
                  <Button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    size="sm"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row h-screen">
        {/* Map */}
        <div className="flex-1 relative">
          <div className="absolute inset-0">
            <RMapContainer
              center={userLocation || [28.6139, 77.2090]}
              zoom={12}
              style={{ height: '100%', width: '100%' }}
            >
              <RTileLayer
                url={`https://maps.geoapify.com/v1/tile/carto/{z}/{x}/{y}.png?&apiKey=${apiKey}`}
                attribution="&copy; OpenStreetMap contributors, &copy; Geoapify"
              />
              <SearchAndRouteControls />

              {userLocation && (
                <Marker position={userLocation} icon={UserLocationIcon}>
                  <Popup>📍 Your current location</Popup>
                </Marker>
              )}

              {/* Selected destination */}
              {selectedDestination && (
                <Marker position={[selectedDestination.lat, selectedDestination.lon]} icon={DestinationIcon}>
                  <Popup>🎯 {selectedDestination.name || 'Destination'}</Popup>
                </Marker>
              )}

              {/* Attractions markers */}
              {attractions.map((a) => (
                <Marker key={a.id} position={a.coordinates as LatLngExpression} icon={AttractionIcon}>
                  <Popup>
                    <div className="space-y-1">
                      <div className="font-semibold text-sm">🏛️ {a.name}</div>
                      <div className="text-xs text-muted-foreground">{a.description}</div>
                    </div>
                  </Popup>
                </Marker>
              ))}

              {/* Nearby places markers from Places API */}
              {nearbyPlaces.map((p) => (
                <Marker key={p.id} position={[p.lat, p.lon] as LatLngExpression} icon={AttractionIcon}>
                  <Popup>
                    <div className="space-y-1">
                      <div className="font-semibold text-sm">📍 {p.name}</div>
                      <div className="text-xs text-muted-foreground">{p.address}</div>
                    </div>
                  </Popup>
                </Marker>
              ))}

              {/* Route polyline */}
              {routeCoords && (
                <Polyline positions={routeCoords} pathOptions={{ color: '#2563eb', weight: 5, opacity: 0.8 }} />
              )}
            </RMapContainer>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-96 bg-card border-l border-border overflow-y-auto">
          <div className="p-4 space-y-4">
            {/* Place search */}
            <div className="space-y-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search places (Geoapify)..."
                  value={placeQuery}
                  onChange={(e) => setPlaceQuery(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={async () => {
                    if (!placeQuery.trim()) return;
                    try {
                      // Use OpenCage for geocoding
                      const res = await fetch(
                        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(placeQuery)}&key=${OPENCAGE_API_KEY}&limit=5`
                      );
                      const data = await res.json();
                      const items = (data?.results || []).map((f: any) => ({
                        name: f.formatted || f.components?.name || 'Place',
                        formatted: f.formatted,
                        lat: f.geometry?.lat,
                        lon: f.geometry?.lng,
                      }));
                      setSearchResults(items);
                      if (items.length > 0) {
                        const top = items[0];
                        setSelectedDestination({ name: top.name, lat: top.lat, lon: top.lon });
                        // Fetch nearby places from Geoapify Places API around the found location
                        try {
                          const rect = `${top.lon-0.02},${top.lat-0.02},${top.lon+0.02},${top.lat+0.02}`;
                          const placesUrl = `https://api.geoapify.com/v2/places?categories=tourism.sights,entertainment,mobility,commercial.food_and_drink&filter=rect:${rect}&limit=20&apiKey=${apiKey}`;
                          const pRes = await fetch(placesUrl);
                          const pData = await pRes.json();
                          const pItems = (pData?.features || []).map((f: any) => ({
                            id: f.properties?.place_id || `${f.properties?.lat}-${f.properties?.lon}`,
                            name: f.properties?.name || f.properties?.street || 'Point of interest',
                            category: mapGeoapifyCategoryToOurCategory(f.properties?.categories) as string,
                            lat: f.properties?.lat,
                            lon: f.properties?.lon,
                            address: f.properties?.formatted,
                          }));
                          setNearbyPlaces(pItems);
                        } catch {
                          setNearbyPlaces([]);
                        }
                      }
                    } catch {
                      setSearchResults([]);
                    }
                  }}
                >
                  Search
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSearchResults([]);
                    setPlaceQuery('');
                  }}
                >
                  Clear
                </Button>
              </div>

              {searchResults.length > 0 && (
                <div className="max-h-48 overflow-auto rounded border border-border divide-y">
                  {searchResults.map((r, idx) => (
                    <div key={`${r.lat}-${r.lon}-${idx}`} className="p-2 text-sm flex items-start justify-between gap-2">
                      <div>
                        <div className="font-medium">{r.name}</div>
                        <div className="text-muted-foreground text-xs">{r.formatted}</div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => setSelectedDestination(r)}>
                          Set Dest
                        </Button>
                        <Button
                          size="sm"
                          onClick={async () => {
                            setSelectedDestination(r);
                            if (!userLocation) return;
                            await fetchRouteAndDraw(userLocation, [r.lat, r.lon]);
                          }}
                        >
                          Route
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <h2 className="text-lg font-semibold mb-4">
              Tourist Attractions ({filteredAttractions.length + (selectedDestination ? 1 : 0) + nearbyPlaces.length})
            </h2>
            
            <div className="space-y-4">
              {selectedDestination && (
                <Card 
                  key={`dest-${selectedDestination.lat}-${selectedDestination.lon}`}
                  className={`cursor-pointer travel-card`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-sm">{selectedDestination.name}</h3>
                      <Badge className="text-xs">Search</Badge>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">Lat {selectedDestination.lat.toFixed(5)}, Lon {selectedDestination.lon.toFixed(5)}</div>
                    <div className="mt-3 flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={async () => {
                          if (!userLocation) return;
                          await fetchRouteAndDraw(userLocation, [selectedDestination.lat, selectedDestination.lon]);
                        }}
                        className="flex items-center gap-1 text-xs"
                      >
                        <Navigation className="h-3 w-3" />
                        Get Directions
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {nearbyPlaces.map((p) => (
                <Card key={`p-${p.id}`} className="cursor-pointer travel-card">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-sm">{p.name}</h3>
                      <Badge className="text-xs">Nearby</Badge>
                    </div>
                    <div className="mb-2">
                      <img src={categoryToImage[p.category as keyof typeof categoryToImage]} alt={p.name} className="w-full h-24 object-cover rounded-lg" />
                    </div>
                    <div className="text-xs text-muted-foreground">{p.address}</div>
                    <div className="mt-3 flex gap-2">
                      <Button size="sm" variant="outline" className="flex items-center gap-1 text-xs" onClick={async () => {
                        setSelectedDestination({ name: p.name, lat: p.lat, lon: p.lon });
                        if (!userLocation) return;
                        await fetchRouteAndDraw(userLocation, [p.lat, p.lon]);
                      }}>
                        <Navigation className="h-3 w-3" /> Route
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {filteredAttractions.map((attraction) => (
                <Card 
                  key={attraction.id}
                  className={`cursor-pointer travel-card ${
                    selectedAttraction?.id === attraction.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedAttraction(attraction)}
                >
                  <CardContent className="p-4">
                    <img 
                      src={attraction.image} 
                      alt={attraction.name}
                      className="w-full h-24 object-cover rounded-lg mb-3"
                    />
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-sm">{attraction.name}</h3>
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mb-3">
                      {attraction.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge 
                          style={{ 
                            backgroundColor: categoryColors[attraction.category as keyof typeof categoryColors],
                            color: 'white'
                          }}
                          className="text-xs"
                        >
                          {attraction.category}
                        </Badge>
                        <span className="text-xs flex items-center gap-1">
                          ⭐ {attraction.rating}
                        </span>
                      </div>
                      <Badge 
                        variant={attraction.safetyLevel === 'high' ? 'default' : 
                                attraction.safetyLevel === 'medium' ? 'secondary' : 'destructive'}
                        className="text-xs"
                      >
                        {attraction.safetyLevel} safety
                      </Badge>
                    </div>
                    
                    <div className="mt-3 p-2 bg-muted rounded text-xs italic">
                      💡 {attraction.funTip}
                    </div>
                    
                    <div className="mt-3 flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => openInGoogleMaps(attraction)}
                        className="flex items-center gap-1 text-xs"
                      >
                        <MapPin className="h-3 w-3" />
                        Open in Maps
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={async () => {
                          setSelectedDestination({ name: attraction.name, lat: attraction.coordinates[0], lon: attraction.coordinates[1] });
                          if (!userLocation) return;
                          await fetchRouteAndDraw(userLocation, [attraction.coordinates[0], attraction.coordinates[1]]);
                        }}
                        className="flex items-center gap-1 text-xs"
                      >
                        <Navigation className="h-3 w-3" />
                        Get Directions
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI Guardian Buddy */}
      <AIGuardianBuddy isVisible={showGuardian} onToggle={() => setShowGuardian(!showGuardian)} />
    </div>
  );
};

export default Map;