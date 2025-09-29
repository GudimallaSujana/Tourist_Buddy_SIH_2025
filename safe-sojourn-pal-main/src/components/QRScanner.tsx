import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Camera, 
  CameraOff, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  QrCode,
  Shield,
  ExternalLink
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface QRScannerProps {
  onScan?: (data: string) => void;
  onError?: (error: string) => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScan, onError }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Check for camera permission
  useEffect(() => {
    const checkPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach(track => track.stop());
        setHasPermission(true);
      } catch (error) {
        setHasPermission(false);
        setScanError('Camera permission denied. Please allow camera access to scan QR codes.');
      }
    };
    checkPermission();
  }, []);

  const startScanning = async () => {
    try {
      setScanError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsScanning(true);
        
        // Start scanning loop
        scanQRCode();
      }
    } catch (error) {
      setScanError('Failed to access camera. Please check permissions.');
      onError?.('Camera access failed');
    }
  };

  const stopScanning = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
    setScannedData(null);
  };

  const scanQRCode = () => {
    if (!isScanning || !videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get image data for QR code detection
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    
    // Simple QR code detection (in a real app, you'd use a library like jsQR)
    // For demo purposes, we'll simulate detection
    setTimeout(() => {
      if (isScanning) {
        // Simulate QR code detection
        const mockData = 'https://touristbuddy.in/verify?id=12345';
        handleQRDetected(mockData);
      }
    }, 2000);

    // Continue scanning
    if (isScanning) {
      requestAnimationFrame(scanQRCode);
    }
  };

  const handleQRDetected = (data: string) => {
    setScannedData(data);
    setIsScanning(false);
    stopScanning();
    onScan?.(data);
    
    toast({
      title: "QR Code Scanned",
      description: "Tourist verification QR code detected successfully!",
    });
  };

  const handleManualInput = (data: string) => {
    setScannedData(data);
    onScan?.(data);
    
    toast({
      title: "Manual Input",
      description: "Verification URL entered manually.",
    });
  };

  const openVerificationUrl = () => {
    if (scannedData) {
      window.open(scannedData, '_blank');
    }
  };

  const resetScanner = () => {
    setScannedData(null);
    setScanError(null);
    stopScanning();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            QR Code Scanner
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Camera Permission Status */}
          {hasPermission === false && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Camera permission is required to scan QR codes. Please enable camera access in your browser settings.
              </AlertDescription>
            </Alert>
          )}

          {/* Scanner Controls */}
          <div className="flex flex-col items-center space-y-4">
            {!isScanning && !scannedData && (
              <div className="text-center space-y-2">
                <Camera className="h-12 w-12 mx-auto text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Click "Start Scanning" to begin QR code detection
                </p>
              </div>
            )}

            {/* Video Element (Hidden) */}
            <div className="hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full max-w-md"
              />
              <canvas ref={canvasRef} />
            </div>

            {/* Scanner Status */}
            {isScanning && (
              <div className="text-center space-y-2">
                <div className="animate-pulse">
                  <Camera className="h-12 w-12 mx-auto text-blue-500" />
                </div>
                <p className="text-sm text-blue-600">Scanning for QR codes...</p>
                <p className="text-xs text-muted-foreground">
                  Point camera at QR code
                </p>
              </div>
            )}

            {/* Scan Results */}
            {scannedData && (
              <div className="w-full space-y-4">
                <div className="text-center space-y-2">
                  <CheckCircle className="h-12 w-12 mx-auto text-green-500" />
                  <p className="text-sm font-medium text-green-600">QR Code Detected!</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-medium mb-2">Verification URL:</p>
                  <code className="text-xs bg-white p-2 rounded border block break-all">
                    {scannedData}
                  </code>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={openVerificationUrl}
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Open Verification
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={resetScanner}
                  >
                    Scan Another
                  </Button>
                </div>
              </div>
            )}

            {/* Error Display */}
            {scanError && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>{scanError}</AlertDescription>
              </Alert>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
              {!isScanning && !scannedData && (
                <Button
                  onClick={startScanning}
                  disabled={hasPermission === false}
                  className="flex items-center gap-2"
                >
                  <Camera className="h-4 w-4" />
                  Start Scanning
                </Button>
              )}
              
              {isScanning && (
                <Button
                  onClick={stopScanning}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <CameraOff className="h-4 w-4" />
                  Stop Scanning
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Manual Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Manual Verification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Enter Verification URL</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="https://touristbuddy.in/verify?id=12345"
                className="flex-1 p-2 border rounded-md text-sm"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const target = e.target as HTMLInputElement;
                    if (target.value.trim()) {
                      handleManualInput(target.value.trim());
                      target.value = '';
                    }
                  }
                }}
              />
              <Button
                size="sm"
                onClick={(e) => {
                  const input = (e.target as HTMLElement).parentElement?.querySelector('input') as HTMLInputElement;
                  if (input?.value.trim()) {
                    handleManualInput(input.value.trim());
                    input.value = '';
                  }
                }}
              >
                Verify
              </Button>
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground">
            Enter the verification URL manually if QR scanning is not available.
          </p>
        </CardContent>
      </Card>

      {/* Verification Status */}
      {scannedData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Verification Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="default" className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  QR Code Scanned
                </Badge>
                <Badge variant="secondary">Ready for Verification</Badge>
              </div>
              
              <div className="text-sm space-y-1">
                <p><strong>Status:</strong> QR code successfully detected</p>
                <p><strong>Next Step:</strong> Click "Open Verification" to proceed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QRScanner;

