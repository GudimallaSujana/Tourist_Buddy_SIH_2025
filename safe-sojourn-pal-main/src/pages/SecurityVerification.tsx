import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, CheckCircle, AlertTriangle, Eye, Lock, Key, QrCode, Scan, Verified, Clock, MapPin, Phone, Mail, Download, Share2, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import AIGuardianBuddy from '@/components/AIGuardianBuddy';
import QRCodeGenerator from '@/components/QRCodeGenerator';
import QRScanner from '@/components/QRScanner';
import { toast } from '@/hooks/use-toast';

const SecurityVerification: React.FC = () => {
  const [showGuardian, setShowGuardian] = useState(true);
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [generatedQR, setGeneratedQR] = useState<string | null>(null);
  const [scannedData, setScannedData] = useState<string | null>(null);

  const securityFeatures = [
    {
      icon: Shield,
      title: 'Real-time Safety Monitoring',
      description: 'AI-powered safety analysis of your current location and surroundings.',
      status: 'active',
      color: 'text-green-600'
    },
    {
      icon: CheckCircle,
      title: 'Identity Verification',
      description: 'Blockchain-based identity verification for secure access.',
      status: 'verified',
      color: 'text-blue-600'
    },
    {
      icon: QrCode,
      title: 'QR Code Authentication',
      description: 'Secure QR-based check-ins at tourist locations.',
      status: 'ready',
      color: 'text-purple-600'
    },
    {
      icon: MapPin,
      title: 'Location Tracking',
      description: 'Encrypted location sharing with emergency contacts.',
      status: 'active',
      color: 'text-orange-600'
    }
  ];

  const verificationMethods = [
    {
      name: 'Biometric Verification',
      icon: Eye,
      description: 'Facial recognition and fingerprint scanning',
      status: 'Available'
    },
    {
      name: 'Blockchain ID',
      icon: Key,
      description: 'Decentralized identity verification',
      status: 'Connected'
    },
    {
      name: 'Emergency Contacts',
      icon: Phone,
      description: 'Automated emergency notification system',
      status: 'Active'
    },
    {
      name: 'Location Verification',
      icon: MapPin,
      description: 'GPS-based location confirmation',
      status: 'Enabled'
    }
  ];

  const recentActivities = [
    {
      action: 'Location Check-in',
      location: 'Taj Mahal, Agra',
      time: '2 hours ago',
      status: 'verified',
      icon: CheckCircle
    },
    {
      action: 'Safety Alert',
      location: 'Red Fort, Delhi',
      time: '4 hours ago',
      status: 'resolved',
      icon: Shield
    },
    {
      action: 'Identity Verification',
      location: 'Hotel Check-in',
      time: '1 day ago',
      status: 'completed',
      icon: Verified
    },
    {
      action: 'Emergency Contact Notified',
      location: 'Mountain Trek',
      time: '2 days ago',
      status: 'sent',
      icon: Phone
    }
  ];

  const handleVerification = () => {
    if (verificationCode === 'VERIFY123') {
      setIsVerified(true);
      alert('✅ Verification successful! Your identity has been confirmed.');
    } else {
      alert('❌ Invalid verification code. Please try again.');
    }
  };

  const handleQRGenerated = (qrUrl: string, verificationUrl: string) => {
    setGeneratedQR(qrUrl);
    toast({
      title: "QR Code Generated",
      description: "Tourist verification QR code has been created successfully!",
    });
  };

  const handleQRScanned = (data: string) => {
    setScannedData(data);
    toast({
      title: "QR Code Scanned",
      description: "Tourist verification QR code has been detected!",
    });
  };

  const handleShareQR = () => {
    if (generatedQR) {
      navigator.share?.({
        title: 'Tourist Buddy Verification QR',
        text: 'Scan this QR code to verify tourist identity',
        url: generatedQR
      }).catch(() => {
        navigator.clipboard.writeText(generatedQR);
        toast({
          title: "QR URL Copied",
          description: "QR code URL has been copied to clipboard.",
        });
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Shield className="h-8 w-8" />
              <h1 className="text-3xl font-bold">Security & Verification</h1>
            </div>
            <p className="text-lg text-white/90">
              Advanced security features and identity verification for safe travel
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl p-4">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="verification" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Verification
            </TabsTrigger>
            <TabsTrigger value="qr-generate" className="flex items-center gap-2">
              <QrCode className="h-4 w-4" />
              Generate QR
            </TabsTrigger>
            <TabsTrigger value="qr-scan" className="flex items-center gap-2">
              <Scan className="h-4 w-4" />
              Scan QR
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Monitoring
            </TabsTrigger>
            <TabsTrigger value="emergency" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Emergency
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {securityFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full travel-card">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full bg-muted ${feature.color}`}>
                          <feature.icon className="h-6 w-6" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{feature.title}</CardTitle>
                          <Badge 
                            variant={feature.status === 'active' ? 'default' : 
                                   feature.status === 'verified' ? 'secondary' : 'outline'}
                            className="mt-1"
                          >
                            {feature.status}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Security Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="font-medium">Identity Verified</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-blue-600" />
                        <span className="font-medium">Location Tracking</span>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <QrCode className="h-5 w-5 text-purple-600" />
                        <span className="font-medium">QR Authentication</span>
                      </div>
                      <Badge className="bg-purple-100 text-purple-800">Ready</Badge>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold">Recent Security Events</h4>
                    <div className="space-y-2">
                      {recentActivities.slice(0, 3).map((activity, index) => (
                        <div key={index} className="flex items-center gap-3 p-2 bg-muted rounded-lg">
                          <activity.icon className="h-4 w-4 text-primary" />
                          <div className="flex-1">
                            <div className="text-sm font-medium">{activity.action}</div>
                            <div className="text-xs text-muted-foreground">{activity.location}</div>
                          </div>
                          <div className="text-xs text-muted-foreground">{activity.time}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Verification Tab */}
          <TabsContent value="verification" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {verificationMethods.map((method, index) => (
                <motion.div
                  key={method.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full travel-card">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-full bg-primary/10">
                          <method.icon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-2">{method.name}</h3>
                          <p className="text-sm text-muted-foreground mb-3">{method.description}</p>
                          <Badge variant="outline">{method.status}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Manual Verification */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Manual Verification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <Input
                    placeholder="Enter verification code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleVerification}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Verify
                  </Button>
                </div>
                {isVerified && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 text-green-800">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-medium">Verification Successful!</span>
                    </div>
                    <p className="text-sm text-green-700 mt-1">
                      Your identity has been verified and your security status has been updated.
                    </p>
                  </div>
                )}
                <div className="text-sm text-muted-foreground">
                  <p>💡 <strong>Demo Code:</strong> Use "VERIFY123" to test the verification system.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* QR Code Generation Tab */}
          <TabsContent value="qr-generate" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* QR Generator */}
              <div className="lg:col-span-2">
                <QRCodeGenerator
                  onGenerate={handleQRGenerated}
                />
              </div>

              {/* Quick Actions */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      onClick={handleShareQR}
                      disabled={!generatedQR}
                      className="w-full flex items-center gap-2"
                    >
                      <Share2 className="h-4 w-4" />
                      Share QR Code
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={() => {
                        if (generatedQR) {
                          const link = document.createElement('a');
                          link.href = generatedQR;
                          link.download = 'touristbuddy-verification-qr.png';
                          link.click();
                        }
                      }}
                      disabled={!generatedQR}
                      className="w-full flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Download QR
                    </Button>
                  </CardContent>
                </Card>

                {/* Usage Instructions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">How to Use</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">1</div>
                        <div>
                          <p className="font-medium">Enter Tourist ID</p>
                          <p className="text-muted-foreground">Provide a unique identifier for the tourist</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">2</div>
                        <div>
                          <p className="font-medium">Configure Settings</p>
                          <p className="text-muted-foreground">Choose QR size, error correction, and margin</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">3</div>
                        <div>
                          <p className="font-medium">Generate & Download</p>
                          <p className="text-muted-foreground">Create QR code and save for printing</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* QR Code Scanning Tab */}
          <TabsContent value="qr-scan" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* QR Scanner */}
              <div className="lg:col-span-2">
                <QRScanner
                  onScan={handleQRScanned}
                />
              </div>

              {/* Verification Results */}
              <div className="space-y-4">
                {scannedData && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-5 w-5" />
                        Verification Result
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="bg-green-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-green-800">QR Code Successfully Scanned</p>
                        <p className="text-xs text-green-600 mt-1">
                          Tourist verification data detected
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Verification URL:</p>
                        <code className="text-xs bg-gray-100 p-2 rounded block break-all">
                          {scannedData}
                        </code>
                      </div>
                      
                      <Button
                        onClick={() => window.open(scannedData, '_blank')}
                        className="w-full flex items-center gap-2"
                      >
                        <Globe className="h-4 w-4" />
                        Open Verification
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Scanner Tips */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Scanner Tips</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">💡</div>
                        <div>
                          <p className="font-medium">Good Lighting</p>
                          <p className="text-muted-foreground">Ensure adequate lighting for better scanning</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">📱</div>
                        <div>
                          <p className="font-medium">Steady Hands</p>
                          <p className="text-muted-foreground">Hold device steady for clear QR detection</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">🔍</div>
                        <div>
                          <p className="font-medium">Full QR Code</p>
                          <p className="text-muted-foreground">Ensure entire QR code is visible in frame</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Monitoring Tab */}
          <TabsContent value="monitoring" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Real-time Monitoring
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-4">Location Safety</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <span>Current Location Safety</span>
                        <Badge className="bg-green-100 text-green-800">Safe</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                        <span>Weather Conditions</span>
                        <Badge className="bg-yellow-100 text-yellow-800">Moderate</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <span>Emergency Services</span>
                        <Badge className="bg-blue-100 text-blue-800">Available</Badge>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-4">Activity Log</h4>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {recentActivities.map((activity, index) => (
                        <div key={index} className="flex items-center gap-3 p-2 border rounded-lg">
                          <activity.icon className="h-4 w-4 text-primary" />
                          <div className="flex-1">
                            <div className="text-sm font-medium">{activity.action}</div>
                            <div className="text-xs text-muted-foreground">{activity.location}</div>
                          </div>
                          <div className="text-xs text-muted-foreground">{activity.time}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Emergency Tab */}
          <TabsContent value="emergency" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600">
                    <AlertTriangle className="h-5 w-5" />
                    Emergency Contacts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-red-600" />
                        <div>
                          <div className="font-medium">Emergency Services</div>
                          <div className="text-sm text-muted-foreground">100 (Police), 108 (Ambulance)</div>
                        </div>
                      </div>
                      <Button size="sm" variant="destructive">Call</Button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-orange-600" />
                        <div>
                          <div className="font-medium">Tourist Helpline</div>
                          <div className="text-sm text-muted-foreground">1363</div>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">Contact</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Button className="bg-red-600 hover:bg-red-700 text-white">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      SOS Alert
                    </Button>
                    <Button variant="outline">
                      <MapPin className="h-4 w-4 mr-2" />
                      Share Location
                    </Button>
                    <Button variant="outline">
                      <Phone className="h-4 w-4 mr-2" />
                      Call Emergency
                    </Button>
                    <Button variant="outline">
                      <Shield className="h-4 w-4 mr-2" />
                      Safety Check
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Emergency Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-red-50 rounded-lg">
                    <h4 className="font-semibold text-red-800 mb-2">Police</h4>
                    <p className="text-sm text-red-700">Emergency: 100</p>
                    <p className="text-sm text-red-700">Non-emergency: 101</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Medical</h4>
                    <p className="text-sm text-blue-700">Ambulance: 108</p>
                    <p className="text-sm text-blue-700">Fire: 101</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Tourist</h4>
                    <p className="text-sm text-green-700">Helpline: 1363</p>
                    <p className="text-sm text-green-700">24/7 Support</p>
                  </div>
                </div>
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

export default SecurityVerification;
