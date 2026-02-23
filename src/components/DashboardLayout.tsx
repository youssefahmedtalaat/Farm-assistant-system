import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Card } from './ui/card';
import { Button } from './ui/button';
import {
  Home,
  Sprout,
  Bell,
  MapPin,
  CreditCard,
  Settings,
  Menu,
  X,
  User,
  Languages,
  MessageCircle,
} from 'lucide-react';
import { useAuth } from '../utils/auth';
import { useLanguage } from '../utils/language';
import { notify } from '../utils/notifications';

interface DashboardLayoutProps {
  children: React.ReactNode;
  hideSidebar?: boolean;
}

export function DashboardLayout({ children, hideSidebar = false }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const { t, language, setLanguage } = useLanguage();

  const isAdmin = user?.role === 'admin';

  const menuItems = isAdmin
    ? [
        { name: t('nav.home'), icon: <Home className="w-5 h-5" />, path: '/dashboard' },
        { name: t('nav.profile'), icon: <User className="w-5 h-5" />, path: '/profile' },
        { name: 'Messages', icon: <MessageCircle className="w-5 h-5" />, path: '/dashboard/messages' },
        { name: t('common.notifications'), icon: <Bell className="w-5 h-5" />, path: '/dashboard/notifications' },
        { name: t('common.settings'), icon: <Settings className="w-5 h-5" />, path: '/dashboard/settings' },
      ]
    : [
        { name: t('nav.home'), icon: <Home className="w-5 h-5" />, path: '/dashboard' },
        { name: t('dashboard.myCrops'), icon: <Sprout className="w-5 h-5" />, path: '/dashboard/crops' },
        { name: t('dashboard.exploreFarms'), icon: <MapPin className="w-5 h-5" />, path: '/explore-farms' },
        { name: t('nav.profile'), icon: <User className="w-5 h-5" />, path: '/profile' },
        { name: t('common.notifications'), icon: <Bell className="w-5 h-5" />, path: '/dashboard/notifications' },
        { name: t('dashboard.subscription'), icon: <CreditCard className="w-5 h-5" />, path: '/dashboard/subscription' },
        { name: t('common.settings'), icon: <Settings className="w-5 h-5" />, path: '/dashboard/settings' },
      ];

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      {/* Mobile Menu Button */}
      {!hideSidebar && (
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <h2 className="text-[#2D6A4F]">{t('nav.dashboard')}</h2>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
              className="rounded-full"
            >
              <Languages className="w-4 h-4 mr-1" />
              {language === 'en' ? 'ع' : 'EN'}
            </Button>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2">
              {sidebarOpen ? (
                <X className="w-6 h-6 text-gray-600" />
              ) : (
                <Menu className="w-6 h-6 text-gray-600" />
              )}
            </button>
          </div>
        </div>
      )}

      <div className="flex">
        {/* Sidebar */}
        {!hideSidebar && (
          <aside
            className={`${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } lg:translate-x-0 fixed lg:sticky top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 transition-transform z-40 flex flex-col`}
          >
          <div className="p-6 border-b border-gray-200">
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 bg-gradient-to-br from-[#2D6A4F] to-[#95D5B2] rounded-xl flex items-center justify-center">
                <Sprout className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-[#2D6A4F]">{t('app.name')}</p>
                <p className="text-xs text-gray-500">
                  {user?.fullName || user?.email?.split('@')[0] || (isAdmin ? 'Admin' : 'Farmer')}
                  {isAdmin && <span className="ml-1 text-[#2D6A4F]">(Admin)</span>}
                </p>
              </div>
            </Link>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? 'bg-[#2D6A4F] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {!isAdmin && (
            <div className="p-4 border-t border-gray-200">
              <Card className="p-4 bg-gradient-to-br from-[#2D6A4F] to-[#95D5B2]">
                <p className="text-sm text-white mb-2">{t('dashboard.upgradePremium')}</p>
                <p className="text-xs text-white/80 mb-3">
                  {t('dashboard.upgradeCta')}
                </p>
                <Link 
                  to="/subscription"
                  onClick={() => {
                    notify.info('Viewing Plans', 'Browse all available subscription plans and features');
                  }}
                >
                  <Button className="w-full bg-white text-[#2D6A4F] hover:bg-white/90 rounded-full text-sm">
                    {t('dashboard.upgradeNow')}
                  </Button>
                </Link>
              </Card>
            </div>
          )}
          </aside>
        )}

        {/* Main Content */}
        <main className={`${hideSidebar ? 'w-full' : 'flex-1'} p-4 lg:p-8`}>
          {/* Language Switcher */}
          <div className={`${hideSidebar ? 'flex' : 'hidden lg:flex'} justify-end mb-4`}>
            <Button
              variant="outline"
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
              className="rounded-full"
            >
              <Languages className="w-4 h-4 mr-2" />
              {language === 'en' ? 'العربية' : 'English'}
            </Button>
          </div>
          
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

