import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Shield, AlertCircle } from 'lucide-react';
import { GuideVerification } from '@/lib/blockchain';

interface VerificationBadgeProps {
  verification: GuideVerification | null;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

const VerificationBadge: React.FC<VerificationBadgeProps> = ({
  verification,
  size = 'md',
  showDetails = false,
}) => {
  if (!verification) {
    return (
      <Badge variant="destructive" className="flex items-center gap-1">
        <AlertCircle className="h-3 w-3" />
        Not Verified
      </Badge>
    );
  }

  const isExpired = new Date(verification.expiryDate) < new Date();
  const isExpiringSoon = new Date(verification.expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  const getBadgeVariant = () => {
    if (isExpired) return 'destructive';
    if (isExpiringSoon) return 'secondary';
    return 'default';
  };

  const getIcon = () => {
    if (isExpired) return <AlertCircle className="h-3 w-3" />;
    return <CheckCircle className="h-3 w-3" />;
  };

  const getText = () => {
    if (isExpired) return 'Expired';
    if (isExpiringSoon) return 'Expires Soon';
    return 'Verified on Blockchain';
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2',
  };

  return (
    <div className="flex items-center gap-2">
      <Badge 
        variant={getBadgeVariant()} 
        className={`flex items-center gap-1 ${sizeClasses[size]}`}
      >
        <Shield className="h-3 w-3" />
        {getIcon()}
        {getText()}
      </Badge>
      
      {showDetails && verification.transactionHash && (
        <div className="text-xs text-muted-foreground">
          <div>TX: {verification.transactionHash.slice(0, 8)}...{verification.transactionHash.slice(-8)}</div>
          <div>Block: {verification.blockNumber?.toLocaleString()}</div>
        </div>
      )}
    </div>
  );
};

export default VerificationBadge;
