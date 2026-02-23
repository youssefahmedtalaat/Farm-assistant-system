import { useState, useEffect } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Mail, MapPin, Phone, MessageCircle, Send, Search, Filter, CheckCircle2, Clock, XCircle, Eye, Reply, Trash2, Inbox, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../utils/language';
import { useAuth } from '../utils/auth';
import { DashboardLayout } from '../components/DashboardLayout';
import { messagesApi } from '../utils/api';
import { notify } from '../utils/notifications';

interface ContactInquiry {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'resolved';
  createdAt: string;
  repliedAt?: string;
}

export function Contact() {
  const { t } = useLanguage();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await messagesApi.send({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        userId: user?.id
      });
      
      notify.success(t('contact.form.successTitle'), t('contact.form.successMessage'));
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Error sending message:', error);
      notify.error(t('contact.form.errorTitle'), t('contact.form.errorMessage'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout hideSidebar={false}>
      <div className="min-h-screen bg-[#FAF9F6] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-[#2D6A4F] mb-4">{t('contact.title')}</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="p-8">
              <h2 className="text-[#2D6A4F] mb-6">{t('contact.form.title')}</h2>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="firstName">{t('contact.form.firstName')}</Label>
                    <Input 
                      id="firstName" 
                      placeholder={t('contact.form.firstNamePlaceholder')} 
                      className="mt-2" 
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">{t('contact.form.lastName')}</Label>
                    <Input 
                      id="lastName" 
                      placeholder={t('contact.form.lastNamePlaceholder')} 
                      className="mt-2" 
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">{t('contact.form.email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t('contact.form.emailPlaceholder')}
                    className="mt-2"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="subject">{t('contact.form.subject')}</Label>
                  <Input
                    id="subject"
                    placeholder={t('contact.form.subjectPlaceholder')}
                    className="mt-2"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="message">{t('contact.form.message')}</Label>
                  <Textarea
                    id="message"
                    placeholder={t('contact.form.messagePlaceholder')}
                    rows={6}
                    className="mt-2"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full sm:w-auto bg-[#2D6A4F] hover:bg-[#2D6A4F]/90 rounded-full px-8"
                  disabled={isSubmitting}
                >
                  <Send className="w-4 h-4 mr-2" />
                  {isSubmitting ? 'Sending...' : t('contact.form.sendButton')}
                </Button>
              </form>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Quick Contact */}
            <Card className="p-6">
              <h3 className="text-[#2D6A4F] mb-4">{t('contact.info.title')}</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#2D6A4F]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-[#2D6A4F]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t('contact.info.email')}</p>
                    <a
                      href="mailto:support@farmerassistant.com"
                      className="text-gray-900 hover:text-[#2D6A4F]"
                    >
                      support@farmerassistant.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#2D6A4F]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-[#2D6A4F]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t('contact.info.phone')}</p>
                    <a href="tel:+1234567890" className="text-gray-900 hover:text-[#2D6A4F]">
                      +1 (234) 567-890
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#2D6A4F]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-[#2D6A4F]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t('contact.info.address')}</p>
                    <p className="text-gray-900">
                      {t('contact.info.addressLine1')}
                      <br />
                      {t('contact.info.addressLine2')}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Office Hours */}
            <Card className="p-6">
              <h3 className="text-[#2D6A4F] mb-4">{t('contact.hours.title')}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('contact.hours.mondayFriday')}</span>
                  <span className="text-gray-900">{t('contact.hours.mondayFridayTime')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('contact.hours.saturday')}</span>
                  <span className="text-gray-900">{t('contact.hours.saturdayTime')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('contact.hours.sunday')}</span>
                  <span className="text-gray-900">{t('contact.hours.sundayTime')}</span>
                </div>
              </div>
            </Card>

            {/* FarmBot CTA */}
            <Card className="p-6 bg-gradient-to-br from-[#2D6A4F] to-[#95D5B2] text-white">
              <div className="flex items-center gap-3 mb-4">
                <MessageCircle className="w-8 h-8" />
                <h3>{t('contact.farmbot.title')}</h3>
              </div>
              <p className="text-white/90 text-sm mb-4">
                {t('contact.farmbot.description')}
              </p>
              <Button className="w-full bg-white text-[#2D6A4F] hover:bg-white/90 rounded-full">
                {t('contact.farmbot.button')}
              </Button>
            </Card>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-12">
          <Card className="p-8">
            <h2 className="text-[#2D6A4F] mb-6">{t('contact.location.title')}</h2>
            <div className="bg-gray-100 rounded-xl h-96 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#2D6A4F]/5 to-[#95D5B2]/5" />
              <div className="relative text-center">
                <MapPin className="w-16 h-16 text-[#2D6A4F] mx-auto mb-4" />
                <p className="text-gray-800 mb-2">{t('contact.location.visit')}</p>
                <p className="text-gray-600">{t('contact.info.addressLine1')}, {t('contact.info.addressLine2')}</p>
                <Link to="/explore-farms">
                  <Button className="mt-4 bg-[#2D6A4F] hover:bg-[#2D6A4F]/90 rounded-full">
                    {t('contact.location.directions')}
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>

        {/* FAQ Links */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">{t('contact.faq.title')}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/about">
              <Button variant="outline" className="rounded-full">
                {t('contact.faq.aboutUs')}
              </Button>
            </Link>
            <Link to="/subscription">
              <Button variant="outline" className="rounded-full">
                {t('contact.faq.pricing')}
              </Button>
            </Link>
            <Button variant="outline" className="rounded-full">
              {t('contact.faq.helpCenter')}
            </Button>
          </div>
        </div>
      </div>
    </div>
    </DashboardLayout>
  );
}
