import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  Shield, 
  CheckCircle, 
  Clock, 
  ExternalLink,
  Copy,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { blockchainService, BookingTransaction } from '@/lib/blockchain';

interface SecureBookingProps {
  guideId: string;
  guideName: string;
  service: string;
  price: number;
  currency?: string;
}

const SecureBooking: React.FC<SecureBookingProps> = ({
  guideId,
  guideName,
  service,
  price,
  currency = 'USD'
}) => {
  const [bookingData, setBookingData] = useState({
    touristName: '',
    email: '',
    phone: '',
    emergencyContact: '',
    startDate: '',
    endDate: '',
  });
  const [isBooking, setIsBooking] = useState(false);
  const [bookingResult, setBookingResult] = useState<BookingTransaction | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setBookingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBooking = async () => {
    if (!bookingData.touristName || !bookingData.email || !bookingData.startDate || !bookingData.endDate) {
      setError('Please fill in all required fields');
      return;
    }

    setIsBooking(true);
    setError(null);

    try {
      // Simulate booking process
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate blockchain transaction
      const transaction = blockchainService.generateBookingTransaction({
        bookingId: `booking_${Date.now()}`,
        touristId: `tourist_${Date.now()}`,
        guideId,
        amount: price.toString(),
        currency,
      });

      setBookingResult(transaction);
    } catch (err) {
      setError('Booking failed. Please try again.');
      console.error('Booking error:', err);
    } finally {
      setIsBooking(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  if (bookingResult) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <h3 className="text-lg font-semibold text-green-800">Booking Confirmed!</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">Service:</span>
                <span>{service} with {guideName}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="font-medium">Amount:</span>
                <span className="text-lg font-semibold">{formatCurrency(price, currency)}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="font-medium">Status:</span>
                <Badge variant="default" className="flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  Secured on Blockchain
                </Badge>
              </div>
            </div>

            <div className="mt-4 p-3 bg-white rounded-lg border">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Transaction Details
              </h4>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>Transaction Hash:</span>
                  <div className="flex items-center gap-2">
                    <code className="font-mono text-xs">
                      {bookingResult.transactionHash.slice(0, 8)}...{bookingResult.transactionHash.slice(-8)}
                    </code>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(bookingResult.transactionHash)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span>Block Number:</span>
                  <span className="font-mono">{bookingResult.blockNumber.toLocaleString()}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span>Confirmation Time:</span>
                  <span>{new Date(bookingResult.timestamp).toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-3 flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.open(`https://etherscan.io/tx/${bookingResult.transactionHash}`, '_blank')}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  View on Etherscan
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(bookingResult.transactionHash)}
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Copy Hash
                </Button>
              </div>
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">What's Next?</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• You'll receive a confirmation email with booking details</li>
                <li>• Your guide will contact you 24 hours before the tour</li>
                <li>• Show your booking confirmation at the meeting point</li>
                <li>• Transaction is permanently recorded on blockchain for dispute resolution</li>
              </ul>
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
          <Shield className="h-5 w-5" />
          Secure Booking with Blockchain
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Service Details */}
        <div className="p-4 bg-muted rounded-lg">
          <h3 className="font-semibold mb-2">{service}</h3>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Guide: {guideName}</span>
            <span className="text-lg font-semibold">{formatCurrency(price, currency)}</span>
          </div>
        </div>

        {/* Booking Form */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="touristName">Full Name *</Label>
            <Input
              id="touristName"
              value={bookingData.touristName}
              onChange={(e) => handleInputChange('touristName', e.target.value)}
              placeholder="Enter your full name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={bookingData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Enter your email"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={bookingData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="Enter your phone number"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="emergencyContact">Emergency Contact</Label>
            <Input
              id="emergencyContact"
              value={bookingData.emergencyContact}
              onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
              placeholder="Emergency contact number"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date *</Label>
            <Input
              id="startDate"
              type="date"
              value={bookingData.startDate}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="endDate">End Date *</Label>
            <Input
              id="endDate"
              type="date"
              value={bookingData.endDate}
              onChange={(e) => handleInputChange('endDate', e.target.value)}
            />
          </div>
        </div>

        {/* Security Features */}
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <h4 className="font-medium text-green-800 mb-2 flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security Features
          </h4>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• Payment transaction recorded on blockchain</li>
            <li>• Immutable proof of booking for dispute resolution</li>
            <li>• Guide verification through blockchain certificates</li>
            <li>• Secure data encryption and privacy protection</li>
          </ul>
        </div>

        {/* Error Display */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        )}

        {/* Booking Button */}
        <Button
          onClick={handleBooking}
          disabled={isBooking}
          className="w-full"
          size="lg"
        >
          {isBooking ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Processing Secure Booking...
            </>
          ) : (
            <>
              <CreditCard className="h-4 w-4 mr-2" />
              Book Securely with Blockchain
            </>
          )}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          Your payment will be processed securely and recorded on the blockchain for transparency and dispute resolution.
        </p>
      </CardContent>
    </Card>
  );
};

export default SecureBooking;
