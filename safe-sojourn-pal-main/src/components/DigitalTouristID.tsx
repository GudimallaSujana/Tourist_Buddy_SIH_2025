import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  MapPin, 
  Calendar, 
  Phone, 
  Shield, 
  QrCode, 
  Download,
  CheckCircle,
  AlertCircle,
  Copy,
  ExternalLink
} from 'lucide-react';
import { motion } from 'framer-motion';
import { blockchainService, DigitalTouristID } from '@/lib/blockchain';

interface DigitalTouristIDProps {
  touristId?: string;
  onIDGenerated?: (id: DigitalTouristID) => void;
}

const DigitalTouristIDComponent: React.FC<DigitalTouristIDProps> = ({
  touristId,
  onIDGenerated
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    emergencyContact: '',
    destination: '',
    startDate: '',
    endDate: '',
    nationality: '',
    passportNumber: '',
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [digitalID, setDigitalID] = useState<DigitalTouristID | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (touristId) {
      loadDigitalID(touristId);
    }
  }, [touristId]);

  const loadDigitalID = async (id: string) => {
    try {
      const idData = await blockchainService.getDigitalTouristID(id);
      setDigitalID(idData);
    } catch (err) {
      console.error('Error loading digital ID:', err);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateDigitalID = async () => {
    if (!formData.fullName || !formData.email || !formData.destination || !formData.startDate || !formData.endDate) {
      setError('Please fill in all required fields');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // Simulate ID generation process
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate blockchain-based digital ID
      const newDigitalID = blockchainService.generateDigitalTouristID({
        touristId: `tourist_${Date.now()}`,
        destination: formData.destination,
        startDate: formData.startDate,
        endDate: formData.endDate,
        emergencyContact: formData.emergencyContact || formData.phone,
      });

      setDigitalID(newDigitalID);
      onIDGenerated?.(newDigitalID);
    } catch (err) {
      setError('Failed to generate digital ID. Please try again.');
      console.error('Digital ID generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const isIDValid = () => {
    if (!digitalID) return false;
    const endDate = new Date(digitalID.tripDetails.endDate);
    return endDate > new Date();
  };

  if (digitalID) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <Card className={`border-2 ${isIDValid() ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Digital Tourist ID
              <Badge variant={isIDValid() ? 'default' : 'destructive'}>
                {isIDValid() ? 'Valid' : 'Expired'}
              </Badge>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* ID Details */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                <p className="font-medium">{formData.fullName || 'Tourist Name'}</p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <p className="font-mono text-sm">{formData.email || 'tourist@example.com'}</p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Destination</label>
                <p className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {digitalID.tripDetails.destination}
                </p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Trip Duration</label>
                <p className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(digitalID.tripDetails.startDate)} - {formatDate(digitalID.tripDetails.endDate)}
                </p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Emergency Contact</label>
                <p className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  {digitalID.tripDetails.emergencyContact}
                </p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">ID Status</label>
                <div className="flex items-center gap-2">
                  {isIDValid() ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className="text-sm">{isIDValid() ? 'Active' : 'Expired'}</span>
                </div>
              </div>
            </div>

            {/* Blockchain Details */}
            {digitalID.transactionHash && (
              <div className="p-3 bg-muted rounded-lg">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Blockchain Verification
                </h4>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span>Transaction Hash:</span>
                    <div className="flex items-center gap-2">
                      <code className="font-mono text-xs">
                        {digitalID.transactionHash.slice(0, 8)}...{digitalID.transactionHash.slice(-8)}
                      </code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(digitalID.transactionHash!)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span>Block Number:</span>
                    <span className="font-mono">{digitalID.blockNumber?.toLocaleString()}</span>
                  </div>
                </div>

                <div className="mt-3 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(`https://etherscan.io/tx/${digitalID.transactionHash}`, '_blank')}
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    View on Etherscan
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(digitalID.transactionHash!)}
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copy Hash
                  </Button>
                </div>
              </div>
            )}

            {/* QR Code */}
            <div className="text-center p-4 bg-white rounded-lg border">
              <h4 className="font-medium mb-2 flex items-center justify-center gap-2">
                <QrCode className="h-4 w-4" />
                QR Code for Verification
              </h4>
              <div className="w-32 h-32 mx-auto bg-muted rounded-lg flex items-center justify-center mb-2">
                <QrCode className="h-16 w-16 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground">
                Show this QR code to guides and vendors for instant verification
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Download ID
              </Button>
              
              <Button variant="outline" className="flex-1">
                <QrCode className="h-4 w-4 mr-2" />
                Show QR Code
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Generate Digital Tourist ID
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Create a blockchain-based digital ID for your trip. This ID will be used for verification, 
          emergency contacts, and seamless travel experience.
        </p>

        {/* Personal Information */}
        <div className="space-y-4">
          <h4 className="font-medium">Personal Information</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                placeholder="Enter your full name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter your email"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Enter your phone number"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="emergencyContact">Emergency Contact</Label>
              <Input
                id="emergencyContact"
                value={formData.emergencyContact}
                onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                placeholder="Emergency contact number"
              />
            </div>
          </div>
        </div>

        {/* Trip Information */}
        <div className="space-y-4">
          <h4 className="font-medium">Trip Information</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="destination">Destination *</Label>
              <Input
                id="destination"
                value={formData.destination}
                onChange={(e) => handleInputChange('destination', e.target.value)}
                placeholder="Enter destination"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="nationality">Nationality</Label>
              <Input
                id="nationality"
                value={formData.nationality}
                onChange={(e) => handleInputChange('nationality', e.target.value)}
                placeholder="Enter your nationality"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date *</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Security Features */}
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security Features
          </h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Blockchain-based identity verification</li>
            <li>• Immutable trip details and emergency contacts</li>
            <li>• QR code for instant verification by guides</li>
            <li>• Integration with safety features and geo-fencing</li>
          </ul>
        </div>

        {/* Error Display */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        )}

        {/* Generate Button */}
        <Button
          onClick={generateDigitalID}
          disabled={isGenerating}
          className="w-full"
          size="lg"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Generating Digital ID...
            </>
          ) : (
            <>
              <User className="h-4 w-4 mr-2" />
              Generate Digital Tourist ID
            </>
          )}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          Your digital ID will be securely stored on the blockchain and can be used throughout your trip.
        </p>
      </CardContent>
    </Card>
  );
};

export default DigitalTouristIDComponent;
