import React from 'react';
import { Icons } from '../../common/Icons/Icons';
import './Sidebar.css';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'الرئيسية', icon: Icons.Dashboard },          // أول حاجة، نظرة عامة
    { id: 'appointments', label: 'المواعيد', icon: Icons.Appointments },   // المواعيد مهمة يوميًا
    { id: 'analytics', label: 'التحليلات', icon: Icons.Analytics },        // تقارير الأداء والتحليلات
    { id: 'doctors', label: 'الأطباء', icon: Icons.Doctors },              // إدارة الكوادر الطبية
    { id: 'services', label: 'الخدمات', icon: Icons.Services },            // الخدمات المتاحة
    { id: 'categories', label: 'التصنيفات', icon: Icons.Categories },      // تصنيفات الخدمات
    { id: 'packages', label: 'الباقات', icon: Icons.Packages },            // الباقات والعروض
    { id: 'devices', label: 'الأجهزة', icon: Icons.Dashboard },            // الأجهزة المتاحة في العيادة
    { id: 'blogs', label: 'المقالات', icon: Icons.Services },              // محتوى الموقع والمقالات
    { id: 'gallery', label: 'المعرض', icon: Icons.Gallery },               // صور ووسائط العيادة
    { id: 'faqs', label: 'الأسئلة', icon: Icons.FAQ },                     // الأسئلة المتكررة
    { id: 'tracking', label: 'التتبع', icon: Icons.Tracking },             // تتبع الحملات أو المستخدمين
    { id: 'siteinfo', label: 'معلومات الموقع', icon: Icons.SiteInfo },     // إعدادات ومعلومات عامة
  ];

  return (
    <>
      {/* Sidebar for desktop */}
      <aside className="sidebar-desktop">
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">✨</span>
            <h1>ريجوفيرا</h1>
          </div>
        </div>
        <nav className="sidebar-nav">
          {menuItems.map(item => (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <item.icon />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <p>© 2025 ريجوفيرا كلينيك</p>
        </div>
      </aside>

      {/* Bottom navigation for mobile */}
      <div className="bottom-nav">
        {menuItems.map(item => (
          <button
            key={item.id}
            className={`bottom-nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            <item.icon />
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </>
  );
};

export default Sidebar;