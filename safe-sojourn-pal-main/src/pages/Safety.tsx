import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, MapPin, Phone, Users, Clock, Activity, Navigation, Plus, X, Eye, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import GuardianBuddy from '@/components/GuardianBuddy';

interface Contact {
  id: string;
  name: string;
  phone: string;
  isEmergency: boolean;
  lastShared?: string;
}

const Safety: React.FC = () => {
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [safetyLevel, setSafetyLevel] = useState(85);
  const [isTracking, setIsTracking] = useState(false);
  const [showGuardian, setShowGuardian] = useState(true);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [newContact, setNewContact] = useState({ name: '', phone: '' });
  const [showAddContact, setShowAddContact] = useState(false);
  const [showSharedLocations, setShowSharedLocations] = useState(false);

  // Mock location data
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Location access denied:', error);
          // Mock location for demo
          setCurrentLocation({ lat: 28.6139, lng: 77.2090 });
        }
      );
    }
  }, []);

  const handleSOS = () => {
    alert('🆘 EMERGENCY ALERT SENT!\n\nYour location has been shared with:\n• Local Emergency Services\n• Trusted Contacts\n• Tourist Authority\n\nHelp is on the way!');
  };

  const handleAddContact = () => {
    if (!newContact.name.trim() || !newContact.phone.trim()) {
      toast({
        title: "Error",
        description: "Please fill in both name and phone number",
        variant: "destructive"
      });
      return;
    }

    const contact: Contact = {
      id: Date.now().toString(),
      name: newContact.name.trim(),
      phone: newContact.phone.trim(),
      isEmergency: false
    };

    setContacts(prev => [...prev, contact]);
    setNewContact({ name: '', phone: '' });
    setShowAddContact(false);
    
    toast({
      title: "Contact Added",
      description: `${contact.name} has been added to your emergency contacts`,
    });
  };

  const handleRemoveContact = (id: string) => {
    setContacts(prev => prev.filter(contact => contact.id !== id));
    toast({
      title: "Contact Removed",
      description: "Contact has been removed from your emergency contacts",
    });
  };

  const handleShareLocation = (contact: Contact) => {
    const locationText = currentLocation 
      ? `My current location: https://maps.google.com/?q=${currentLocation.lat},${currentLocation.lng}`
      : 'Location not available';
    
    const shareUrl = `https://wa.me/${contact.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(locationText)}`;
    window.open(shareUrl, '_blank');
    
    // Update last shared time
    setContacts(prev => prev.map(c => 
      c.id === contact.id 
        ? { ...c, lastShared: new Date().toLocaleTimeString() }
        : c
    ));
    
    toast({
      title: "Location Shared",
      description: `Location shared with ${contact.name}`,
    });
  };

  const safetyAlerts = [
    {
      type: 'warning',
      message: 'Heavy rain expected in your area. Plan indoor activities.',
      time: '10 mins ago',
      icon: '🌧️'
    },
    {
      type: 'info',
      message: 'Popular market area ahead - watch for pickpockets.',
      time: '25 mins ago',
      icon: '🎒'
    },
    {
      type: 'success',
      message: 'You\'ve entered a monitored safe zone.',
      time: '1 hour ago',
      icon: '✅'
    }
  ];

  const emergencyContacts = [
    { name: 'Police', number: '100', icon: '🚔' },
    { name: 'Ambulance', number: '108', icon: '🚑' },
    { name: 'Tourist Helpline', number: '1363', icon: '📞' },
    { name: 'Fire Emergency', number: '101', icon: '🚒' }
  ];

  const safetyStats = [
    { label: 'Active Tracking', value: isTracking ? 'ON' : 'OFF', color: isTracking ? 'text-safety-success' : 'text-safety-warning' },
    { label: 'Safe Zone Coverage', value: '98%', color: 'text-safety-success' },
    { label: 'Response Time', value: '< 5 min', color: 'text-safety-info' },
    { label: 'Nearby Tourists', value: '47', color: 'text-primary' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-safety text-white p-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Shield className="h-8 w-8" />
              <h1 className="text-3xl font-bold">Safety Dashboard</h1>
            </div>
            <p className="text-lg text-white/90">
              Your security is our priority. Real-time monitoring and emergency assistance.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl p-4 space-y-6">
        {/* Emergency SOS */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Card className="bg-safety-danger/10 border-safety-danger/20">
            <CardContent className="p-8">
              <Button
                onClick={handleSOS}
                size="xl"
                className="bg-safety-danger hover:bg-safety-danger/90 text-white safety-pulse text-xl px-12 py-6"
              >
                <AlertTriangle className="h-8 w-8 mr-3" />
                EMERGENCY SOS
              </Button>
              <p className="text-sm text-muted-foreground mt-4">
                Press and hold for 3 seconds to send emergency alert with your location
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Current Status */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Location Tracking */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Navigation className="h-5 w-5 text-primary" />
                Location Tracking
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Status:</span>
                <Badge variant={isTracking ? 'default' : 'secondary'}>
                  {isTracking ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              
              {currentLocation && (
                <div className="text-sm text-muted-foreground">
                  <p>Lat: {currentLocation.lat.toFixed(4)}</p>
                  <p>Lng: {currentLocation.lng.toFixed(4)}</p>
                </div>
              )}
              
              <Button
                onClick={() => setIsTracking(!isTracking)}
                variant={isTracking ? 'destructive' : 'default'}
                className="w-full"
              >
                {isTracking ? 'Stop Tracking' : 'Start Tracking'}
              </Button>
            </CardContent>
          </Card>

          {/* Safety Level */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-safety-success" />
                Safety Level
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-safety-success mb-2">
                  {safetyLevel}%
                </div>
                <Progress value={safetyLevel} className="mb-2" />
                <p className="text-sm text-muted-foreground">
                  Current area safety rating
                </p>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Activity className="h-4 w-4" />
                <span>Real-time monitoring active</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Safety Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Safety Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {safetyStats.map((stat, index) => (
                <div key={stat.label} className="text-center">
                  <div className={`text-2xl font-bold ${stat.color}`}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-safety-warning" />
              Recent Safety Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {safetyAlerts.map((alert, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                >
                  <span className="text-xl">{alert.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{alert.message}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{alert.time}</span>
                    </div>
                  </div>
                  <Badge
                    variant={
                      alert.type === 'warning' ? 'destructive' :
                      alert.type === 'success' ? 'default' : 'secondary'
                    }
                    className="text-xs"
                  >
                    {alert.type}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contacts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-safety-info" />
              Emergency Contacts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {emergencyContacts.map((contact, index) => (
                <motion.div
                  key={contact.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Button
                    variant="outline"
                    className="w-full justify-start h-auto p-4"
                    onClick={() => window.open(`tel:${contact.number}`)}
                  >
                    <span className="text-2xl mr-3">{contact.icon}</span>
                    <div className="text-left">
                      <div className="font-semibold">{contact.name}</div>
                      <div className="text-sm text-muted-foreground">{contact.number}</div>
                    </div>
                  </Button>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Family/Friends Sharing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Share Location with Trusted Contacts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Allow family and friends to track your location for added safety during your trip.
            </p>
            <div className="flex gap-4 mb-6">
              <Dialog open={showAddContact} onOpenChange={setShowAddContact}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Contact
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Emergency Contact</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="contact-name">Name</Label>
                      <Input
                        id="contact-name"
                        placeholder="Enter contact name"
                        value={newContact.name}
                        onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact-phone">Phone Number</Label>
                      <Input
                        id="contact-phone"
                        placeholder="Enter phone number"
                        value={newContact.phone}
                        onChange={(e) => setNewContact(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleAddContact} className="flex-1">
                        Add Contact
                      </Button>
                      <Button variant="outline" onClick={() => setShowAddContact(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Button 
                variant="outline" 
                onClick={() => setShowSharedLocations(!showSharedLocations)}
              >
                <Eye className="h-4 w-4 mr-2" />
                View Shared Locations
              </Button>
            </div>

            {/* Contacts List */}
            {contacts.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold">Your Emergency Contacts</h4>
                {contacts.map((contact) => (
                  <div key={contact.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{contact.name}</p>
                        <p className="text-sm text-muted-foreground">{contact.phone}</p>
                        {contact.lastShared && (
                          <p className="text-xs text-green-600">Last shared: {contact.lastShared}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleShareLocation(contact)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Share2 className="h-4 w-4 mr-1" />
                        Share
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRemoveContact(contact.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Shared Locations View */}
            {showSharedLocations && (
              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold mb-3">Shared Location History</h4>
                {contacts.filter(c => c.lastShared).length > 0 ? (
                  <div className="space-y-2">
                    {contacts
                      .filter(c => c.lastShared)
                      .map((contact) => (
                        <div key={contact.id} className="flex items-center justify-between p-2 bg-background rounded">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-primary" />
                            <span className="text-sm">{contact.name}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            Shared at {contact.lastShared}
                          </span>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No locations have been shared yet. Add contacts and share your location for safety.
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Guardian Buddy */}
      <GuardianBuddy isVisible={showGuardian} onToggle={() => setShowGuardian(!showGuardian)} />
    </div>
  );
};

export default Safety;