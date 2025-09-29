import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Info, Search, Filter, MapPin, Clock, Star, Camera, BookOpen, Globe, Calendar, Utensils, Users, Languages, Shield, QrCode, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import AIGuardianBuddy from '@/components/AIGuardianBuddy';
import FestivalCalendar from '@/components/FestivalCalendar';
import VerificationPanel from '@/components/VerificationPanel';
import VerificationBadge from '@/components/VerificationBadge';
import QRCodeScanner from '@/components/QRCodeScanner';
import SecureBooking from '@/components/SecureBooking';
import DigitalTouristIDComponent from '@/components/DigitalTouristID';

// Import images
import templeImage from '@/assets/temple-complex.jpg';
import mountainImage from '@/assets/mountain-viewpoint.jpg';
import foodMarketImage from '@/assets/food-market.jpg';
import adventureImage from '@/assets/adventure-center.jpg';
import traditionalThali from '@/assets/traditional-thali.jpg';
import festivalImage from '@/assets/festival-celebration.jpg';

const TouristInfo: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showGuardian, setShowGuardian] = useState(true);

  const touristSpots = [
    {
      id: 1,
      name: 'Mystical Temple of Serenity',
      category: 'Culture',
      rating: 4.8,
      history: 'Built in the 12th century, this temple has witnessed the rise and fall of three dynasties. The intricate stone carvings tell stories of ancient legends.',
      legend: '🏮 Legend says that couples who pray together here will have eternal happiness. The temple bells are said to grant wishes made with pure hearts.',
      timings: '6:00 AM - 8:00 PM',
      bestTime: 'Early morning or sunset',
      image: templeImage,
      funFacts: [
        'The temple has 108 steps, considered sacred in Hindu tradition',
        'Secret underground chambers were discovered in 1987',
        'The temple cats are believed to be guardians of good luck'
      ],
      guideId: 'guide_temple_001',
      verified: true
    },
    {
      id: 2,
      name: 'Whispering Hills Viewpoint',
      category: 'Nature',
      rating: 4.9,
      history: 'These hills have been sacred to local tribes for over 500 years. Ancient rock paintings can still be found in hidden caves.',
      legend: '🌄 Local folklore says the hills whisper secrets to those who listen carefully at dawn. Many visitors report hearing faint melodies carried by the wind.',
      timings: '24/7 (Best: Sunrise & Sunset)',
      bestTime: '5:30 AM for sunrise',
      image: mountainImage,
      funFacts: [
        'Over 150 species of birds call these hills home',
        'The echo point can amplify your voice up to 7 times',
        'Ancient meteorite fragments are embedded in the rocks'
      ],
      guideId: 'guide_hills_002',
      verified: true
    },
    {
      id: 3,
      name: 'Royal Heritage Market',
      category: 'Culture',
      rating: 4.7,
      history: 'This 300-year-old market was once the trading center for royal families. Spices, silk, and precious gems passed through these very lanes.',
      legend: '🏺 They say a hidden treasure map is carved into one of the market\'s ancient pillars. Many have searched, but none have found it!',
      timings: '9:00 AM - 9:00 PM',
      bestTime: 'Evening for cultural performances',
      image: foodMarketImage,
      funFacts: [
        'The market has 147 shops selling traditional crafts',
        'Secret tunnels connect to the old royal palace',
        'The oldest shop has been run by the same family for 8 generations'
      ],
      guideId: 'guide_market_003',
      verified: false
    },
    {
      id: 4,
      name: 'Adventure Valley',
      category: 'Adventure',
      rating: 4.6,
      history: 'Once a treacherous mountain pass, now transformed into an adventure paradise while preserving its natural beauty.',
      legend: '⚡ Adventure seekers claim the valley gives them supernatural courage. Some say it\'s the mountain spirit blessing brave souls!',
      timings: '8:00 AM - 6:00 PM',
      bestTime: 'Morning for best weather',
      image: adventureImage,
      funFacts: [
        'Home to the longest zip-line in the region (2.5 km)',
        'Over 50 different adventure activities available',
        'The valley was formed by ancient glacial movements'
      ],
      guideId: 'guide_adventure_004',
      verified: true
    }
  ];

  const festivals = [
    {
      name: 'Spring Festival',
      date: 'March 15-17, 2024',
      description: 'Celebrates the arrival of spring with colorful decorations, traditional music, and dance performances.',
      image: festivalImage,
      activities: ['Traditional Dance', 'Music Concerts', 'Food Stalls', 'Craft Exhibition'],
      location: 'Town Center & Temple Complex'
    },
    {
      name: 'Harvest Celebration',
      date: 'September 22-24, 2024',
      description: 'Thanks giving festival celebrating the harvest season with local foods and community gatherings.',
      image: festivalImage,
      activities: ['Farm Tours', 'Cooking Competitions', 'Traditional Games', 'Bonfire Night'],
      location: 'Agricultural Fields & Community Center'
    },
    {
      name: 'Winter Light Festival',
      date: 'December 12-14, 2024',
      description: 'Illumination festival with thousands of lights, lanterns, and spectacular fireworks.',
      image: festivalImage,
      activities: ['Light Displays', 'Street Performances', 'Night Markets', 'Fireworks Show'],
      location: 'Entire City Center'
    }
  ];

  const traditionalFoods = [
    {
      name: 'Traditional Thali',
      description: 'Complete meal with rice, dal, vegetables, roti, and sweets served on a banana leaf.',
      image: traditionalThali,
      price: '₹150-250',
      ingredients: ['Basmati Rice', 'Dal', 'Mixed Vegetables', 'Roti', 'Pickle', 'Sweet'],
      spiceLevel: 'Medium',
      dietary: 'Vegetarian'
    },
    {
      name: 'Mountain Honey',
      description: 'Pure organic honey collected from high-altitude beehives.',
      image: traditionalThali,
      price: '₹300/bottle',
      ingredients: ['Pure Honey', 'Natural Herbs'],
      spiceLevel: 'None',
      dietary: 'Vegan'
    },
    {
      name: 'Street Chaat',
      description: 'Spicy and tangy street snacks that are a local favorite.',
      image: foodMarketImage,
      price: '₹50-100',
      ingredients: ['Chickpeas', 'Tamarind', 'Spices', 'Onions', 'Coriander'],
      spiceLevel: 'High',
      dietary: 'Vegetarian'
    }
  ];

  const culturalInsights = [
    {
      title: 'Local Customs',
      content: 'Remove shoes before entering temples. Dress modestly and respect photography restrictions.',
      icon: '🙏'
    },
    {
      title: 'Festival Calendar',
      content: 'Spring Festival (March), Harvest Celebration (September), Winter Light Festival (December).',
      icon: '🎉'
    },
    {
      title: 'Traditional Food',
      content: 'Try the local thali, mountain honey, and traditional sweets. Vegetarian options widely available.',
      icon: '🍽️'
    },
    {
      title: 'Language Tips',
      content: 'Basic phrases: "Namaste" (Hello), "Dhanyawad" (Thank you), "Kshama" (Sorry).',
      icon: '💬'
    }
  ];

  const filteredSpots = touristSpots.filter(spot => {
    const matchesSearch = spot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         spot.history.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || spot.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-travel text-white p-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Info className="h-8 w-8" />
              <h1 className="text-3xl font-bold">Tourist Information</h1>
            </div>
            <p className="text-lg text-white/90">
              Discover rich history, fascinating legends, and cultural treasures.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl p-4">
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search places, history, legends..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            {['All', 'Culture', 'Nature', 'Adventure'].map((category) => (
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

        <Tabs defaultValue="places" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="places" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Places
            </TabsTrigger>
            <TabsTrigger value="culture" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Culture
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security & Verification
            </TabsTrigger>
            <TabsTrigger value="ar-preview" className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              AR Preview
            </TabsTrigger>
          </TabsList>

          {/* Places Tab */}
          <TabsContent value="places" className="space-y-6">
            <div className="grid gap-6">
              {filteredSpots.map((spot, index) => (
                <motion.div
                  key={spot.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden travel-card">
                    <div className="md:flex">
                      {/* Image */}
                      <div className="md:w-1/3 h-64 md:h-auto">
                        <img 
                          src={spot.image} 
                          alt={spot.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* Content */}
                      <div className="md:w-2/3 p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-2xl font-bold mb-2">{spot.name}</h3>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 text-yellow-500" />
                                <span>{spot.rating}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>{spot.timings}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className="bg-primary/10 text-primary">
                                {spot.category}
                              </Badge>
                              {spot.verified && (
                                <VerificationBadge 
                                  verification={spot.verified ? {
                                    id: `cert_${spot.guideId}_1`,
                                    guideId: spot.guideId,
                                    name: `${spot.name} Guide`,
                                    certification: 'Certified Tourist Guide',
                                    issueDate: '2024-01-15',
                                    expiryDate: '2025-01-15',
                                    verified: true,
                                    transactionHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
                                    blockNumber: 18500000,
                                  } : null}
                                  size="sm"
                                />
                              )}
                            </div>
                          </div>
                        </div>

                        {/* History */}
                        <div className="mb-4">
                          <h4 className="font-semibold flex items-center gap-2 mb-2">
                            <BookOpen className="h-4 w-4" />
                            History
                          </h4>
                          <p className="text-sm text-muted-foreground">{spot.history}</p>
                        </div>

                        {/* Legend */}
                        <div className="mb-4 p-3 bg-gradient-monk/10 rounded-lg">
                          <h4 className="font-semibold mb-2 text-monk-primary">Legend & Folklore</h4>
                          <p className="text-sm italic">{spot.legend}</p>
                        </div>

                        {/* Fun Facts */}
                        <div className="mb-4">
                          <h4 className="font-semibold mb-2">Fun Facts</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {spot.funFacts.map((fact, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-primary">•</span>
                                <span>{fact}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Best Time */}
                        <div className="flex items-center gap-2 text-sm">
                          <Badge variant="outline">
                            Best Time: {spot.bestTime}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Culture Tab */}
          <TabsContent value="culture" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {culturalInsights.map((insight, index) => (
                <motion.div
                  key={insight.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Dialog>
                    <DialogTrigger asChild>
                      <Card className="h-full travel-card cursor-pointer hover:shadow-lg transition-all">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-3">
                            <span className="text-2xl">{insight.icon}</span>
                            {insight.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground">{insight.content}</p>
                          <Button variant="ghost" size="sm" className="mt-2 p-0">
                            Click to explore →
                          </Button>
                        </CardContent>
                      </Card>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-3">
                          <span className="text-2xl">{insight.icon}</span>
                          {insight.title}
                        </DialogTitle>
                      </DialogHeader>
                      
                      {insight.title === 'Festival Calendar' && (
                        <FestivalCalendar />
                      )}
                      
                      {insight.title === 'Traditional Food' && (
                        <div className="space-y-6">
                          {traditionalFoods.map((food, i) => (
                            <Card key={i}>
                              <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row gap-4">
                                  <img 
                                    src={food.image} 
                                    alt={food.name}
                                    className="w-full md:w-48 h-32 object-cover rounded-lg"
                                  />
                                  <div className="flex-1">
                                    <h3 className="text-xl font-semibold mb-2">{food.name}</h3>
                                    <Badge className="mb-2" variant="outline">
                                      <Utensils className="h-3 w-3 mr-1" />
                                      {food.price}
                                    </Badge>
                                    <p className="text-muted-foreground mb-3">{food.description}</p>
                                    <div className="space-y-2">
                                      <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium">Spice Level:</span>
                                        <Badge variant={food.spiceLevel === 'High' ? 'destructive' : food.spiceLevel === 'Medium' ? 'secondary' : 'default'}>
                                          {food.spiceLevel}
                                        </Badge>
                                        <Badge variant="outline">{food.dietary}</Badge>
                                      </div>
                                      <div>
                                        <span className="text-sm font-medium">Ingredients: </span>
                                        <span className="text-sm text-muted-foreground">
                                          {food.ingredients.join(', ')}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                      
                      {insight.title === 'Local Customs' && (
                        <div className="space-y-4">
                          <Card>
                            <CardContent className="p-6">
                              <h3 className="text-lg font-semibold mb-3">Temple Etiquette</h3>
                              <ul className="space-y-2 text-sm">
                                <li>• Remove shoes before entering sacred areas</li>
                                <li>• Dress modestly (cover shoulders and knees)</li>
                                <li>• Photography may be restricted in some areas</li>
                                <li>• Silence mobile phones and speak softly</li>
                                <li>• Follow the clockwise path around the temple</li>
                              </ul>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="p-6">
                              <h3 className="text-lg font-semibold mb-3">Cultural Greetings</h3>
                              <ul className="space-y-2 text-sm">
                                <li>• <strong>Namaste</strong> - Traditional greeting with palms together</li>
                                <li>• <strong>Pranaam</strong> - Respectful greeting for elders</li>
                                <li>• <strong>Sat Sri Akal</strong> - Sikh greeting</li>
                                <li>• Slight bow of the head shows respect</li>
                              </ul>
                            </CardContent>
                          </Card>
                        </div>
                      )}
                      
                      {insight.title === 'Language Tips' && (
                        <div className="space-y-4">
                          <Card>
                            <CardContent className="p-6">
                              <h3 className="text-lg font-semibold mb-3">Essential Phrases</h3>
                              <div className="grid md:grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p><strong>Hello:</strong> Namaste / Namaskar</p>
                                  <p><strong>Thank you:</strong> Dhanyawad</p>
                                  <p><strong>Please:</strong> Kripaya</p>
                                  <p><strong>Sorry:</strong> Kshama kariye</p>
                                  <p><strong>Yes:</strong> Haan</p>
                                  <p><strong>No:</strong> Nahin</p>
                                </div>
                                <div>
                                  <p><strong>How much?:</strong> Kitne paise?</p>
                                  <p><strong>Where is?:</strong> Kaha hai?</p>
                                  <p><strong>Help:</strong> Madad</p>
                                  <p><strong>Water:</strong> Paani</p>
                                  <p><strong>Food:</strong> Khana</p>
                                  <p><strong>Toilet:</strong> Shauchalaya</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </motion.div>
              ))}
            </div>

            {/* Cultural Calendar */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Cultural Calendar 2024
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl mb-2">🌸</div>
                    <h4 className="font-semibold">Spring Festival</h4>
                    <p className="text-sm text-muted-foreground">March 15-17</p>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl mb-2">🌾</div>
                    <h4 className="font-semibold">Harvest Celebration</h4>
                    <p className="text-sm text-muted-foreground">September 22-24</p>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl mb-2">🪔</div>
                    <h4 className="font-semibold">Winter Light Festival</h4>
                    <p className="text-sm text-muted-foreground">December 12-14</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security & Verification Tab */}
          <TabsContent value="security" className="space-y-6">
            <div className="grid gap-6">
              {/* Security Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Blockchain Security & Verification
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl mb-2">🔐</div>
                      <h4 className="font-semibold">Guide Verification</h4>
                      <p className="text-sm text-muted-foreground">Digital certificates stored on blockchain</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl mb-2">💳</div>
                      <h4 className="font-semibold">Secure Payments</h4>
                      <p className="text-sm text-muted-foreground">Transaction hashes recorded on-chain</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl mb-2">🆔</div>
                      <h4 className="font-semibold">Digital Tourist ID</h4>
                      <p className="text-sm text-muted-foreground">Blockchain-based identity verification</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* QR Code Scanner */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <QrCode className="h-5 w-5" />
                    QR Code Verification
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <QRCodeScanner onScan={(data) => console.log('Scanned:', data)}>
                      <Button size="lg" className="mb-4">
                        <QrCode className="h-5 w-5 mr-2" />
                        Scan QR Code to Verify
                      </Button>
                    </QRCodeScanner>
                    <p className="text-sm text-muted-foreground">
                      Scan QR codes on guides, vendors, or booking confirmations to verify authenticity
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Verification Examples */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Guide Verification Example */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Guide Verification Example</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Rajesh Kumar</span>
                        <VerificationBadge 
                          verification={{
                            id: 'cert_guide_001',
                            guideId: 'guide_001',
                            name: 'Rajesh Kumar',
                            certification: 'Certified Tourist Guide - Level 3',
                            issueDate: '2024-01-15',
                            expiryDate: '2025-01-15',
                            verified: true,
                            transactionHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
                            blockNumber: 18500000,
                          }}
                          showDetails
                        />
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p>• 5+ years experience</p>
                        <p>• Certified by Tourism Board</p>
                        <p>• 4.9/5 rating from 200+ tourists</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Booking Transaction Example */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Secure Booking Example</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Temple Tour Booking</span>
                        <Badge variant="default">Confirmed</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p>• Amount: $150.00 USD</p>
                        <p>• Transaction: 0x9876...cba9</p>
                        <p>• Block: 18,520,000</p>
                        <p>• Status: Confirmed on blockchain</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Digital Tourist ID */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Digital Tourist ID
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <DigitalTouristIDComponent />
                </CardContent>
              </Card>

              {/* Verification Panel for Selected Guide */}
              <VerificationPanel guideId="guide_temple_001" />

              {/* Secure Booking Demo */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Book Temple Tour</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <SecureBooking
                      guideId="guide_temple_001"
                      guideName="Rajesh Kumar"
                      service="Mystical Temple of Serenity Tour"
                      price={150}
                      currency="USD"
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Book Adventure Experience</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <SecureBooking
                      guideId="guide_adventure_004"
                      guideName="Priya Sharma"
                      service="Adventure Valley Experience"
                      price={200}
                      currency="USD"
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* AR Preview Tab */}
          <TabsContent value="ar-preview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  AR Preview Experience
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center py-12">
                <div className="mb-6">
                  <div className="w-32 h-32 mx-auto bg-gradient-monk rounded-full flex items-center justify-center mb-4">
                    <Camera className="h-16 w-16 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">AR Preview Coming Soon!</h3>
                  <p className="text-muted-foreground mb-6">
                    Experience historical sites in 3D and explore ancient stories through augmented reality.
                  </p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="text-2xl mb-2">🏛️</div>
                    <h4 className="font-semibold">3D Models</h4>
                    <p className="text-muted-foreground">View historical reconstructions</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="text-2xl mb-2">👻</div>
                    <h4 className="font-semibold">Ghost Tours</h4>
                    <p className="text-muted-foreground">Interactive storytelling</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="text-2xl mb-2">📱</div>
                    <h4 className="font-semibold">Mobile AR</h4>
                    <p className="text-muted-foreground">Use your phone camera</p>
                  </div>
                </div>

                <Button className="mt-6" disabled>
                  <Camera className="h-4 w-4 mr-2" />
                  Launch AR Experience (Coming Soon)
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* AI Guardian Buddy */}
      <AIGuardianBuddy isVisible={showGuardian} onToggle={() => setShowGuardian(!showGuardian)} />
    </div>
  );
};

export default TouristInfo;