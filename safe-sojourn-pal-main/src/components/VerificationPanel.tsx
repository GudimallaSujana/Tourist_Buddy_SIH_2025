import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  QrCode, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  ExternalLink,
  Copy,
  Download
} from 'lucide-react';
import { motion } from 'framer-motion';
import VerificationBadge from './VerificationBadge';
import QRCodeScanner from './QRCodeScanner';
import { blockchainService, GuideVerification, BookingTransaction, DigitalTouristID } from '@/lib/blockchain';

interface VerificationPanelProps {
  guideId?: string;
  bookingId?: string;
  touristId?: string;
}

const VerificationPanel: React.FC<VerificationPanelProps> = ({
  guideId,
  bookingId,
  touristId,
}) => {
  const [guideVerification, setGuideVerification] = useState<GuideVerification | null>(null);
  const [bookingTransaction, setBookingTransaction] = useState<BookingTransaction | null>(null);
  const [touristID, setTouristID] = useState<DigitalTouristID | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadVerificationData();
  }, [guideId, bookingId, touristId]);

  const loadVerificationData = async () => {
    setLoading(true);
    setError(null);

    try {
      if (guideId) {
        const verification = await blockchainService.isGuideVerified(guideId);
        setGuideVerification(verification);
      }

      if (bookingId) {
        const transaction = await blockchainService.getBookingTransaction(bookingId);
        setBookingTransaction(transaction);
      }

      if (touristId) {
        const digitalID = await blockchainService.getDigitalTouristID(touristId);
        setTouristID(digitalID);
      }
    } catch (err) {
      setError('Failed to load verification data');
      console.error('Verification load error:', err);
    } finally {
      setLoading(false);
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

  const formatCurrency = (amount: string, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(parseFloat(amount));
  };

  const getQRCodeData = () => {
    if (guideId) return blockchainService.generateQRCodeData('guide', guideId);
    if (bookingId) return blockchainService.generateQRCodeData('booking', bookingId);
    if (touristId) return blockchainService.generateQRCodeData('tourist', touristId);
    return '';
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Loading verification data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Security & Verification
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="verification" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="verification">Verification</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="digital-id">Digital ID</TabsTrigger>
          </TabsList>

          {/* Verification Tab */}
          <TabsContent value="verification" className="space-y-4">
            {guideVerification ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Guide Verification</h3>
                  <VerificationBadge verification={guideVerification} showDetails />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Guide Name</label>
                    <p className="font-medium">{guideVerification.name}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Certification</label>
                    <p className="font-medium">{guideVerification.certification}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Issue Date</label>
                    <p>{formatDate(guideVerification.issueDate)}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Expiry Date</label>
                    <p className={new Date(guideVerification.expiryDate) < new Date() ? 'text-red-600' : ''}>
                      {formatDate(guideVerification.expiryDate)}
                    </p>
                  </div>
                </div>

                {guideVerification.transactionHash && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Blockchain Transaction</label>
                    <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                      <code className="text-xs font-mono flex-1">
                        {guideVerification.transactionHash}
                      </code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(guideVerification.transactionHash!)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => window.open(`https://etherscan.io/tx/${guideVerification.transactionHash}`, '_blank')}
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <QRCodeScanner onScan={(data) => console.log('Scanned:', data)}>
                    <Button variant="outline" size="sm">
                      <QrCode className="h-4 w-4 mr-2" />
                      Scan QR Code
                    </Button>
                  </QRCodeScanner>
                  
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download Certificate
                  </Button>
                </div>
              </motion.div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No verification data available</p>
              </div>
            )}
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-4">
            {bookingTransaction ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Booking Transaction</h3>
                  <Badge variant={bookingTransaction.status === 'confirmed' ? 'default' : 'secondary'}>
                    {bookingTransaction.status}
                  </Badge>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Amount</label>
                    <p className="text-lg font-semibold">
                      {formatCurrency(bookingTransaction.amount, bookingTransaction.currency)}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Transaction Date</label>
                    <p>{formatDate(bookingTransaction.timestamp)}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Block Number</label>
                    <p className="font-mono">{bookingTransaction.blockNumber.toLocaleString()}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                    <div className="flex items-center gap-2">
                      {bookingTransaction.status === 'confirmed' ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <Clock className="h-4 w-4 text-yellow-500" />
                      )}
                      <span className="capitalize">{bookingTransaction.status}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Transaction Hash</label>
                  <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                    <code className="text-xs font-mono flex-1">
                      {bookingTransaction.transactionHash}
                    </code>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(bookingTransaction.transactionHash)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => window.open(`https://etherscan.io/tx/${bookingTransaction.transactionHash}`, '_blank')}
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No transaction data available</p>
              </div>
            )}
          </TabsContent>

          {/* Digital ID Tab */}
          <TabsContent value="digital-id" className="space-y-4">
            {touristID ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Digital Tourist ID</h3>
                  <Badge variant={touristID.valid ? 'default' : 'destructive'}>
                    {touristID.valid ? 'Valid' : 'Invalid'}
                  </Badge>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Destination</label>
                    <p className="font-medium">{touristID.tripDetails.destination}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Trip Duration</label>
                    <p>
                      {formatDate(touristID.tripDetails.startDate)} - {formatDate(touristID.tripDetails.endDate)}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Emergency Contact</label>
                    <p className="font-mono">{touristID.tripDetails.emergencyContact}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Block Number</label>
                    <p className="font-mono">{touristID.blockNumber?.toLocaleString()}</p>
                  </div>
                </div>

                {touristID.transactionHash && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Blockchain Transaction</label>
                    <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                      <code className="text-xs font-mono flex-1">
                        {touristID.transactionHash}
                      </code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(touristID.transactionHash!)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => window.open(`https://etherscan.io/tx/${touristID.transactionHash}`, '_blank')}
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <QRCodeScanner onScan={(data) => console.log('Scanned:', data)}>
                    <Button variant="outline" size="sm">
                      <QrCode className="h-4 w-4 mr-2" />
                      Scan QR Code
                    </Button>
                  </QRCodeScanner>
                  
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download ID
                  </Button>
                </div>
              </motion.div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No digital ID available</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default VerificationPanel;
