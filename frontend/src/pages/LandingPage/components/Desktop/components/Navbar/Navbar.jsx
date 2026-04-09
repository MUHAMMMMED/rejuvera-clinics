import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';
import logo from './logo.png';

const Navbar = ({ 
  scrolled, 
  mobileMenuOpen, 
  activeSection, 
  scrollToSection, 
  setMobileMenuOpen,
  isHomePage = false  // خاصية جديدة لتحديد إذا كنا في الصفحة الرئيسية
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: 'home', label: 'الرئيسية', path: '/' },
    { id: 'about', label: 'من نحن', path: '/about' },
    { id: 'categories', label: 'الأقسام', path: '/categories' },
    { id: 'services', label: 'خدماتنا', path: '/services' },
    { id: 'packages', label: 'الباقات', path: '/packages' },
    { id: 'gallery', label: 'النتائج', path: '/gallery' },
    { id: 'doctors', label: 'أطباؤنا', path: '/doctors' },
    { id: 'faq', label: 'الأسئلة الشائعة', path: '/faq' }
  ];

  // التحقق من الرابط النشط
  const isActive = (item) => {
    if (isHomePage && scrollToSection) {
      // في الصفحة الرئيسية: نستخدم activeSection
      return activeSection === item.id;
    } else {
      // في الصفحات الأخرى: نستخدم current path
      if (item.id === 'home') {
        return location.pathname === '/';
      }
      return location.pathname === item.path;
    }
  };

  // معالج الضغط على الرابط
  const handleNavClick = (item) => {
    if (isHomePage && scrollToSection) {
      // في الصفحة الرئيسية: نمرر إلى scrollToSection
      scrollToSection(item.id);
    } else {
      // في الصفحات الأخرى: ننتقل باستخدام React Router
      if (item.id === 'home') {
        navigate('/');
      } else {
        navigate(item.path);
      }
    }
    setMobileMenuOpen(false);
  };

  // إغلاق الموبايل مينو عند الضغط على أي رابط
  const handleMobileNavClick = (item) => {
    handleNavClick(item);
  };

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''} ${mobileMenuOpen ? styles.mobileOpen : ''}`}>
      <div className={styles.navInner}>
        {/* اللوجو - يضغط على اللوجو يودي للرئيسية */}
        <div className={styles.logoArea} onClick={() => {
          navigate('/');
          setMobileMenuOpen(false);
        }} style={{ cursor: 'pointer' }}>
          <img 
            src={logo}
            alt="Rejuvera Clinics" 
            className={styles.logoImg} 
          />
        </div>

        {/* روابط الديسكتوب */}
        <div className={styles.navLinksArea}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item)}
              className={`${styles.navLink} ${isActive(item) ? styles.active : ''}`}
            >
              <span>{item.label}</span>
              {isActive(item) && <span className={styles.activeDot} />}
            </button>
          ))}
        </div>

        {/* زر الاتصال - يظل يعمل في كل الصفحات */}
        <a href="tel:+966114999959" className={styles.contactPhoneBtn}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" />
          </svg>
          <span>اتصل بنا</span>
        </a>

        {/* زر القائمة للموبايل */}
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

      {/* القائمة الجانبية للموبايل */}
      <div className={`${styles.mobileMenuPanel} ${mobileMenuOpen ? styles.open : ''}`}>
        <div className={styles.mobileMenuContainer}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMobileNavClick(item)}
              className={`${styles.mobileNavLink} ${isActive(item) ? styles.active : ''}`}
            >
              <span>{item.label}</span>
              {isActive(item) && <span className={styles.mobileActiveDot} />}
            </button>
          ))}
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