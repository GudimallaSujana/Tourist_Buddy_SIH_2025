import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { QrCode, Camera, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { blockchainService } from '@/lib/blockchain';

interface QRCodeScannerProps {
  onScan: (data: any) => void;
  children?: React.ReactNode;
}

const QRCodeScanner: React.FC<QRCodeScannerProps> = ({ onScan, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [qrData, setQrData] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleScan = async () => {
    if (!qrData.trim()) {
      setError('Please enter QR code data');
      return;
    }

    setIsScanning(true);
    setError(null);
    setScanResult(null);

    try {
      const result = await blockchainService.verifyQRCode(qrData);
      
      if (result.valid) {
        setScanResult(result);
        onScan(result.data);
      } else {
        setError('Invalid QR code or verification failed');
      }
    } catch (err) {
      setError('Error scanning QR code');
      console.error('QR scan error:', err);
    } finally {
      setIsScanning(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // In a real implementation, you would use a QR code scanning library
    // For now, we'll just show a placeholder
    setError('File upload not implemented yet. Please enter QR code data manually.');
  };

  const resetScanner = () => {
    setQrData('');
    setScanResult(null);
    setError(null);
    setIsScanning(false);
  };

  const getResultIcon = () => {
    if (!scanResult) return null;
    
    switch (scanResult.type) {
      case 'guide':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'booking':
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      case 'tourist':
        return <CheckCircle className="h-5 w-5 text-purple-500" />;
      default:
        return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getResultTitle = () => {
    if (!scanResult) return '';
    
    switch (scanResult.type) {
      case 'guide':
        return 'Guide Verification';
      case 'booking':
        return 'Booking Transaction';
      case 'tourist':
        return 'Tourist Digital ID';
      default:
        return 'Verification Result';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm">
            <QrCode className="h-4 w-4 mr-2" />
            Scan QR Code
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            QR Code Scanner
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Manual QR Data Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Enter QR Code Data:</label>
            <Input
              placeholder="Paste QR code data here..."
              value={qrData}
              onChange={(e) => setQrData(e.target.value)}
              className="font-mono text-xs"
            />
          </div>

          {/* File Upload (Placeholder) */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Or Upload QR Code Image:</label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1"
              >
                <Camera className="h-4 w-4 mr-2" />
                Upload Image
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Scan Button */}
          <Button
            onClick={handleScan}
            disabled={isScanning || !qrData.trim()}
            className="w-full"
          >
            {isScanning ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Scanning...
              </>
            ) : (
              <>
                <QrCode className="h-4 w-4 mr-2" />
                Scan QR Code
              </>
            )}
          </Button>

          {/* Error Display */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}

          {/* Scan Result */}
          {scanResult && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                {getResultIcon()}
                <span className="font-medium text-green-800">{getResultTitle()}</span>
              </div>
              
              <div className="p-3 bg-gray-50 border rounded-lg">
                <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                  {JSON.stringify(scanResult.data, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={resetScanner}
              className="flex-1"
            >
              Reset
            </Button>
            <Button
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRCodeScanner;
