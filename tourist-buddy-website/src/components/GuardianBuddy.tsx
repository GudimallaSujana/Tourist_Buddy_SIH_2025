import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, Shield, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import monkAvatar from '@/assets/monk-avatar.png';

interface GuardianBuddyProps {
  isVisible?: boolean;
  onToggle?: () => void;
}

const safetyTips = [
  "🌧️ Umbrella Alert: Don't trust the clouds, they look suspicious today!",
  "🐒 Beware of monkeys - they like your snacks more than you do!",
  "📱 Keep your phone charged, I can't help you if I'm sleeping!",
  "🚶‍♂️ Stay on marked trails, I don't do wilderness rescue!",
  "💧 Drink water regularly, dehydration makes bad decisions!",
  "🌙 Night adventures? Make sure someone knows where you are!",
  "📸 Taking selfies? Watch your step, gravity is unforgiving!",
  "🎒 Pack light, your back will thank you later!",
];

const GuardianBuddy: React.FC<GuardianBuddyProps> = ({ 
  isVisible = false, 
  onToggle 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentTip, setCurrentTip] = useState(0);
  const [showTip, setShowTip] = useState(false);

  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setCurrentTip((prev) => (prev + 1) % safetyTips.length);
        setShowTip(true);
        setTimeout(() => setShowTip(false), 5000);
      }, 15000);

      return () => clearInterval(interval);
    }
  }, [isVisible]);

  const handleSOS = () => {
    // Mock SOS functionality
    alert('🆘 SOS Alert Sent! Emergency services have been notified with your location.');
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Floating Avatar */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <div className="relative">
          {/* Colorful Background Glow */}
          <div className="absolute inset-0 rounded-full bg-gradient-monk blur-lg opacity-60 animate-pulse" />
          
          {/* Avatar Button */}
          <Button
            onClick={() => setIsExpanded(!isExpanded)}
            className="relative h-16 w-16 rounded-full p-2 bg-card shadow-monk hover:shadow-elevated transition-all duration-300 monk-float"
            variant="outline"
          >
            <img 
              src={monkAvatar} 
              alt="Guardian Buddy" 
              className="w-full h-full object-cover rounded-full"
            />
          </Button>

          {/* Safety Tip Bubble */}
          <AnimatePresence>
            {showTip && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.8 }}
                className="absolute bottom-full right-0 mb-4 max-w-xs"
              >
                <Card className="p-3 bg-monk-background border-monk-primary shadow-monk">
                  <p className="text-sm font-medium text-foreground">
                    {safetyTips[currentTip]}
                  </p>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Expanded Control Panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 right-6 z-40"
          >
            <Card className="p-4 w-72 bg-gradient-monk shadow-elevated">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">Guardian Buddy</h3>
                <Button
                  onClick={() => setIsExpanded(false)}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-3">
                {/* Safety Status */}
                <div className="flex items-center gap-2 p-2 bg-white/20 rounded-lg">
                  <Shield className="h-4 w-4 text-safety-success" />
                  <span className="text-sm text-white">Status: Safe Zone</span>
                </div>

                {/* Emergency SOS */}
                <Button
                  onClick={handleSOS}
                  className="w-full bg-safety-danger hover:bg-safety-danger/90 text-white safety-pulse"
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Emergency SOS
                </Button>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                  >
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Tips
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                  >
                    <Shield className="h-4 w-4 mr-1" />
                    Safety
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GuardianBuddy;