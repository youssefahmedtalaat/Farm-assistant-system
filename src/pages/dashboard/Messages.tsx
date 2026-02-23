import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { 
  Inbox, 
  Clock, 
  Eye, 
  Reply, 
  CheckCircle2, 
  Search, 
  AlertCircle, 
  MessageCircle, 
  XCircle, 
  Trash2 
} from 'lucide-react';
import { useLanguage } from '../../utils/language';
import { messagesApi } from '../../utils/api';
import { notify } from '../../utils/notifications';

interface Message {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'resolved';
  created_at: string;
  replied_at?: string;
  user_id?: string;
}

export function MessagesPage() {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'read' | 'replied' | 'resolved'>('all');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      const data: any = await messagesApi.getAll();
      // Ensure data is an array
      const messagesArray = Array.isArray(data) ? data : (data.messages || []);
      setMessages(messagesArray);
    } catch (error) {
      console.error('Error fetching messages:', error);
      notify.error('Error', 'Failed to load messages');
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await messagesApi.updateStatus(id, newStatus);
      setMessages(messages.map(msg => 
        msg.id === id 
          ? { ...msg, status: newStatus as any, replied_at: newStatus === 'replied' ? new Date().toISOString() : msg.replied_at }
          : msg
      ));
      
      if (selectedMessage?.id === id) {
        setSelectedMessage(prev => prev ? { ...prev, status: newStatus as any } : null);
      }
      
      notify.success('Success', `Message marked as ${newStatus}`);
    } catch (error) {
      console.error('Error updating status:', error);
      notify.error('Error', 'Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    
    try {
      await messagesApi.delete(id);
      setMessages(messages.filter(msg => msg.id !== id));
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
      notify.success('Success', 'Message deleted');
    } catch (error) {
      console.error('Error deleting message:', error);
      notify.error('Error', 'Failed to delete message');
    }
  };

  const filteredMessages = messages.filter(msg => {
    const matchesSearch = 
      (msg.first_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (msg.last_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (msg.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (msg.subject || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (msg.message || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || msg.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: messages.length,
    new: messages.filter(m => m.status === 'new').length,
    read: messages.filter(m => m.status === 'read').length,
    replied: messages.filter(m => m.status === 'replied').length,
    resolved: messages.filter(m => m.status === 'resolved').length,
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge className="bg-blue-500 hover:bg-blue-600"><Clock className="w-3 h-3 mr-1" />New</Badge>;
      case 'read':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600"><Eye className="w-3 h-3 mr-1" />Read</Badge>;
      case 'replied':
        return <Badge className="bg-purple-500 hover:bg-purple-600"><Reply className="w-3 h-3 mr-1" />Replied</Badge>;
      case 'resolved':
        return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle2 className="w-3 h-3 mr-1" />Resolved</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#2D6A4F] mb-2">Messages</h1>
        <p className="text-gray-600">Manage inquiries and messages from farmers</p>
      </div>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-[#2D6A4F]">{stats.total}</p>
            </div>
            <Inbox className="w-8 h-8 text-[#2D6A4F]" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">New</p>
              <p className="text-2xl font-bold text-blue-600">{stats.new}</p>
            </div>
            <Clock className="w-8 h-8 text-blue-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Read</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.read}</p>
            </div>
            <Eye className="w-8 h-8 text-yellow-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Replied</p>
              <p className="text-2xl font-bold text-purple-600">{stats.replied}</p>
            </div>
            <Reply className="w-8 h-8 text-purple-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Resolved</p>
              <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
        </Card>
      </div>
      
      {/* Filters and Search */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
            <Button
              variant={statusFilter === 'all' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('all')}
              className={statusFilter === 'all' ? "bg-[#2D6A4F] hover:bg-[#2D6A4F]/90 text-white" : ""}
            >
              All
            </Button>
            <Button
              variant={statusFilter === 'new' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('new')}
              className={statusFilter === 'new' ? "bg-blue-600 hover:bg-blue-700 text-white" : ""}
            >
              New
            </Button>
            <Button
              variant={statusFilter === 'read' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('read')}
              className={statusFilter === 'read' ? "bg-yellow-600 hover:bg-yellow-700 text-white" : ""}
            >
              Read
            </Button>
            <Button
              variant={statusFilter === 'replied' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('replied')}
              className={statusFilter === 'replied' ? "bg-purple-600 hover:bg-purple-700 text-white" : ""}
            >
              Replied
            </Button>
            <Button
              variant={statusFilter === 'resolved' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('resolved')}
              className={statusFilter === 'resolved' ? "bg-green-600 hover:bg-green-700 text-white" : ""}
            >
              Resolved
            </Button>
          </div>
        </div>
      </Card>
      
      {/* Messages List and Detail */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-2 space-y-4">
          {isLoading ? (
            <div className="text-center py-12">Loading messages...</div>
          ) : filteredMessages.length === 0 ? (
            <Card className="p-12 text-center">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No messages found</p>
            </Card>
          ) : (
            filteredMessages.map((msg) => (
              <Card
                key={msg.id}
                className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                  selectedMessage?.id === msg.id ? 'ring-2 ring-[#2D6A4F]' : ''
                }`}
                onClick={() => setSelectedMessage(msg)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">
                        {msg.first_name} {msg.last_name}
                      </h3>
                      {getStatusBadge(msg.status)}
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{msg.email}</p>
                    <p className="font-medium text-gray-900">{msg.subject}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2 mb-2">{msg.message}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{formatDate(msg.created_at)}</span>
                  {msg.status === 'new' && (
                    <Badge className="bg-red-500 hover:bg-red-600 text-white">Unread</Badge>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>
        
        {/* Message Details */}
        <div className="lg:col-span-1">
          {selectedMessage ? (
            <Card className="p-6 sticky top-4">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-xl font-bold text-[#2D6A4F]">Message Details</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedMessage(null)}
                >
                  <XCircle className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-gray-600">Name</Label>
                  <p className="font-semibold">{selectedMessage.first_name} {selectedMessage.last_name}</p>
                </div>
                
                <div>
                  <Label className="text-gray-600">Email</Label>
                  <a href={`mailto:${selectedMessage.email}`} className="text-[#2D6A4F] hover:underline">
                    {selectedMessage.email}
                  </a>
                </div>
                
                <div>
                  <Label className="text-gray-600">Subject</Label>
                  <p className="font-semibold">{selectedMessage.subject}</p>
                </div>
                
                <div>
                  <Label className="text-gray-600">Message</Label>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 p-3 rounded-md">
                    {selectedMessage.message}
                  </p>
                </div>
                
                <div>
                  <Label className="text-gray-600">Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedMessage.status)}</div>
                </div>
                
                <div>
                  <Label className="text-gray-600">Submitted</Label>
                  <p className="text-sm">{formatDate(selectedMessage.created_at)}</p>
                </div>
                
                {selectedMessage.replied_at && (
                  <div>
                    <Label className="text-gray-600">Replied At</Label>
                    <p className="text-sm">{formatDate(selectedMessage.replied_at)}</p>
                  </div>
                )}
                
                <div className="pt-4 border-t space-y-2">
                  <Button
                    className="w-full bg-[#2D6A4F] hover:bg-[#2D6A4F]/90"
                    onClick={() => window.location.href = `mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                  >
                    <Reply className="w-4 h-4 mr-2" />
                    Reply via Email
                  </Button>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {selectedMessage.status !== 'read' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusChange(selectedMessage.id, 'read')}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Mark Read
                      </Button>
                    )}
                    {selectedMessage.status !== 'replied' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusChange(selectedMessage.id, 'replied')}
                      >
                        <Reply className="w-4 h-4 mr-1" />
                        Mark Replied
                      </Button>
                    )}
                    {selectedMessage.status !== 'resolved' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusChange(selectedMessage.id, 'resolved')}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        Resolve
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(selectedMessage.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-12 text-center">
              <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Select a message to view details</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}