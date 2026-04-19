import React from 'react';
import styles from './Navbar.module.css';
import logo from './logo.png';
// استيراد Link من react-router-dom (أو next/link إذا كنت تستخدم Next.js)
// للتوضيح: هذا الكود يفترض أنك تستخدم react-router-dom
import { Link } from 'react-router-dom';

const Navbar = ({ scrolled, mobileMenuOpen, activeSection, scrollToSection, setMobileMenuOpen, data }) => {
  
  // تعريف العناصر مع إضافة خاصية new 'type'
  const navItems = [
    { id: 'home', label: 'الرئيسية', type: 'section' },
    { id: 'about', label: 'من نحن', type: 'section' },
    { id: 'categories', label: 'الأقسام', type: 'section' },
    { id: 'services', label: 'خدماتنا', type: 'section' },
    { id: 'packages', label: 'الباقات', type: 'section' },
    { id: 'gallery', label: 'النتائج', type: 'section' },
    { id: 'doctors', label: 'أطباؤنا', type: 'section' },
    { id: 'faq', label: 'الأسئلة الشائعة', type: 'section' },
    { id: 'device', label: 'الأجهزة', path: '/devices', type: 'link' },      // تغيير النوع إلى link
    { id: 'blog', label: 'المدونة', path: '/blog', type: 'link' }            // تغيير النوع إلى link
  ];

  const handleNavClick = (sectionId) => {
    scrollToSection(sectionId);
    setMobileMenuOpen(false);
  };

  // دالة مساعدة لتحديد ما إذا كان العنصر نشطًا (للتنسيق فقط)
  const isActive = (item) => {
    if (item.type === 'section') {
      return activeSection === item.id;
    }
    // بالنسبة للروابط، يمكنك إضافة منطق لتحديد active بناءً على المسار الحالي
    // هذا مثال بسيط، يمكنك تطويره حسب احتياجاتك
    return false; 
  };

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''} ${mobileMenuOpen ? styles.mobileOpen : ''}`}>
      <div className={styles.navInner}>
        {/* اللوجو */}
        <div className={styles.logoArea}>
          <img 
            src={logo}
            alt="Rejuvera Clinics" 
            className={styles.logoImg} 
          />
        </div>

        {/* روابط الديسكتوب */}
        <div className={styles.navLinksArea}>
          {navItems.map((item) => {
            // إذا كان العنصر من نوع رابط (link)، نستخدم <Link> أو <a>
            if (item.type === 'link') {
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`${styles.navLink} ${isActive(item) ? styles.active : ''}`}
                  onClick={() => setMobileMenuOpen(false)} // غلق القائمة في الموبايل عند الضغط
                >
                  <span>{item.label}</span>
                </Link>
              );
            }
            
            // إذا كان العنصر من نوع قسم (section)، نستخدم الزر مع scrollToSection
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`${styles.navLink} ${activeSection === item.id ? styles.active : ''}`}
              >
                <span>{item.label}</span>
                {activeSection === item.id && <span className={styles.activeDot} />}
              </button>
            );
          })}
        </div>

        {/* زر الاتصال - يبقى كما هو */}
        <a href="tel:+966114999959" className={styles.contactPhoneBtn}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" />
          </svg>
          <span>اتصل بنا</span>
        </a>

        {/* زر القائمة للموبايل - يبقى كما هو */}
        <button 
          className={styles.mobileMenuToggle} 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="قائمة الموبايل"
        >
          <div className={`${styles.hamburger} ${mobileMenuOpen ? styles.active : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
      </div>

      {/* القائمة الجانبية للموبايل - معدلة لنفس المنطق */}
      <div className={`${styles.mobileMenuPanel} ${mobileMenuOpen ? styles.open : ''}`}>
        <div className={styles.mobileMenuContainer}>
          {navItems.map((item) => {
            // نفس المنطق المطبق في الديسكتوب ولكن للقائمة الجانبية
            if (item.type === 'link') {
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`${styles.mobileNavLink} ${isActive(item) ? styles.active : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>{item.label}</span>
                </Link>
              );
            }
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`${styles.mobileNavLink} ${activeSection === item.id ? styles.active : ''}`}
              >
                <span>{item.label}</span>
                {activeSection === item.id && <span className={styles.mobileActiveDot} />}
              </button>
            );
          })}
          
          <a href="tel:+966114999959" className={styles.mobileContactBtn}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" />
            </svg>
            اتصل بنا الآن
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;