import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Download, Copy, QrCode, Shield, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface QRCodeGeneratorProps {
  touristId?: string;
  verificationUrl?: string;
  onGenerate?: (qrUrl: string, verificationUrl: string) => void;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({
  touristId,
  verificationUrl,
  onGenerate
}) => {
  const [customId, setCustomId] = useState(touristId || '');
  const [customUrl, setCustomUrl] = useState(verificationUrl || '');
  const [qrSize, setQrSize] = useState('400');
  const [errorCorrection, setErrorCorrection] = useState('H');
  const [margin, setMargin] = useState('1');

  // Generate verification URL
  const verificationData = useMemo(() => {
    if (customUrl) {
      return customUrl;
    }
    if (customId) {
      return `https://touristbuddy.in/verify?id=${customId}`;
    }
    return 'https://touristbuddy.in/verify?id=12345';
  }, [customId, customUrl]);

  // Generate Google Chart API QR URL
  const qrUrl = useMemo(() => {
    const baseUrl = 'https://chart.googleapis.com/chart';
    const params = new URLSearchParams({
      cht: 'qr',
      chs: `${qrSize}x${qrSize}`,
      chl: verificationData,
      choe: 'UTF-8',
      chld: `${errorCorrection}|${margin}`
    });
    return `${baseUrl}?${params.toString()}`;
  }, [verificationData, qrSize, errorCorrection, margin]);

  const handleGenerate = () => {
    if (onGenerate) {
      onGenerate(qrUrl, verificationData);
    }
    toast({
      title: "QR Code Generated",
      description: "QR code has been generated successfully!",
    });
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = `touristbuddy-qr-${customId || 'verification'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "QR Code Downloaded",
      description: "QR code has been saved to your device.",
    });
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(verificationData);
    toast({
      title: "URL Copied",
      description: "Verification URL has been copied to clipboard.",
    });
  };

  const handleCopyQRUrl = () => {
    navigator.clipboard.writeText(qrUrl);
    toast({
      title: "QR URL Copied",
      description: "QR code URL has been copied to clipboard.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            QR Code Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tourist ID</label>
              <Input
                placeholder="Enter tourist ID (e.g., 12345)"
                value={customId}
                onChange={(e) => setCustomId(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Custom Verification URL</label>
              <Input
                placeholder="https://touristbuddy.in/verify?id=12345"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
              />
            </div>
          </div>

          {/* QR Settings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Size (px)</label>
              <select
                value={qrSize}
                onChange={(e) => setQrSize(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="200">200x200 (Small)</option>
                <option value="300">300x300 (Medium)</option>
                <option value="400">400x400 (Large)</option>
                <option value="500">500x500 (Extra Large)</option>
                <option value="600">600x600 (Print)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Error Correction</label>
              <select
                value={errorCorrection}
                onChange={(e) => setErrorCorrection(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="L">L (Low ~7%)</option>
                <option value="M">M (Medium ~15%)</option>
                <option value="Q">Q (Quartile ~25%)</option>
                <option value="H">H (High ~30%)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Margin</label>
              <select
                value={margin}
                onChange={(e) => setMargin(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="0">0 (No margin)</option>
                <option value="1">1 (Small)</option>
                <option value="2">2 (Medium)</option>
                <option value="4">4 (Large)</option>
              </select>
            </div>
          </div>

          {/* Generated URL Display */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Generated Verification URL</label>
            <div className="flex gap-2">
              <Input
                value={verificationData}
                readOnly
                className="font-mono text-sm"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopyUrl}
                className="shrink-0"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleGenerate} className="flex items-center gap-2">
              <QrCode className="h-4 w-4" />
              Generate QR Code
            </Button>
            
            <Button
              variant="outline"
              onClick={handleDownload}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download PNG
            </Button>
            
            <Button
              variant="outline"
              onClick={handleCopyQRUrl}
              className="flex items-center gap-2"
            >
              <Copy className="h-4 w-4" />
              Copy QR URL
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* QR Code Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Generated QR Code
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
              <img
                src={qrUrl}
                alt="Tourist Verification QR Code"
                className="max-w-full h-auto"
                style={{ maxWidth: '400px' }}
              />
            </div>
            
            <div className="text-center space-y-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Ready for Verification
              </Badge>
              <p className="text-sm text-muted-foreground">
                Scan this QR code to verify tourist identity
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technical Details */}
      <Card>
        <CardHeader>
          <CardTitle>Technical Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-sm space-y-1">
            <p><strong>QR URL:</strong> <code className="text-xs bg-gray-100 px-1 rounded">{qrUrl}</code></p>
            <p><strong>Size:</strong> {qrSize}x{qrSize} pixels</p>
            <p><strong>Error Correction:</strong> {errorCorrection} (~{errorCorrection === 'L' ? '7%' : errorCorrection === 'M' ? '15%' : errorCorrection === 'Q' ? '25%' : '30%'} damage tolerance)</p>
            <p><strong>Margin:</strong> {margin} modules</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QRCodeGenerator;
