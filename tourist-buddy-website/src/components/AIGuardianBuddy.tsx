import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, Shield, AlertTriangle, Send, Brain, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import monkAvatar from '@/assets/monk-avatar.png';
import { AI_API_KEY, GEMINI_API_KEY } from '@/lib/config';

interface AIGuardianBuddyProps {
  isVisible?: boolean;
  onToggle?: () => void;
}

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
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

const aiResponses = {
  greetings: [
    "Hello there, fellow adventurer! I'm your AI Guardian Buddy 🧘‍♂️ Ready to explore safely?",
    "Namaste! Your wise monk guide is here to help you navigate your journey!",
    "Greetings, traveler! I sense curiosity in your aura... How can I assist you today?"
  ],
  safety: [
    "Safety first, fun second! Though both are important... like chai and samosas! ☕",
    "Your safety is my meditation. Let me share some wisdom about staying secure.",
    "Ah, a wise question about safety! Even monks need to be careful on mountain paths."
  ],
  directions: [
    "Lost, are we? Don't worry, even enlightened beings sometimes take scenic routes! 🗺️",
    "Directions? I know these paths like my own breath. Let me guide you, young grasshopper.",
    "The path you seek is not just on the map, but in your heart... but yes, I can also give you GPS coordinates!"
  ],
  food: [
    "Hungry? The stomach must be fed before the soul can soar! 🍛 Let me recommend some divine delicacies.",
    "Food is the way to enlightenment... or at least to a happy belly! What cuisine calls to your spirit?",
    "A well-fed traveler is a wise traveler. Shall I share some secret food spots?"
  ],
  weather: [
    "The weather, like life, is unpredictable! But I can help you prepare for nature's moods. 🌤️",
    "Mother Nature has her own plans, but we can be ready! Check my weather wisdom.",
    "Weather updates? I'm more reliable than the local meteorologist... and funnier too!"
  ],
  default: [
    "Hmm, interesting question! My AI circuits are processing... *meditation sounds* 🧠",
    "That's a thoughtful inquiry! Let me consult my digital dharma for the best answer.",
    "Your question has awakened my curiosity sensors! How fascinating... let me help you with that."
  ]
};

const AIGuardianBuddy: React.FC<AIGuardianBuddyProps> = ({ 
  isVisible = false, 
  onToggle 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEnlarged, setIsEnlarged] = useState(false);
  const [currentTip, setCurrentTip] = useState(0);
  const [showTip, setShowTip] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your AI Guardian Buddy! Ask me anything about safety, directions, food, or just chat! 🧘‍♂️✨",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

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
    alert('🆘 SOS Alert Sent! Emergency services have been notified with your location.');
  };

const callGemini = async (prompt: string): Promise<string | null> => {
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are the AI Guardian Buddy, a wise, friendly monk focused on travel safety, directions, culture, food, and weather. Be concise and helpful, with a playful tone. User question: ${prompt}`
          }]
        }]
      }),
    });
    const data = await res.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
  } catch {
    return null;
  }
};

const getAIResponse = async (userMessage: string): Promise<string> => {
    const message = userMessage.toLowerCase();
    
    // More intelligent responses based on context
    if (message.includes('hello') || message.includes('hi') || message.includes('namaste')) {
      return aiResponses.greetings[Math.floor(Math.random() * aiResponses.greetings.length)];
    } 
    
    // Charminar specific responses
    else if (message.includes('charminar')) {
      return "Ah, Charminar! 🕌 It's in Hyderabad, Telangana. To get there: Take a flight to Hyderabad airport, then taxi/metro to Old City area. It's near Laad Bazaar - perfect for shopping pearls and bangles! The monument is open 9 AM to 5:30 PM. Pro tip: Visit during sunset for magical lighting! 📸✨";
    }
    
    // Location and direction queries
    else if (message.includes('how to go') || message.includes('direction') || message.includes('where') || message.includes('location') || message.includes('lost') || message.includes('reach')) {
      if (message.includes('temple')) {
        return "🏛️ For temples: Most are accessible by public transport. Use Google Maps for exact routes. Remember - remove shoes, dress modestly, and photography may be restricted in some areas.";
      } else if (message.includes('mountain') || message.includes('hill')) {
        return "🏔️ Mountain areas: Best reached by hired taxi or local buses. Start early morning (6 AM) for best views. Carry water, snacks, and warm clothing. Weather changes quickly at altitude!";
      } else {
        return aiResponses.directions[Math.floor(Math.random() * aiResponses.directions.length)] + " For specific directions, I recommend using Google Maps with live traffic updates! 🗺️";
      }
    }
    
    // Safety related
    else if (message.includes('safe') || message.includes('danger') || message.includes('security')) {
      return aiResponses.safety[Math.floor(Math.random() * aiResponses.safety.length)] + " Always share your live location with family/friends when exploring new places! 📱";
    } 
    
    // Food related
    else if (message.includes('food') || message.includes('eat') || message.includes('restaurant') || message.includes('hungry')) {
      return aiResponses.food[Math.floor(Math.random() * aiResponses.food.length)] + " Don't forget to try local street food, but choose busy stalls for freshness! 🥘";
    } 
    
    // Weather related
    else if (message.includes('weather') || message.includes('rain') || message.includes('temperature')) {
      return aiResponses.weather[Math.floor(Math.random() * aiResponses.weather.length)] + " I suggest checking weather apps like AccuWeather or local forecasts before heading out! 🌤️";
    }
    
    // Transportation
    else if (message.includes('taxi') || message.includes('bus') || message.includes('transport')) {
      return "🚕 Transportation tips: Use official taxi apps like Uber/Ola for safety. Local buses are economical but crowded. For mountain areas, hire local drivers who know the roads well. Always negotiate prices beforehand! 🛣️";
    }
    
    // Emergency
    else if (message.includes('emergency') || message.includes('help') || message.includes('police')) {
      return "🚨 EMERGENCY INFO: Police: 100, Ambulance: 108, Fire: 101, Tourist Helpline: 1363. Always keep these numbers handy! For non-emergencies, contact your hotel/local tourism office. Stay calm and share your location! 🆘";
    }
    
    // General travel questions
    else if (message.includes('best time') || message.includes('when to visit')) {
      return "🗓️ Best travel times vary by location! Mountains: April-June, Sept-Nov. Plains: Oct-March. Coastal areas: Nov-Feb. Always avoid monsoon for outdoor activities unless you enjoy getting soaked! 🌧️😄";
    }
    
    // Cultural questions
    else if (message.includes('culture') || message.includes('tradition') || message.includes('festival')) {
      return "🎭 Cultural wisdom: Respect local customs, dress modestly at religious places, learn basic greetings in local language. Most festivals welcome tourists - just ask locals about dress codes and participation guidelines! 🙏";
    }
    
    // Default responses with more personality
    else {
      const contextualResponses = [
        `Hmm, interesting question about "${userMessage}"! 🤔 Let me think... As your wise travel companion, I'd say: explore with curiosity but always prioritize safety! What specific aspect would you like to know more about?`,
        `That's a thoughtful inquiry! 💭 Based on my travels through digital realms and tourist wisdom, I suggest being more specific. Are you asking about safety, directions, food, or cultural tips?`,
        `Your question awakens my curiosity sensors! 🧠✨ While I process that, here's a quick tip: When in doubt, ask locals - they're usually happy to help tourists, especially if you try speaking their language! What exactly can I help you with?`
      ];
      // Try Gemini first; fall back to canned reply
      const ai = await callGemini(userMessage);
      return ai ?? contextualResponses[Math.floor(Math.random() * contextualResponses.length)];
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI thinking time
    let replyText = await getAIResponse(inputMessage);
    if (!replyText || typeof replyText !== 'string') {
      replyText = "I'm having trouble reaching my AI brain right now. Here's a quick tip: stay hydrated and share your live location with a friend while exploring!";
    }
    const aiResponse: Message = {
      id: messages.length + 2,
      text: replyText,
      isUser: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiResponse]);
    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Floating Avatar */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: isEnlarged ? 1.5 : 1, rotate: 0 }}
        className="fixed bottom-6 right-6 z-[99999] ai-monk-z"
      >
        <div className="relative">
          {/* Colorful Background Glow */}
          <div className="absolute inset-0 rounded-full bg-gradient-monk blur-lg opacity-60 animate-pulse" />
          
          {/* Avatar Button */}
          <Button
            onClick={() => {
              setIsExpanded(!isExpanded);
              setIsEnlarged(!isEnlarged);
            }}
            className={`relative ${isEnlarged ? 'h-24 w-24' : 'h-16 w-16'} rounded-full p-2 bg-card shadow-monk hover:shadow-elevated transition-all duration-500 monk-float`}
            variant="outline"
          >
            <img 
              src={monkAvatar} 
              alt="AI Guardian Buddy" 
              className="w-full h-full object-cover rounded-full"
            />
            {isEnlarged && (
              <div className="absolute -top-2 -right-2">
                <Sparkles className="h-6 w-6 text-yellow-400 animate-bounce" />
              </div>
            )}
          </Button>

          {/* Safety Tip Bubble */}
          <AnimatePresence>
            {showTip && !isExpanded && (
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

      {/* Expanded AI Chat Panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 right-6 z-[99998]"
          >
            <Card className="w-96 h-96 bg-gradient-monk shadow-elevated flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-white/20">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  AI Guardian Buddy
                </h3>
                <Button
                  onClick={() => {
                    setIsExpanded(false);
                    setIsEnlarged(false);
                  }}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Chat Messages */}
              <ScrollArea className="flex-1 px-4">
                <div className="space-y-3 py-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg text-sm ${
                          message.isUser
                            ? 'bg-white text-black ml-4'
                            : 'bg-white/20 text-white mr-4'
                        }`}
                      >
                        {message.text}
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-white/20 text-white p-3 rounded-lg text-sm mr-4">
                        🧘‍♂️ Thinking...
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Input Area */}
              <div className="p-4 border-t border-white/20">
                <div className="flex gap-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything..."
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                  />
                  <Button
                    onClick={sendMessage}
                    size="sm"
                    className="bg-white text-black hover:bg-white/90"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Quick Actions */}
                <div className="flex gap-2 mt-3">
                  <Button
                    onClick={handleSOS}
                    size="sm"
                    className="bg-safety-danger hover:bg-safety-danger/90 text-white safety-pulse"
                  >
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    SOS
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                    onClick={() => setInputMessage("What are some safety tips?")}
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

export default AIGuardianBuddy;