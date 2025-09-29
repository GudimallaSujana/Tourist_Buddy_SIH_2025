import { ethers } from 'ethers';
import { Alchemy, Network } from 'alchemy-sdk';
import { ALCHEMY_API_KEY, ETHERSCAN_API_KEY, BLOCKCHAIN_CONFIG } from './config';

// Initialize Alchemy SDK
const alchemyConfig = {
  apiKey: ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET, // Change to Network.POLYGON_MAINNET for Polygon
};

const alchemy = new Alchemy(alchemyConfig);

// Provider for direct ethers.js interactions
const provider = new ethers.JsonRpcProvider(BLOCKCHAIN_CONFIG.ALCHEMY_URL);

// Types for our verification system
export interface GuideVerification {
  id: string;
  guideId: string;
  name: string;
  certification: string;
  issueDate: string;
  expiryDate: string;
  verified: boolean;
  transactionHash?: string;
  blockNumber?: number;
}

export interface BookingTransaction {
  id: string;
  bookingId: string;
  touristId: string;
  guideId: string;
  amount: string;
  currency: string;
  transactionHash: string;
  blockNumber: number;
  timestamp: string;
  status: 'pending' | 'confirmed' | 'failed';
}

export interface DigitalTouristID {
  id: string;
  touristId: string;
  tripDetails: {
    destination: string;
    startDate: string;
    endDate: string;
    emergencyContact: string;
  };
  transactionHash?: string;
  blockNumber?: number;
  valid: boolean;
}

// Blockchain Service Class
export class BlockchainService {
  private static instance: BlockchainService;

  private constructor() {}

  public static getInstance(): BlockchainService {
    if (!BlockchainService.instance) {
      BlockchainService.instance = new BlockchainService();
    }
    return BlockchainService.instance;
  }

  // Verify a transaction hash using Etherscan API
  async verifyTransaction(transactionHash: string): Promise<{
    verified: boolean;
    blockNumber?: number;
    timestamp?: string;
    from?: string;
    to?: string;
    value?: string;
  }> {
    try {
      const response = await fetch(
        `${BLOCKCHAIN_CONFIG.ETHERSCAN_URL}?module=proxy&action=eth_getTransactionByHash&txhash=${transactionHash}&apikey=${ETHERSCAN_API_KEY}`
      );
      
      const data = await response.json();
      
      if (data.error) {
        return { verified: false };
      }

      return {
        verified: true,
        blockNumber: parseInt(data.result.blockNumber, 16),
        timestamp: new Date(parseInt(data.result.timeStamp, 16) * 1000).toISOString(),
        from: data.result.from,
        to: data.result.to,
        value: ethers.formatEther(data.result.value),
      };
    } catch (error) {
      console.error('Error verifying transaction:', error);
      return { verified: false };
    }
  }

  // Get transaction receipt for additional verification
  async getTransactionReceipt(transactionHash: string): Promise<{
    success: boolean;
    gasUsed?: string;
    status?: number;
  }> {
    try {
      const receipt = await provider.getTransactionReceipt(transactionHash);
      
      if (!receipt) {
        return { success: false };
      }

      return {
        success: true,
        gasUsed: receipt.gasUsed.toString(),
        status: receipt.status,
      };
    } catch (error) {
      console.error('Error getting transaction receipt:', error);
      return { success: false };
    }
  }

  // Generate a mock verification certificate (in a real app, this would be minted as an NFT)
  generateVerificationCertificate(guideData: {
    guideId: string;
    name: string;
    certification: string;
    issueDate: string;
    expiryDate: string;
  }): GuideVerification {
    // In a real implementation, this would create an actual blockchain transaction
    // For now, we'll simulate it with a mock transaction hash
    const mockTransactionHash = `0x${Math.random().toString(16).substr(2, 64)}`;
    
    return {
      id: `cert_${guideData.guideId}_${Date.now()}`,
      guideId: guideData.guideId,
      name: guideData.name,
      certification: guideData.certification,
      issueDate: guideData.issueDate,
      expiryDate: guideData.expiryDate,
      verified: true,
      transactionHash: mockTransactionHash,
      blockNumber: Math.floor(Math.random() * 1000000) + 18000000, // Mock block number
    };
  }

  // Generate a mock booking transaction (in a real app, this would be recorded on-chain)
  generateBookingTransaction(bookingData: {
    bookingId: string;
    touristId: string;
    guideId: string;
    amount: string;
    currency: string;
  }): BookingTransaction {
    const mockTransactionHash = `0x${Math.random().toString(16).substr(2, 64)}`;
    
    return {
      id: `tx_${bookingData.bookingId}_${Date.now()}`,
      bookingId: bookingData.bookingId,
      touristId: bookingData.touristId,
      guideId: bookingData.guideId,
      amount: bookingData.amount,
      currency: bookingData.currency,
      transactionHash: mockTransactionHash,
      blockNumber: Math.floor(Math.random() * 1000000) + 18000000,
      timestamp: new Date().toISOString(),
      status: 'confirmed',
    };
  }

  // Generate a mock digital tourist ID (in a real app, this would be minted as an NFT)
  generateDigitalTouristID(touristData: {
    touristId: string;
    destination: string;
    startDate: string;
    endDate: string;
    emergencyContact: string;
  }): DigitalTouristID {
    const mockTransactionHash = `0x${Math.random().toString(16).substr(2, 64)}`;
    
    return {
      id: `id_${touristData.touristId}_${Date.now()}`,
      touristId: touristData.touristId,
      tripDetails: {
        destination: touristData.destination,
        startDate: touristData.startDate,
        endDate: touristData.endDate,
        emergencyContact: touristData.emergencyContact,
      },
      transactionHash: mockTransactionHash,
      blockNumber: Math.floor(Math.random() * 1000000) + 18000000,
      valid: true,
    };
  }

  // Check if a guide is verified
  async isGuideVerified(guideId: string): Promise<GuideVerification | null> {
    // In a real implementation, this would query the blockchain
    // For now, we'll return mock data
    const mockVerifications: GuideVerification[] = [
      {
        id: `cert_${guideId}_1`,
        guideId,
        name: 'Rajesh Kumar',
        certification: 'Certified Tourist Guide - Level 3',
        issueDate: '2024-01-15',
        expiryDate: '2025-01-15',
        verified: true,
        transactionHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
        blockNumber: 18500000,
      },
      {
        id: `cert_${guideId}_2`,
        guideId,
        name: 'Priya Sharma',
        certification: 'Certified Homestay Host - Level 2',
        issueDate: '2024-02-20',
        expiryDate: '2025-02-20',
        verified: true,
        transactionHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
        blockNumber: 18510000,
      },
    ];

    return mockVerifications.find(v => v.guideId === guideId) || null;
  }

  // Get booking transaction by ID
  async getBookingTransaction(bookingId: string): Promise<BookingTransaction | null> {
    // In a real implementation, this would query the blockchain
    // For now, we'll return mock data
    const mockTransactions: BookingTransaction[] = [
      {
        id: `tx_${bookingId}_1`,
        bookingId,
        touristId: 'tourist_123',
        guideId: 'guide_456',
        amount: '150.00',
        currency: 'USD',
        transactionHash: '0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba',
        blockNumber: 18520000,
        timestamp: '2024-09-28T10:30:00Z',
        status: 'confirmed',
      },
    ];

    return mockTransactions.find(t => t.bookingId === bookingId) || null;
  }

  // Get digital tourist ID
  async getDigitalTouristID(touristId: string): Promise<DigitalTouristID | null> {
    // In a real implementation, this would query the blockchain
    // For now, we'll return mock data
    const mockIDs: DigitalTouristID[] = [
      {
        id: `id_${touristId}_1`,
        touristId,
        tripDetails: {
          destination: 'Rajasthan, India',
          startDate: '2024-10-01',
          endDate: '2024-10-07',
          emergencyContact: '+91-9876543210',
        },
        transactionHash: '0xfedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210',
        blockNumber: 18530000,
        valid: true,
      },
    ];

    return mockIDs.find(id => id.touristId === touristId) || null;
  }

  // Generate QR code data for verification
  generateQRCodeData(type: 'guide' | 'booking' | 'tourist', id: string): string {
    const baseUrl = window.location.origin;
    return `${baseUrl}/verify/${type}/${id}`;
  }

  // Verify QR code data
  async verifyQRCode(qrData: string): Promise<{
    type: 'guide' | 'booking' | 'tourist' | 'invalid';
    data: GuideVerification | BookingTransaction | DigitalTouristID | null;
    valid: boolean;
  }> {
    try {
      const url = new URL(qrData);
      const pathParts = url.pathname.split('/');
      
      if (pathParts.length < 4 || pathParts[1] !== 'verify') {
        return { type: 'invalid', data: null, valid: false };
      }

      const type = pathParts[2] as 'guide' | 'booking' | 'tourist';
      const id = pathParts[3];

      switch (type) {
        case 'guide':
          const guideData = await this.isGuideVerified(id);
          return { type: 'guide', data: guideData, valid: !!guideData };
        
        case 'booking':
          const bookingData = await this.getBookingTransaction(id);
          return { type: 'booking', data: bookingData, valid: !!bookingData };
        
        case 'tourist':
          const touristData = await this.getDigitalTouristID(id);
          return { type: 'tourist', data: touristData, valid: !!touristData };
        
        default:
          return { type: 'invalid', data: null, valid: false };
      }
    } catch (error) {
      console.error('Error verifying QR code:', error);
      return { type: 'invalid', data: null, valid: false };
    }
  }
}

// Export singleton instance
export const blockchainService = BlockchainService.getInstance();
