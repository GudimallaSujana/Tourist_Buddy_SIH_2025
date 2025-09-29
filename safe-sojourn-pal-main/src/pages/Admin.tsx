import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Users, MapPin, AlertTriangle, Shield, Activity, Search, Filter, Eye, MessageSquare, Send, Phone, Mail, Clock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

interface ChatMessage {
  id: string;
  sender: 'admin' | 'tourist';
  message: string;
  timestamp: string;
  touristId?: string;
  touristName?: string;
}

const Admin: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSupportChat, setShowSupportChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'tourist',
      message: 'I need help finding my way back to the hotel. I\'m near the temple complex.',
      timestamp: '14:30',
      touristId: 'TB001247',
      touristName: 'John Doe'
    },
    {
      id: '2',
      sender: 'admin',
      message: 'Hello John! I can help you navigate back to your hotel. What\'s the name of your hotel?',
      timestamp: '14:31'
    },
    {
      id: '3',
      sender: 'tourist',
      message: 'It\'s the Grand Palace Hotel near the main market.',
      timestamp: '14:32',
      touristId: 'TB001247',
      touristName: 'John Doe'
    },
    {
      id: '4',
      sender: 'admin',
      message: 'Perfect! I\'m sending you the best route to Grand Palace Hotel. It should take about 15 minutes by walk.',
      timestamp: '14:33'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');

  // Mock data for admin dashboard
  const touristStats = {
    active: 1247,
    safeZones: 98,
    alerts: 5,
    avgSafety: 85
  };

  const recentAlerts = [
    {
      id: 1,
      tourist: 'John Doe',
      touristId: 'TB001247',
      type: 'SOS',
      location: 'Temple Complex, Zone A',
      timestamp: '2024-01-20 14:30:25',
      status: 'resolved',
      severity: 'high'
    },
    {
      id: 2,
      tourist: 'Sarah Wilson',
      touristId: 'TB001248',
      type: 'Geo-fence',
      location: 'Restricted Area B',
      timestamp: '2024-01-20 13:15:10',
      status: 'investigating',
      severity: 'medium'
    },
    {
      id: 3,
      tourist: 'Mike Chen',
      touristId: 'TB001249',
      type: 'Medical',
      location: 'Adventure Valley',
      timestamp: '2024-01-20 12:45:33',
      status: 'resolved',
      severity: 'high'
    }
  ];

  const activeTourists = [
    {
      id: 'TB001247',
      name: 'John Doe',
      location: 'Temple Complex',
      safetyLevel: 95,
      lastSeen: '2 mins ago',
      status: 'safe'
    },
    {
      id: 'TB001248',
      name: 'Sarah Wilson',
      location: 'Market Area',
      safetyLevel: 78,
      lastSeen: '5 mins ago',
      status: 'caution'
    },
    {
      id: 'TB001249',
      name: 'Mike Chen',
      location: 'Adventure Valley',
      safetyLevel: 60,
      lastSeen: '1 min ago',
      status: 'alert'
    },
    {
      id: 'TB001250',
      name: 'Emma Thompson',
      location: 'Heritage Walk',
      safetyLevel: 92,
      lastSeen: '3 mins ago',
      status: 'safe'
    }
  ];

  const touristClusters = [
    { location: 'Temple Complex', count: 45, safetyLevel: 95 },
    { location: 'Market Area', count: 38, safetyLevel: 82 },
    { location: 'Adventure Valley', count: 23, safetyLevel: 70 },
    { location: 'Heritage Walk', count: 31, safetyLevel: 90 }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-safety-danger';
      case 'medium': return 'bg-safety-warning';
      case 'low': return 'bg-safety-success';
      default: return 'bg-muted';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'safe': return 'text-safety-success';
      case 'caution': return 'text-safety-warning';
      case 'alert': return 'text-safety-danger';
      default: return 'text-muted-foreground';
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      sender: 'admin',
      message: newMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, message]);
    setNewMessage('');
    
    toast({
      title: "Message Sent",
      description: "Your response has been sent to the tourist",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border p-6">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Settings className="h-8 w-8 text-primary" />
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground">Monitor tourist activities and manage safety protocols</p>
            </div>
            
            <div className="flex gap-2">
              <Dialog open={showSupportChat} onOpenChange={setShowSupportChat}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Support Chat
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl h-[600px] flex flex-col">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Tourist Support Chat
                    </DialogTitle>
                  </DialogHeader>
                  
                  <div className="flex-1 flex flex-col space-y-4">
                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-muted/30 rounded-lg">
                      {chatMessages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] p-3 rounded-lg ${
                              msg.sender === 'admin'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-background border'
                            }`}
                          >
                            {msg.sender === 'tourist' && (
                              <div className="flex items-center gap-2 mb-2">
                                <User className="h-4 w-4" />
                                <span className="text-sm font-medium">{msg.touristName}</span>
                                <span className="text-xs text-muted-foreground">({msg.touristId})</span>
                              </div>
                            )}
                            <p className="text-sm">{msg.message}</p>
                            <p className="text-xs opacity-70 mt-1">{msg.timestamp}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Message Input */}
                    <div className="flex gap-2">
                      <Textarea
                        placeholder="Type your response to the tourist..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-1 min-h-[60px]"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                      />
                      <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Phone className="h-4 w-4 mr-2" />
                        Call Tourist
                      </Button>
                      <Button variant="outline" size="sm">
                        <Mail className="h-4 w-4 mr-2" />
                        Send Email
                      </Button>
                      <Button variant="outline" size="sm">
                        <MapPin className="h-4 w-4 mr-2" />
                        View Location
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Button>
                <Shield className="h-4 w-4 mr-2" />
                Emergency Protocol
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl p-4">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-3xl font-bold text-primary">{touristStats.active}</div>
                <div className="text-sm text-muted-foreground">Active Tourists</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardContent className="p-6 text-center">
                <Shield className="h-8 w-8 mx-auto mb-2 text-safety-success" />
                <div className="text-3xl font-bold text-safety-success">{touristStats.safeZones}%</div>
                <div className="text-sm text-muted-foreground">Safe Zone Coverage</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardContent className="p-6 text-center">
                <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-safety-warning" />
                <div className="text-3xl font-bold text-safety-warning">{touristStats.alerts}</div>
                <div className="text-sm text-muted-foreground">Active Alerts</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardContent className="p-6 text-center">
                <Activity className="h-8 w-8 mx-auto mb-2 text-secondary" />
                <div className="text-3xl font-bold text-secondary">{touristStats.avgSafety}%</div>
                <div className="text-sm text-muted-foreground">Avg Safety Level</div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tourists">Tourists</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="clusters">Live Map</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Recent Alerts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-safety-warning" />
                    Recent Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentAlerts.slice(0, 3).map((alert) => (
                      <div key={alert.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <div className="font-medium text-sm">{alert.tourist}</div>
                          <div className="text-xs text-muted-foreground">{alert.type} - {alert.location}</div>
                        </div>
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Tourist Clusters */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Tourist Clusters
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {touristClusters.map((cluster, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-sm">{cluster.location}</div>
                          <div className="text-xs text-muted-foreground">{cluster.count} tourists</div>
                        </div>
                        <div className="text-right">
                          <div className={`text-sm font-medium ${getStatusColor(
                            cluster.safetyLevel > 90 ? 'safe' : 
                            cluster.safetyLevel > 75 ? 'caution' : 'alert'
                          )}`}>
                            {cluster.safetyLevel}% safe
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tourists Tab */}
          <TabsContent value="tourists" className="space-y-6">
            <div className="flex gap-4 items-center">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tourist ID or name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>

            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tourist ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Current Location</TableHead>
                    <TableHead>Safety Level</TableHead>
                    <TableHead>Last Seen</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeTourists.map((tourist) => (
                    <TableRow key={tourist.id}>
                      <TableCell className="font-mono text-sm">{tourist.id}</TableCell>
                      <TableCell className="font-medium">{tourist.name}</TableCell>
                      <TableCell>{tourist.location}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-safety-success" />
                          {tourist.safetyLevel}%
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{tourist.lastSeen}</TableCell>
                      <TableCell>
                        <Badge variant={
                          tourist.status === 'safe' ? 'default' :
                          tourist.status === 'caution' ? 'secondary' : 'destructive'
                        }>
                          {tourist.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Alert Management</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tourist</TableHead>
                      <TableHead>Alert Type</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentAlerts.map((alert) => (
                      <TableRow key={alert.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{alert.tourist}</div>
                            <div className="text-sm text-muted-foreground font-mono">{alert.touristId}</div>
                          </div>
                        </TableCell>
                        <TableCell>{alert.type}</TableCell>
                        <TableCell>{alert.location}</TableCell>
                        <TableCell className="text-sm">{alert.timestamp}</TableCell>
                        <TableCell>
                          <Badge className={getSeverityColor(alert.severity)}>
                            {alert.severity}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={alert.status === 'resolved' ? 'default' : 'secondary'}>
                            {alert.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">View</Button>
                            {alert.status !== 'resolved' && (
                              <Button size="sm">Respond</Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Live Map Tab */}
          <TabsContent value="clusters" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Live Tourist Clusters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96 bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">Interactive Map</h3>
                    <p className="text-muted-foreground mb-4">
                      Real-time tourist locations and safety zones visualization
                    </p>
                    <Button>Launch Map View</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;