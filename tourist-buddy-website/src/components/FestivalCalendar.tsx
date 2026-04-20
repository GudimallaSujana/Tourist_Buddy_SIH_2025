import React, { useEffect, useMemo, useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, MapPin, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import festivalImage from '@/assets/festival-celebration.jpg';
import { UNSPLASH_ACCESS_KEY } from '@/lib/config';

interface Festival {
  id: number;
  name: string;
  date: string;
  month: number;
  day: number;
  year: number;
  description: string;
  image: string;
  activities: string[];
  location: string;
  duration: string;
  highlights: string[];
  ticketPrice: string;
  contactInfo: string;
}
// Loaded from Calendarific API
const useCalendarific = (country: string, year: number) => {
  const [holidays, setHolidays] = useState<Festival[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUnsplashImage = async (query: string): Promise<string> => {
    try {
      const res = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&client_id=${UNSPLASH_ACCESS_KEY}`);
      const data = await res.json();
      return data?.results?.[0]?.urls?.regular || festivalImage;
    } catch {
      return festivalImage;
    }
  };

  useEffect(() => {
    const fetchHolidays = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = `https://calendarific.com/api/v2/holidays?api_key=7x9vyqnTXcJ1noofiNEKUZ5rQQS5VjaK&country=${country}&year=${year}`;
        const res = await fetch(url);
        const data = await res.json();
        const holidaysData = data?.response?.holidays || [];
        
        // Process holidays and fetch images
        const processedHolidays = await Promise.all(holidaysData.map(async (h: any, idx: number): Promise<Festival> => {
          const dt = h?.date?.datetime || {};
          const iso = h?.date?.iso || '';
          const name: string = h?.name || '';
          
          // Create search query for Unsplash
          let searchQuery = name.toLowerCase();
          if (searchQuery.includes('diwali') || searchQuery.includes('deepavali')) searchQuery = 'diwali festival lights';
          else if (searchQuery.includes('holi')) searchQuery = 'holi festival colors';
          else if (searchQuery.includes('christmas')) searchQuery = 'christmas celebration';
          else if (searchQuery.includes('eid')) searchQuery = 'eid festival celebration';
          else if (searchQuery.includes('pongal') || searchQuery.includes('makar')) searchQuery = 'pongal harvest festival';
          else if (searchQuery.includes('independence') || searchQuery.includes('republic')) searchQuery = 'independence day celebration';
          else searchQuery = `${name} festival celebration`;
          
          const image = await fetchUnsplashImage(searchQuery);
          
          return {
            id: idx + 1,
            name,
            date: iso,
            month: Number(dt.month) || new Date(iso).getMonth() + 1,
            day: Number(dt.day) || new Date(iso).getDate(),
            year: Number(dt.year) || new Date(iso).getFullYear(),
            description: h?.description || 'Holiday',
            image,
            activities: [],
            location: h?.locations === 'All' ? 'India' : (Array.isArray(h?.locations) ? h.locations.join(', ') : String(h?.locations || 'India')),
            duration: '1 day',
            highlights: [h?.primary_type || 'Holiday'],
            ticketPrice: '—',
            contactInfo: '—',
          };
        }));
        
        setHolidays(processedHolidays);
      } catch (e) {
        setError('Failed to load holidays');
        setHolidays([]);
      } finally {
        setLoading(false);
      }
    };
    fetchHolidays();
  }, [country, year]);

  return { holidays, loading, error };
};

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const FestivalCalendar: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedFestival, setSelectedFestival] = useState<Festival | null>(null);
  const { holidays, loading, error } = useCalendarific('IN', useMemo(() => new Date().getFullYear(), []));

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const getFestivalsForMonth = (month: number, year: number) => {
    return holidays.filter(festival => festival.month === month + 1 && festival.year === year);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const monthFestivals = getFestivalsForMonth(currentMonth, currentYear);
    
    const days = [];
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayFestivals = monthFestivals.filter(festival => festival.day === day);
      
      days.push(
        <div key={day} className="p-2 border border-border rounded-lg min-h-[80px] relative">
          <div className="font-medium text-sm mb-1">{day}</div>
          {dayFestivals.map(festival => (
            <Dialog key={festival.id}>
              <DialogTrigger asChild>
                <div
                  className="text-xs bg-primary text-primary-foreground rounded px-1 py-0.5 cursor-pointer hover:bg-primary/90 mb-1 block truncate"
                  onClick={() => setSelectedFestival(festival)}
                >
                  {festival.name}
                </div>
              </DialogTrigger>
            </Dialog>
          ))}
        </div>
      );
    }
    
    return days;
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Calendar className="h-6 w-6" />
          Festival Calendar
        </h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h3 className="text-lg font-semibold min-w-[180px] text-center">
            {monthNames[currentMonth]} {currentYear}
          </h3>
          <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {loading && (
        <Card>
          <CardContent className="p-4">Loading holidays…</CardContent>
        </Card>
      )}
      {error && (
        <Card>
          <CardContent className="p-4 text-destructive">{error}</CardContent>
        </Card>
      )}

      {/* Calendar Grid */}
      <Card>
        <CardHeader>
          <div className="grid grid-cols-7 gap-2 text-sm font-medium text-muted-foreground">
            <div className="text-center p-2">Sun</div>
            <div className="text-center p-2">Mon</div>
            <div className="text-center p-2">Tue</div>
            <div className="text-center p-2">Wed</div>
            <div className="text-center p-2">Thu</div>
            <div className="text-center p-2">Fri</div>
            <div className="text-center p-2">Sat</div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {renderCalendar()}
          </div>
        </CardContent>
      </Card>

      {/* Festival List for Current Month */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">
          Festivals in {monthNames[currentMonth]} {currentYear}
        </h3>
        {getFestivalsForMonth(currentMonth, currentYear).length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              No festivals scheduled for this month.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {getFestivalsForMonth(currentMonth, currentYear).map(festival => (
              <Dialog key={festival.id}>
                <DialogTrigger asChild>
                  <Card className="cursor-pointer hover:shadow-lg transition-all travel-card">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <img 
                          src={festival.image} 
                          alt={festival.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1">{festival.name}</h4>
                          <Badge className="mb-2">
                            <Calendar className="h-3 w-3 mr-1" />
                            {festival.date}
                          </Badge>
                          <p className="text-sm text-muted-foreground mb-2">{festival.description}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {festival.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {festival.duration}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                
                {/* Festival Details Dialog */}
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-2xl">{festival.name}</DialogTitle>
                  </DialogHeader>
                  
                  <div className="space-y-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <img 
                        src={festival.image} 
                        alt={festival.name}
                        className="w-full md:w-1/2 h-64 object-cover rounded-lg"
                      />
                      <div className="flex-1 space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Event Details</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>{festival.date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              <span>{festival.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <span>{festival.duration}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              <span>{festival.ticketPrice}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-2">Contact Information</h4>
                          <p className="text-sm text-muted-foreground">{festival.contactInfo}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Description</h4>
                      <p className="text-muted-foreground">{festival.description}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Activities</h4>
                      <div className="flex flex-wrap gap-2">
                        {festival.activities.map((activity, i) => (
                          <Badge key={i} variant="secondary">
                            {activity}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Highlights</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {festival.highlights.map((highlight, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-primary">•</span>
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FestivalCalendar;