import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Shield, Info, Users, Globe, Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import GuardianBuddy from '@/components/GuardianBuddy';
import heroImage from '@/assets/hero-image.jpg';

const Home: React.FC = () => {
  const [showGuardian, setShowGuardian] = useState(true);

  const features = [
    {
      icon: MapPin,
      title: 'Interactive Map',
      description: 'Discover hidden gems and popular attractions with our smart map.',
      color: 'text-primary',
      to: '/map'
    },
    {
      icon: Shield,
      title: 'Safety Dashboard',
      description: 'Real-time safety monitoring and emergency assistance.',
      color: 'text-safety-danger',
      to: '/safety'
    },
    {
      icon: Info,
      title: 'Tourist Info',
      description: 'Rich cultural insights, history, and local legends.',
      color: 'text-accent',
      to: '/info'
    },
    {
      icon: Users,
      title: 'Admin Portal',
      description: 'Monitor tourist activities and manage safety protocols.',
      color: 'text-secondary',
      to: '/admin'
    }
  ];

  const stats = [
    { label: 'Active Tourists', value: '1,247', icon: Users },
    { label: 'Safe Zones', value: '98%', icon: Shield },
    { label: 'Tourist Spots', value: '250+', icon: MapPin },
    { label: 'User Rating', value: '4.9⭐', icon: Star },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Beautiful tourist destination" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-secondary/60 to-accent/80" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-6 bg-white/20 text-white border-white/30">
              <Globe className="h-4 w-4 mr-2" />
              Safe, Smart & Fun Tourism
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6"
          >
            Tourist Buddy
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto"
          >
            Your intelligent travel companion for safe exploration, cultural discovery, and unforgettable adventures.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button asChild size="xl" variant="hero">
              <Link to="/map">
                <MapPin className="h-6 w-6 mr-2" />
                Explore Map
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
            
            <Button asChild size="xl" variant="safety">
              <Link to="/safety">
                <Shield className="h-6 w-6 mr-2" />
                Safety Dashboard
              </Link>
            </Button>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-bounce" />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Everything You Need for
              <span className="gradient-text"> Safe Travel</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools and features designed to make your journey both secure and memorable.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link to={feature.to}>
                  <Card className="h-full travel-card cursor-pointer group">
                    <CardContent className="p-6 text-center">
                      <div className="mb-4 flex justify-center">
                        <div className="p-3 rounded-full bg-muted group-hover:bg-primary/10 transition-colors duration-300">
                          <feature.icon className={`h-8 w-8 ${feature.color} group-hover:text-primary transition-colors duration-300`} />
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors duration-300">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto max-w-6xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted by Travelers Worldwide
            </h2>
            <p className="text-lg text-muted-foreground">
              Join thousands of happy travelers who choose safety and adventure.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="text-center p-6 travel-card">
                  <stat.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero text-white">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready for Your Next Adventure?
            </h2>
            <p className="text-xl mb-10 text-white/90">
              Start exploring with Tourist Buddy and discover the world safely and smartly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="xl" className="bg-white text-primary hover:bg-white/90">
                <Link to="/info">
                  <Info className="h-6 w-6 mr-2" />
                  Learn More
                </Link>
              </Button>
              <Button asChild size="xl" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                <Link to="/map">
                  <MapPin className="h-6 w-6 mr-2" />
                  Start Exploring
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Guardian Buddy */}
      <GuardianBuddy isVisible={showGuardian} onToggle={() => setShowGuardian(!showGuardian)} />
    </div>
  );
};

export default Home;