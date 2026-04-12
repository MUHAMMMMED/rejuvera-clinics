import {
  ChevronRight,
  Grid,
  Heart,
  Home,
  Image,
  Link2,
  MapPin,
  MessageCircle,
  Package,
  Phone,
  Sparkles,
  Users,
  Zap
} from 'lucide-react';
import React, { useState } from 'react';
import styles from './Footer.module.css';
import logo from './logo.png';

// Custom Instagram icon component
const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

// Custom Twitter/X icon component
const TwitterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
  </svg>
);

const Footer = ({ scrollToSection, setSelectedService, data }) => {
  const [activeTab, setActiveTab] = useState('quickLinks');

  const tabs = [
    { id: 'quickLinks', label: 'روابط سريعة', icon: Link2 },
    { id: 'services', label: 'خدماتنا', icon: Sparkles },
    { id: 'social', label: 'تواصل', icon: Phone }
  ];

  const servicesList = [
    { id: 'plastic', name: 'جراحة التجميل ونحت القوام', icon: Heart, emoji: '' },
    { id: 'derma', name: 'الجلدية والعناية بالبشرة', icon: Sparkles, emoji: '' },
    { id: 'laser', name: 'إزالة الشعر بالليزر', icon: Zap, emoji: '' },
    { id: 'women', name: 'الطب التجميلي النسائي', icon: Heart, emoji: '' }
  ];

  const socialLinks = [
    { id: 'phone', label: 'اتصل بنا', value: '+966 11 499 9959', icon: Phone, href: 'tel:+966114999959' },
    { id: 'whatsapp', label: 'واتساب', value: 'تواصل عبر واتساب', icon: MessageCircle, href: 'https://wa.me/966114999959' },
    { id: 'instagram', label: 'انستقرام', value: '@rejuveracenter', icon: InstagramIcon, href: 'https://www.instagram.com/rejuveracenter/' },
    { id: 'twitter', label: 'تويتر', value: '@rejuveraclinics', icon: TwitterIcon, href: 'https://x.com/rejuveraclinics' },
    { id: 'location', label: 'الموقع', value: 'الرياض، حي الرحمانية', icon: MapPin, href: 'https://maps.app.goo.gl/QmnDGj3QMrL7sFDT6' }
  ];

  const quickLinks = [
    { id: 'home', label: 'الرئيسية', icon: Home },
    { id: 'categories', label: 'الأقسام', icon: Grid },
    { id: 'services', label: 'خدماتنا', icon: Sparkles },
    { id: 'packages', label: 'الباقات', icon: Package },
    { id: 'gallery', label: 'النتائج', icon: Image },
    { id: 'doctors', label: 'أطباؤنا', icon: Users }
  ];

  const handleServiceClick = (serviceName) => {
    setSelectedService(serviceName);
    scrollToSection('services');
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        
        {/* Tabs Navigation */}
        <div className={styles.tabsNav}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={`${styles.tabBtn} ${activeTab === tab.id ? styles.active : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={18} className={styles.tabIcon} />
                <span className={styles.tabLabel}>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className={styles.tabContent}>
          
          {/* Quick Links Tab */}
          {activeTab === 'quickLinks' && (
            <div className={styles.quickLinksTab}>
              <div className={styles.brand}>
                <img src={logo} alt="Rejuvera" className={styles.logo} />
                <p className={styles.description}>
                  نلتزم بتقديم أعلى معايير الرفاهية والجودة في كل خطوة من رحلتك العلاجية.
                </p>
              </div>
              
              <div className={styles.linksGrid}>
                <div className={styles.linkGroup}>
                  <h4>روابط سريعة</h4>
                  <ul>
                    {quickLinks.map((link) => {
                      const Icon = link.icon;
                      return (
                        <li key={link.id}>
                          <button onClick={() => scrollToSection(link.id)}>
                            <Icon size={14} />
                            <span>{link.label}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Services Tab */}
          {activeTab === 'services' && (
            <div className={styles.servicesTab}>
              <div className={styles.brand}>
                <img src={logo} alt="Rejuvera" className={styles.logo} />
                <p className={styles.description}>
                  نقدم أحدث التقنيات الطبية التجميلية بأعلى معايير الجودة والسلامة.
                </p>
              </div>
              
              <div className={styles.servicesGrid}>
                {servicesList.map((service) => {
                  const Icon = service.icon;
                  return (
                    <div key={service.id} className={styles.serviceItem}>
                      <button onClick={() => handleServiceClick(service.name)}>
                        <span className={styles.serviceEmoji}>{service.emoji}</span>
                        <Icon size={16} className={styles.serviceIcon} />
                        <span className={styles.serviceName}>{service.name}</span>
                        <ChevronRight size={14} className={styles.serviceArrow} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Social Tab */}
          {activeTab === 'social' && (
            <div className={styles.socialTab}>
              <div className={styles.brand}>
                <img src={logo} alt="Rejuvera" className={styles.logo} />
                <p className={styles.description}>
                  تواصل معنا عبر قنوات التواصل الاجتماعي أو اتصل بنا مباشرة.
                </p>
              </div>
              
              <div className={styles.contactInfo}>
                {socialLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <a 
                      key={link.id}
                      href={link.href} 
                      target={link.id !== 'phone' ? "_blank" : undefined}
                      rel={link.id !== 'phone' ? "noopener noreferrer" : undefined}
                      className={styles.contactItem}
                    >
                      <div className={styles.contactIcon}>
                        <Icon size={18} />
                      </div>
                      <div className={styles.contactDetails}>
                        <span className={styles.contactLabel}>{link.label}</span>
                        <span className={styles.contactValue}>{link.value}</span>
                      </div>
                      <ChevronRight size={14} className={styles.contactArrow} />
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Payment Methods - Appears in all tabs */}
        <div className={styles.paymentSection}>
          {/* <div className={styles.paymentMethods}>
            <div className={styles.paymentBadge}>
              <img src="https://rejuvera-clinics.vercel.app/images/Tabby.png" alt="Tabby" />
            </div>
            <div className={styles.paymentBadge}>
              <img src="https://rejuvera-clinics.vercel.app/images/Tamara.png" alt="Tamara" />
            </div>
            <div className={styles.paymentBadge}>
              <img src="https://rejuvera-clinics.vercel.app/images/Emkan.png" alt="Emkan" />
            </div>
          </div> */}
        </div>

        {/* Bottom */}
        <div className={styles.bottom}>
          <p>© 2026 Rejuvera Clinics. جميع الحقوق محفوظة.</p>
          <div className={styles.legal}>
            <button>سياسة الخصوصية</button>
            <button>الشروط والأحكام</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;