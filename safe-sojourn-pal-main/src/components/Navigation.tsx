import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MapPin, Shield, Info, Lock, Settings, Globe, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState('EN');
  const location = useLocation();

  const navigationItems = [
    { path: '/', icon: MapPin, label: 'Home', color: 'text-primary' },
    { path: '/map', icon: MapPin, label: 'Explore Map', color: 'text-secondary' },
    { path: '/safety', icon: Shield, label: 'Safety', color: 'text-safety-danger' },
    { path: '/info', icon: Info, label: 'Tourist Info', color: 'text-accent' },
    { path: '/security', icon: Lock, label: 'Security & Verification', color: 'text-red-600' },
    { path: '/admin', icon: Settings, label: 'Admin', color: 'text-muted-foreground' },
  ];

  const languages = ['EN', 'HI', 'ES', 'FR'];

  const toggleLanguage = () => {
    const currentIndex = languages.indexOf(language);
    const nextIndex = (currentIndex + 1) % languages.length;
    setLanguage(languages[nextIndex]);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:block fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-gradient-hero flex items-center justify-center">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">Tourist Buddy</h1>
                <p className="text-xs text-muted-foreground">Safe, Smart & Fun</p>
              </div>
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center gap-6">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-muted ${
                    location.pathname === item.path 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <item.icon className={`h-4 w-4 ${
                    location.pathname === item.path ? 'text-primary' : item.color
                  }`} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </div>

            {/* Language Toggle */}
            <Button
              onClick={toggleLanguage}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Globe className="h-4 w-4" />
              {language}
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        {/* Mobile Header */}
        <div className="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-b border-border">
          <div className="flex items-center justify-between p-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-hero flex items-center justify-center">
                <MapPin className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold gradient-text">Tourist Buddy</span>
            </Link>

            <div className="flex items-center gap-2">
              <Button
                onClick={toggleLanguage}
                variant="outline"
                size="sm"
              >
                {language}
              </Button>
              <Button
                onClick={() => setIsOpen(!isOpen)}
                variant="outline"
                size="sm"
              >
                {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="fixed top-16 left-0 right-0 z-30 bg-background/95 backdrop-blur-md border-b border-border">
            <div className="p-4 space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                    location.pathname === item.path 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <item.icon className={`h-5 w-5 ${
                    location.pathname === item.path ? 'text-primary' : item.color
                  }`} />
                  <span className="font-medium">{item.label}</span>
                  {item.path === '/safety' && (
                    <Badge variant="destructive" className="ml-auto">Live</Badge>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Spacer for fixed navigation */}
      <div className="h-20 md:h-24" />
    </>
  );
};

export default Navigation;